import { PaymentModel } from "../models/PaymentModel.js";
import { BookingModel } from "../models/BookingModel.js";
import { SlotModel } from "../models/ParkingSlot.js";
import UserModel from "../models/UserModel.js";
import razorpay from "../../config/razorpay.js";
import crypto from "crypto";
import { createOrderSchema } from "../validations/BookingValidationSchema.js";
import { verifyPaymentSchema } from "../validations/BookingValidationSchema.js";

// import { createOrderSchema } from "../validators/bookingValidation.js";

const BookingCtrl = {};



BookingCtrl.createOrder = async (req, res) => {
    console.log({ "Data inside the CreateOrder": req.body })
    try {
        const { error } = createOrderSchema.validate(req.body);
        //   const { error, value } = PslotValidation.validate(body, { abortEarly: false })

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const { amount } = req.body;

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json(order);

    } catch (error) {
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
        // const {
        //     razorpay_order_id,
        //     razorpay_payment_id,
        //     razorpay_signature,
        //     bookingData
        // } = req.body;

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

        // ✅ USE THIS (not req.body)
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

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

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

            const updateWallet = await UserModel.findByIdAndUpdate(VendorID, { $inc: { wallet: Amount } });
            await updateWallet.save();

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
        console.log("VERIFY ERROR:", error);
        res.status(500).json({
            message: "Verification failed",
            error: error.message,
        });
    }
};


BookingCtrl.fetchBookings = async (req, res) => {
    // console.log({"request":req});
    // const userId = req.userId;
    try {
        const response = await BookingModel.find();
        // console.log({ "response inside the ctrl": response })
        res.json(response);

    } catch (error) {
        console.log(error);
        res.json(error.message);
    }
}

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

export default BookingCtrl;