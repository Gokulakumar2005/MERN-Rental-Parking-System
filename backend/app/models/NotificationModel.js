import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel"
    },
    message: {
        type: String,
        required: true
    },
    // type: {
    //     type: String,
    //     enum: ["booking", "cancellation", "message", "other"],
    //     default: "other"
    // },
    type: {
        type: String,
        enum: ["booking", "cancellation", "message", "peakHours"],
        required: true
    },
    data: {
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BookingModel"
        },
        slotId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SlotModel"
        }
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const NotificationModel = mongoose.model("Notification", notificationSchema);

export default NotificationModel;
