import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true
    },
    VendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true
    },
    slotcount: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    orderId: String,
    paymentId: String,
    // status: {
    //     type: String,
    //     enum: ["notBooked", "active", "Expired"],
    //     default: "notBooked"
    // },
    // startTime:{
    //     type: Date,
    //     required: true
    // },
    // endTime: {
    //     type: Date,
    //     required: true
    // },
    PaymentStatus: {
        type: String,
        enum: ["pending", "completed", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

export const PaymentModel = mongoose.model("paymentModel", PaymentSchema);