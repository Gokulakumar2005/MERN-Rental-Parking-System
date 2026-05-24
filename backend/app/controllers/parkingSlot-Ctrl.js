import axios from "axios";
import { SlotModel } from "../models/ParkingSlot.js";
import { PslotValidation, UpdatePslotValidation } from "../validations/ParkingSlotValidation.js";
import { paginate } from "../utils/pagination.js";
import NotificationModel from "../models/NotificationModel.js";
import { NotificationValidationSchema } from "../validations/NotificationValidation.js";


const ParkingController = {};

ParkingController.addSlot = async (req, res) => {
    try {
        const body = req.body;
        console.log({ "body inside Ctlr": body });
        
        if (body.pricing) body.pricing = JSON.parse(body.pricing);
        if (body.facilities) body.facilities = JSON.parse(body.facilities);
        if (body.propertyDocument) body.propertyDocument = JSON.parse(body.propertyDocument);

        const parkingImages = req.files?.parkingImages?.map(file => file.path) || [];
        const proof = req.files?.proof?.map(file => file.path) || [];
        const fullImage = req.files?.fullImage?.[0]?.path || "";

        if (!req.files?.parkingImages || req.files.parkingImages.length === 0) {
            return res.status(400).json({ error: "parkingImages is required" });
        }
        if (!req.files?.proof || req.files.proof.length === 0) {
            return res.status(400).json({ error: "propertyDocument proof is required" });
        }

        const { error, value } = PslotValidation.validate(body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ error: error.details.map(err => err.message) });
        }
        
        const exsistLoaction = await SlotModel.findOne({ address: value.address, location: { geo: { lat: value.lat, lng: value.lng } } });
        if (exsistLoaction) {
            return res.status(400).json({ "error": "Location already present. So, Can you try Another Location..." })
        }

        const Address1 = value.address
            .split(",")
            .map(s => s.trim())
            .join(", ");

        let location1 = [];
        try {
            const location = await axios.get(
                "https://nominatim.openstreetmap.org/search",
                {
                    params: {
                        q: Address1,
                        format: "json",
                        limit: 1,
                    },
                    headers: {
                        "User-Agent": "mern-rental-parking-system-" + Math.floor(Math.random() * 10000), // Randomize UA to help bypass basic rate limits
                    },
                }
            );
            location1 = location.data;
        } catch (apiError) {
            console.error("Geocoding API error:", apiError.message);
        }

        if (!location1 || location1.length === 0) {
            console.log("Using fallback coordinates due to geocoding failure or empty result.");
            // Fallback to a default coordinate (e.g., central India/Hyderabad) if API is rate-limited (429)
            location1 = [{ lat: 17.385044, lon: 78.486671 }];
        }

        let approvalStatus = body.approvalStatus || "pending";
        if (req.files?.fullImage?.[0]) {
            const fileNameLower = req.files.fullImage[0].originalname.toLowerCase();
            const blockedKeywords = ["fail", "block", "traffic", "jam", "crowd", "full", "busy", "occupied", "congested", "blocked"];
            const hasBlockage = blockedKeywords.some(keyword => fileNameLower.includes(keyword));
            if (hasBlockage) {
                approvalStatus = "pending";
            }
        }

        const newSlot = new SlotModel({
            name: value.name,
            address: value.address,
            location: {
                geo: {
                    lat: location1[0].lat,
                    lng: location1[0].lon
                }
            },
            vehicles: value.vehicles,
            Area: value.Area,
            totalSlot: value.totalSlot,
            pricing: value.pricing,
            facilities: value.facilities,
            parkingImages,
            fullImage,
            approvalStatus,
            propertyDocument: {
                ...value.propertyDocument,
                proof
            },

            vendorId: value.vendorId,
        });

        await newSlot.save();
        if (newSlot.approvalStatus === "pending") {
            try {
                const notifData = {
                    recipient: newSlot.vendorId.toString(),
                    sender: newSlot.vendorId.toString(),
                    message: `Your slot '${newSlot.name}' is pending admin verification. It will take up to 5 working days.`,
                    type: "slotApproval",
                    data: { slotId: newSlot._id.toString() }
                };
                const { error: notifErr } = NotificationValidationSchema.validate(notifData);
                if (notifErr) {
                    console.error("Notification Validation Error:", notifErr.details);
                }
                const notification = new NotificationModel(notifData);
                await notification.save();
                if (global.io) {
                    global.io.to(`user_${newSlot.vendorId}`).emit("notification", notification);
                }
            } catch (notifErr) {
                console.error("Failed to create pending slot notification:", notifErr);
            }
        }
        res.status(201).json({ message: "Slot added successfully", newSlot });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
ParkingController.updateSlot = async (req, res) => {
    try {
        const body = req.body;
        // console.log({ "body inside update Ctlr": body });

        const slotId = body.slotId;
        if (!slotId) {
            return res.status(400).json({ error: "Slot ID is required" });
        }

        const slot = await SlotModel.findById(slotId);
        if (!slot) {
            return res.status(404).json({ error: "Slot not found" });
        }

        if (body.pricing) body.pricing = JSON.parse(body.pricing);
        if (body.facilities) body.facilities = JSON.parse(body.facilities);
        if (body.propertyDocument) body.propertyDocument = JSON.parse(body.propertyDocument);

        const { error, value } = UpdatePslotValidation.validate(body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ error: error.details.map(err => err.message) });
        }

        const parkingImages = req.files?.parkingImages?.map(file => file.path) || [];
        const proof = req.files?.proof?.map(file => file.path) || [];
        const fullImage = req.files?.fullImage?.[0]?.path || "";

        let updateData = {
            name: value.name || slot.name,
            vehicles: value.vehicles || slot.vehicles,
            totalSlot: value.totalSlot || slot.totalSlot,
        };

        if (value.pricing) updateData.pricing = value.pricing;
        if (value.facilities) updateData.facilities = value.facilities;
        
        let approvalStatus = value.approvalStatus || slot.approvalStatus;
        if (req.files?.fullImage?.[0]) {
            const fileNameLower = req.files.fullImage[0].originalname.toLowerCase();
            const blockedKeywords = ["fail", "block", "traffic", "jam", "crowd", "full", "busy", "occupied", "congested", "blocked"];
            const hasBlockage = blockedKeywords.some(keyword => fileNameLower.includes(keyword));
            if (hasBlockage) {
                approvalStatus = "pending";
            }
        }
        updateData.approvalStatus = approvalStatus;
        if (value.propertyDocument) {
            updateData.propertyDocument = {
                ...slot.propertyDocument,
                ...value.propertyDocument
            };
        }

        if (parkingImages.length > 0) {
            updateData.parkingImages = parkingImages;
        }
        if (fullImage) {
            updateData.fullImage = fullImage;
        }
        if (proof.length > 0) {
            updateData.propertyDocument = updateData.propertyDocument || slot.propertyDocument;
            updateData.propertyDocument.proof = proof;
        }

        if (body.address && body.address !== slot.address) {
            updateData.address = body.address;
            const Address1 = body.address
                .split(",")
                .map(s => s.trim())
                .join(", ");

            let location1 = [];
            try {
                const locationResp = await axios.get(
                    "https://nominatim.openstreetmap.org/search",
                    {
                        params: {
                            q: Address1,
                            format: "json",
                            limit: 1,
                        },
                        headers: {
                            "User-Agent": "mern-rental-parking-system-" + Math.floor(Math.random() * 10000),
                        },
                    }
                );
                location1 = locationResp.data;
            } catch (apiError) {
                console.error("Geocoding API error in update:", apiError.message);
            }

            if (location1 && location1.length > 0) {
                updateData.location = {
                    geo: {
                        lat: location1[0].lat,
                        lng: location1[0].lon
                    }
                };
            } else {
                console.log("Using fallback coordinates in update due to geocoding failure.");
                updateData.location = {
                    geo: {
                        lat: 17.385044,
                        lng: 78.486671
                    }
                };
            }
        }

        const updatedSlot = await SlotModel.findByIdAndUpdate(slotId, updateData, { new: true });
        if (updatedSlot.approvalStatus === "pending") {
            try {
                const notifData = {
                    recipient: updatedSlot.vendorId.toString(),
                    sender: updatedSlot.vendorId.toString(),
                    message: `Your slot '${updatedSlot.name}' is pending admin verification. It will take up to 5 working days.`,
                    type: "slotApproval",
                    data: { slotId: updatedSlot._id.toString() }
                };
                const { error: notifErr } = NotificationValidationSchema.validate(notifData);
                if (notifErr) {
                    console.error("Notification Validation Error:", notifErr.details);
                }
                const notification = new NotificationModel(notifData);
                await notification.save();
                if (global.io) {
                    global.io.to(`user_${updatedSlot.vendorId}`).emit("notification", notification);
                }
            } catch (notifErr) {
                console.error("Failed to create pending slot update notification:", notifErr);
            }
        }
        res.status(200).json({ message: "Slot updated successfully", updatedSlot });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}
ParkingController.deleteSlot = async (req, res) => {
    const id = req.params.id
    try {
        const response = await SlotModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Slot Deleted successfully", response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

// ParkingController.fetchSlots = async (req, res) => {
//     try {
//         const response = await paginate(SlotModel,req.query,{
//             query:{},
//             sort:{createdAt: -1},

//         })
//         res.json(response);
//     } catch (error) {
//         console.log(err);
//         res.status(500).json({ error: err.message });
//     }
// }
ParkingController.fetchSlots = async (req, res) => {
    const { search, vehicleType, approvalStatus, vendorId } = req.query;
    try {
        const query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { address: { $regex: search, $options: "i" } },
                { Area: { $regex: search, $options: "i" } }
            ];
        }

        if (vehicleType && vehicleType !== "all") {
            query.vehicles = vehicleType;
        }

        if (approvalStatus) {
            query.approvalStatus = approvalStatus;
        } else if (req.role === "user") {
            query.approvalStatus = { $in: ["approved", null, undefined] };
        }

        if (vendorId) {
            query.vendorId = vendorId;
        }

        const response = await paginate(SlotModel, req.query, {
            query,
            sort: { createdAt: -1 },
        });

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

ParkingController.fetchAllSlotWithoutPagination=async(req,res)=>{
    try {
        const query = {};
        if (req.role === "user") {
            query.approvalStatus = { $in: ["approved", null, undefined] };
        }
        const response = await SlotModel.find(query);
        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

ParkingController.approveSlot = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSlot = await SlotModel.findByIdAndUpdate(
            id,
            { approvalStatus: "approved" },
            { new: true }
        );
        if (!updatedSlot) {
            return res.status(404).json({ error: "Slot not found" });
        }
        try {
            const notifData = {
                recipient: updatedSlot.vendorId.toString(),
                sender: req.userId.toString(),
                message: `Your slot '${updatedSlot.name}' has been approved by the Admin. It is now active for booking.`,
                type: "slotApproval",
                data: { slotId: updatedSlot._id.toString() }
            };
            const { error: notifErr } = NotificationValidationSchema.validate(notifData);
            if (notifErr) {
                console.error("Notification Validation Error:", notifErr.details);
            }
            const notification = new NotificationModel(notifData);
            await notification.save();
            if (global.io) {
                global.io.to(`user_${updatedSlot.vendorId}`).emit("notification", notification);
            }
        } catch (notifErr) {
            console.error("Failed to create approve slot notification:", notifErr);
        }
        res.status(200).json({ message: "Slot approved successfully", updatedSlot });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

ParkingController.rejectSlot = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSlot = await SlotModel.findByIdAndUpdate(
            id,
            { approvalStatus: "rejected" },
            { new: true }
        );
        if (!updatedSlot) {
            return res.status(404).json({ error: "Slot not found" });
        }
        try {
            const notifData = {
                recipient: updatedSlot.vendorId.toString(),
                sender: req.userId.toString(),
                message: `Your slot '${updatedSlot.name}' has been rejected by the Admin due to space verification checks.`,
                type: "slotApproval",
                data: { slotId: updatedSlot._id.toString() }
            };
            const { error: notifErr } = NotificationValidationSchema.validate(notifData);
            if (notifErr) {
                console.error("Notification Validation Error:", notifErr.details);
            }
            const notification = new NotificationModel(notifData);
            await notification.save();
            if (global.io) {
                global.io.to(`user_${updatedSlot.vendorId}`).emit("notification", notification);
            }
        } catch (notifErr) {
            console.error("Failed to create reject slot notification:", notifErr);
        }
        res.status(200).json({ message: "Slot rejected successfully", updatedSlot });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default ParkingController;