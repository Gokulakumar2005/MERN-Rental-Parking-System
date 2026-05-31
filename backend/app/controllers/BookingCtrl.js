import { PaymentModel } from "../models/PaymentModel.js";
import { BookingModel } from "../models/BookingModel.js";
import { SlotModel } from "../models/ParkingSlot.js";
import razorpay from "../../config/razorpay.js";
import UserModel from "../models/UserModel.js";
import crypto from "crypto";
import { createOrderSchema, verifyPaymentSchema, walletPaymentSchema } from "../validations/BookingValidationSchema.js";
import NotificationModel from "../models/NotificationModel.js";
import { paginate } from "../utils/pagination.js";
import { PaymentValidationSchema } from "../validations/PaymentValidation.js";
import { NotificationValidationSchema } from "../validations/NotificationValidation.js";


const BookingCtrl = {};



BookingCtrl.createOrder = async (req, res) => {
    console.log("CREATE ORDER REQUEST BODY:", req.body);
    try {
        const { error, value } = createOrderSchema.validate(req.body);

        if (error) {
            console.log("CREATE ORDER VALIDATION ERROR:", error.details);
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const { amount } = value;

        const options = {
            amount: amount * 100, // INR to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        // console.log("RAZORPAY ORDER CREATED:", order);

        res.status(200).json(order);

    } catch (error) {
        console.error("RAZORPAY CREATE ORDER CATCH ERROR:", error);
        res.status(500).json({
            message: "Error creating order",
            error: error.message,
        });
    }
};



BookingCtrl.verifyPayment = async (req, res) => {
    console.log({ "Data inside the VerifyPayment ": req.body });
    try {


        const { error, value } = verifyPaymentSchema.validate(req.body, {
            abortEarly: false
        });

        if (error) {
            console.log("VALIDATION ERROR:", error.details);
            return res.status(400).json({
                success: false,
                errors: error.details.map(e => e.message)
            });
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingData
        } = value;

        // console.log("bookingData:", bookingData);
        // console.log("slotcount:", bookingData?.slotcount);

        if (!bookingData || !bookingData.Amount) {
            return res.status(400).json({
                success: false,
                message: "Missing booking data or amount"
            });
        }

        const findArea = await SlotModel.findById(bookingData.slotId)
        if (!findArea) {
            return res.status(400).json({
                message: "Something Went Wrong"
            });
        }
        // console.log({ "Find Area": findArea });
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        // console.log("EXPECTED SIGNATURE:", expectedSignature);
        // console.log("RECEIVED SIGNATURE:", razorpay_signature);

        if (expectedSignature === razorpay_signature) {

            const slotArray = bookingData.slotcount || [];

            const paymentData = {
                userId: bookingData.userId.toString(),
                VendorId: bookingData.vendorId.toString(),
                slotcount: slotArray.length,
                amount: Number(bookingData.Amount),
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                PaymentStatus: "completed"
            };
            const { error: paymentErr } = PaymentValidationSchema.validate(paymentData);
            if (paymentErr) {
                console.error("Payment Validation Error:", paymentErr.details);
            }
            const payment = new PaymentModel(paymentData);
            await payment.save();


            const booking = new BookingModel({
                slotId: bookingData.slotId,
                userId: bookingData.userId,
                vendorId: bookingData.vendorId,
                vehicletype: bookingData.vehicletype,
                vehiclesNumber: bookingData.vehiclesNumber,
                Based: bookingData.Based,
                startTime: bookingData.startTime,
                endTime: bookingData.endTime,
                Amount: Number(bookingData.Amount),
                Area: findArea.Area,
                BookedSlots: slotArray,
                paymentId: razorpay_payment_id,
                status: "Booked"
            });

            await booking.save();

            const VendorID = bookingData.vendorId;
            const Amount = Number(bookingData.Amount);

            await UserModel.findByIdAndUpdate(VendorID, { $inc: { wallet: Amount } });

            // Create notification for the vendor
            const notifData = {
                recipient: VendorID.toString(),
                sender: bookingData.userId.toString(),
                message: `New slot booked for ${bookingData.vehicletype}! Amount: ₹${Amount}`,
                type: "booking",
                data: {
                    bookingId: booking._id.toString(),
                    slotId: bookingData.slotId.toString()
                }
            };
            const { error: notifErr } = NotificationValidationSchema.validate(notifData);
            if (notifErr) {
                console.error("Notification Validation Error:", notifErr.details);
            }
            const notification = new NotificationModel(notifData);
            await notification.save();

            // Emit to the vendor specifically via their user-specific room
            if (global.io) {
                global.io.to(`user_${VendorID}`).emit("notification", notification);
                global.io.emit("bookingCreated", {
                    message: "new Slot Booked",
                    booking
                });
            }

            return res.json({
                success: true,
                message: "Payment verified & booking confirmed",
                booking,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid signature",
            });
        }

    } catch (error) {
        console.error("VERIFY ERROR:", error);
        res.status(500).json({
            message: "Verification failed",
            error: error.message,
        });
    }
};



BookingCtrl.fetchBookings = async (req, res) => {
    const { search, status } = req.query;
    const userId = req.userId;
    try {
        let query = {};
        if (req.role !== "admin") {
            query = {
                $or: [{ userId: userId }, { vendorId: userId }]
            };
        }

        if (search) {
            query.$and = query.$and || [];
            query.$and.push({
                $or: [
                    { vehiclesNumber: { $regex: search, $options: "i" } },
                    { Area: { $regex: search, $options: "i" } }
                ]
            });
        }

        if (status && status !== "all") {
            query.status = status;
        }

        const result = await paginate(BookingModel, req.query, {
            query: query,
            sort: { createdAt: -1 },
            populate: { path: "slotId", select: "name address Area location facilities" }
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



BookingCtrl.fetchPayments = async (req, res) => {
    const userId = req.userId;
    try {
        const query = { userId };
        const response = await paginate(PaymentModel, req.query, {
            query: query,
            sort: { createdAt: -1 }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

BookingCtrl.CancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const findBooking = await BookingModel.findById(id);
        // console.log({ "find Booking In ctrl": findBooking }) 

        if (!findBooking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }
        const { userId, Amount } = findBooking

        const currentTime = new Date();
        const bookingStartTime = new Date(findBooking.startTime);
        const timeDiff = bookingStartTime - currentTime;
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (hoursDiff < 8) {
            return res.status(400).json({
                message: "Booking cannot be cancelled before 8 hours"
            });
        }

        const updatedBooking = await BookingModel.findByIdAndUpdate(
            id,
            { $set: { status: "Cancelled" } },
            { new: true }
        );

        // userId
        const updateUserWallet = await UserModel.findByIdAndUpdate(userId, { $inc: { wallet: Amount } })
        await updateUserWallet.save();

        // Create notification for the vendor
        const cancellationNotifData = {
            recipient: updatedBooking.vendorId.toString(),
            sender: updatedBooking.userId.toString(),
            message: `Booking cancelled for ${updatedBooking.vehicletype}. Booking ID: ${updatedBooking._id.toString()}`,
            type: "cancellation",
            data: {
                bookingId: updatedBooking._id.toString(),
                slotId: updatedBooking.slotId.toString()
            }
        };
        const { error: cancellationNotifErr } = NotificationValidationSchema.validate(cancellationNotifData);
        if (cancellationNotifErr) {
            console.error("Cancellation Notification Validation Error:", cancellationNotifErr.details);
        }
        const cancellationNotification = new NotificationModel(cancellationNotifData);
        await cancellationNotification.save();

        // Emit to the vendor specifically via their user-specific room
        if (global.io) {
            global.io.to(`user_${updatedBooking.vendorId}`).emit("notification", cancellationNotification);
        }

        return res.status(200).json({
            message: "Booking Cancelled",
            booking: updatedBooking
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        });
    }
};

BookingCtrl.fetchAllBookingWithoutPagination = async (req, res)=> {
    try {
        const result = await BookingModel.find()
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.json(error.message);
    }
}

BookingCtrl.walletPay = async (req, res) => {
    console.log("WALLET PAY REQUEST BODY:", req.body);
    try {
        const { error, value } = walletPaymentSchema.validate(req.body, {
            abortEarly: false
        });

        if (error) {
            console.log("VALIDATION ERROR:", error.details);
            return res.status(400).json({
                success: false,
                errors: error.details.map(e => e.message)
            });
        }

        const { bookingData } = value;

        // Verify slot exists
        const slot = await SlotModel.findById(bookingData.slotId);
        if (!slot) {
            return res.status(400).json({
                success: false,
                message: "Parking slot not found"
            });
        }

        // Verify user exists and check wallet balance
        const user = await UserModel.findById(bookingData.userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const bookingAmount = Number(bookingData.Amount);
        if (user.wallet < bookingAmount) {
            return res.status(400).json({
                success: false,
                message: `Insufficient wallet balance. Required: ₹${bookingAmount}, Available: ₹${user.wallet}`
            });
        }

        // Deduct user wallet
        user.wallet -= bookingAmount;
        await user.save();

        // Increment vendor wallet
        await UserModel.findByIdAndUpdate(bookingData.vendorId, { $inc: { wallet: bookingAmount } });

        const slotArray = bookingData.slotcount || [];

        // Save payment record
        const paymentData = {
            userId: bookingData.userId.toString(),
            VendorId: bookingData.vendorId.toString(),
            slotcount: slotArray.length,
            amount: bookingAmount,
            orderId: `wallet_ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            paymentId: `wallet_pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            PaymentStatus: "completed"
        };
        const { error: paymentErr } = PaymentValidationSchema.validate(paymentData);
        if (paymentErr) {
            console.error("Payment Validation Error:", paymentErr.details);
        }
        const payment = new PaymentModel(paymentData);
        await payment.save();

        // Save booking record
        const booking = new BookingModel({
            slotId: bookingData.slotId,
            userId: bookingData.userId,
            vendorId: bookingData.vendorId,
            vehicletype: bookingData.vehicletype,
            vehiclesNumber: bookingData.vehiclesNumber,
            Based: bookingData.Based,
            startTime: bookingData.startTime,
            endTime: bookingData.endTime,
            Amount: bookingAmount,
            Area: slot.Area,
            BookedSlots: slotArray,
            paymentId: payment.paymentId,
            status: "Booked"
        });
        await booking.save();

        // Create notification for the vendor
        const notifData = {
            recipient: bookingData.vendorId.toString(),
            sender: bookingData.userId.toString(),
            message: `New slot booked for ${bookingData.vehicletype}! Amount: ₹${bookingAmount} (Paid via Wallet)`,
            type: "booking",
            data: {
                bookingId: booking._id.toString(),
                slotId: bookingData.slotId.toString()
            }
        };
        const { error: notifErr } = NotificationValidationSchema.validate(notifData);
        if (notifErr) {
            console.error("Notification Validation Error:", notifErr.details);
        }
        const notification = new NotificationModel(notifData);
        await notification.save();

        // Emit notifications & socket event
        if (global.io) {
            global.io.to(`user_${bookingData.vendorId}`).emit("notification", notification);
            global.io.emit("bookingCreated", {
                message: "new Slot Booked",
                booking
            });
        }

        return res.status(200).json({
            success: true,
            message: "Booking confirmed via Wallet payment",
            booking
        });

    } catch (error) {
        console.error("WALLET PAY ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Wallet payment failed",
            error: error.message
        });
    }
};
BookingCtrl.vendorReceivedBookings = async (req, res) => {
    const { search, status } = req.query;
    const vendorId = req.userId;
    try {
        const query = { vendorId };

        if (search) {
            query.$or = [
                { vehiclesNumber: { $regex: search, $options: "i" } },
                { vehicletype: { $regex: search, $options: "i" } }
            ];
        }

        if (status && status !== "all") {
            query.status = status;
        }

        const result = await paginate(BookingModel, req.query, {
            query: query,
            sort: { createdAt: -1 },
            populate: [
                { path: "slotId", select: "name address Area location facilities" },
                { path: "userId", select: "userName email phoneNumber profilePic" }
            ]
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default BookingCtrl;