import mongoose from "mongoose";


const BookingSchema = new mongoose.Schema({
    slotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Slot",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true
    },
    vehicletype: {
        type: String,
        required: true
    },
    vehiclesNumber: {
        type: String,
        required: true
    },
    Based: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    Amount: {
        type: Number,
        required: true
    },
    BookedSlots: {
        type: [Number],
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Cancelled", "Booked", "Expired"],
        default: "Booked"
    }
}, {
    timestamps: true
});
export const BookingModel = mongoose.model("BookingModel", BookingSchema);