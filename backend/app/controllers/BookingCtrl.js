import { PaymentModel } from "../models/PaymentModel.js";
import { BookingModel } from "../models/BookingModel.js";
import { SlotModel } from "../models/ParkingSlot.js";
import UserModel from "../models/UserModel.js";
import razorpay from "../../config/razorpay.js";
import crypto from "crypto";
import { createOrderSchema } from "../validations/BookingValidationSchema.js";
import { verifyPaymentSchema } from "../validations/BookingValidationSchema.js";
import NotificationModel from "../models/NotificationModel.js";
import { paginate } from "../utils/pagination.js";

// import { createOrderSchema } from "../validators/bookingValidation.js";

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
        console.log("RAZORPAY ORDER CREATED:", order);

        res.status(200).json(order);

    } catch (error) {
        console.error("RAZORPAY CREATE ORDER CATCH ERROR:", error);
        res.status(500).json({
            message: "Error creating order",
            error: error.message,
        });
    }
};

// BookingCtrl.createOrder = async (req, res) => {
//     try {
//         const { amount } = req.body;

//         const options = {
//             amount: amount * 100, // ₹ → paise
//             currency: "INR",
//             receipt: `receipt_${Date.now()}`,
//         };

//         const order = await razorpay.orders.create(options);

//         res.status(200).json(order);

//     } catch (error) {
//         res.status(500).json({
//             message: "Error creating order",
//             error: error.message,
//         });
//     }
// };

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

        console.log("bookingData:", bookingData);
        console.log("slotcount:", bookingData?.slotcount);

        if (!bookingData || !bookingData.Amount) {
            return res.status(400).json({
                success: false,
                message: "Missing booking data or amount"
            });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        console.log("EXPECTED SIGNATURE:", expectedSignature);
        console.log("RECEIVED SIGNATURE:", razorpay_signature);

        if (expectedSignature === razorpay_signature) {

            const slotArray = bookingData.slotcount || [];

            const payment = new PaymentModel({
                userId: bookingData.userId,
                VendorId: bookingData.vendorId,
                slotcount: slotArray.length,
                amount: Number(bookingData.Amount),
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                // startTime: bookingData.startTime,
                // endTime: bookingData.endTime,
                // status: "active",
                // status:bookingData.status,
                PaymentStatus: "completed"
            });

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
                BookedSlots: slotArray,
                paymentId: razorpay_payment_id,
                status: "Booked"
            });

            await booking.save();

            const VendorID = bookingData.vendorId;
            const Amount = Number(bookingData.Amount);

            await UserModel.findByIdAndUpdate(VendorID, { $inc: { wallet: Amount } });

            // Create notification for the vendor
            const notification = new NotificationModel({
                recipient: VendorID,
                sender: bookingData.userId,
                message: `New slot booked for ${bookingData.vehicletype}! Amount: ₹${Amount}`,
                type: "booking",
                data: {
                    bookingId: booking._id,
                    slotId: bookingData.slotId
                }
            });
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


// BookingCtrl.fetchBookings = async (req, res) => {
//     // console.log({"request":req});
//     // const userId = req.userId;
//     try {
//         const response = await BookingModel.find();
//         // console.log({ "response inside the ctrl": response })
//         res.json(response);

//     } catch (error) {
//         console.log(error);
//         res.json(error.message);
//     }
// }
// controllers/BookingCtrl.js




BookingCtrl.fetchBookings = async (req, res) => {
  try {
    console.log("USER ID:", req.userId);

    const result = await paginate(BookingModel, req.query, {
      query: {},
      sort: { createdAt: -1 },
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



BookingCtrl.fetchPayments = async (req, res) => {
    // const body = req.body;
    // console.log({ "Body inside the Ctrl": req.userId })
    const userId = req.userId;
    try {
        const response = await PaymentModel.find({ userId })
        // console.log({ "response inside the ctrl": response })
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.json(error.message);
    }
}

// BookingCtrl.CancelBooking = async (req, res) => {
//     try {

//         const { id } = req.params;
//         const findBooking = await BookingModel.findById(id);
//         if (!findBooking) {
//             res.status(404).json({ message: "Booking not found" });
//         }
//         const currentTime = new Date();
//         const bookingStartTime = new Date(findBooking.startTime);
//         const timeDiff = bookingStartTime - currentTime;
//         const hoursDiff = timeDiff / (1000 * 60 * 60);

//         if (hoursDiff < 8) {
//             res.status(400).json({ message: "Booking cannot be cancelled before 8 hours" });
//         }
//         await BookingModel.findByIdAndUpdate(id, { $set: { status: "Cancelled" } });
//         res.json({message:"Booking Cancelled"});
//     } catch (error) {
//         console.log(error);
//         res.json(error.message);
//     }
// }
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
        const cancellationNotification = new NotificationModel({
            recipient: updatedBooking.vendorId,
            sender: updatedBooking.userId,
            message: `Booking cancelled for ${updatedBooking.vehicletype}. Booking ID: ${updatedBooking._id}`,
            type: "cancellation",
            data: {
                bookingId: updatedBooking._id,
                slotId: updatedBooking.slotId
            }
        });
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
export default BookingCtrl;