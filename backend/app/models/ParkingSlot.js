
import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId, ref: "UserModel",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: { type: String, required: true },
    vehicles: { type: String, required: true },
    Area: {
        type: String, required: true,
    },
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        geo: { lat: { type: Number }, lng: { type: Number } },
    },
    totalSlot: {
        type: Number, required: true
    },
    basePricing: {
        hourly: Number,
        daily: Number,
        monthly: Number
    },

    pricing: {
        hourly: Number,
        daily: Number,
        monthly: Number
    },

    surge: {
        isActive: { type: Boolean, default: false },
        surgeHour: Number
    },
    facilities: { type: [String], required: true },
    parkingImages: [String],
    propertyDocument: {
        documentType: { type: String, enum: ["registration-document", "rental-document"], required: true }, proof: [String]
    }
}, { timestamps: true })

export const SlotModel = mongoose.model("SlotModel", SlotSchema);


