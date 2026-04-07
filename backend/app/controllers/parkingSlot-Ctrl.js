import axios from "axios";
import { SlotModel } from "../models/ParkingSlot.js";
import { PslotValidation } from "../validations/ParkingSlotValidation.js";
import { paginate } from "../utils/pagination.js";


const ParkingController = {};

ParkingController.addSlot = async (req, res) => {
    const body = req.body;
    console.log({ "body inside Ctlr": body })
    body.pricing = JSON.parse(body.pricing);
    body.facilities = JSON.parse(body.facilities);
    body.propertyDocument = JSON.parse(body.propertyDocument);

    const parkingImages = req.files?.parkingImages?.map(file => file.path) || [];
    const proof = req.files?.proof?.map(file => file.path) || [];

    if (!req.files?.parkingImages || req.files.parkingImages.length === 0) {
        return res.status(400).json({ error: "parkingImages is required" });
    }
    if (!req.files?.proof || req.files.proof.length === 0) {
        return res.status(400).json({ error: "propertyDocument proof is required" });
    }
    // console.log({ "body": body });

    const { error, value } = PslotValidation.validate(body, { abortEarly: false })
    if (error) {
        return res.status(400).json({ error: error.details.map(err => err.message) })
    }
    // console.log({ "value": value });
    // console.log("FILES:", req.files);
    try {
        const exsistLoaction = await SlotModel.findOne({ address: value.address, location: { geo: { lat: value.lat, lng: value.lng } } });
        if (exsistLoaction) {
            return res.status(400).json({ "error": "Location already present. So, Can you try Another Location..." })
        }

        const Address1 = value.address
            .split(",")
            .map(s => s.trim())
            .join(", ");

        const location = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
                params: {
                    q: Address1,
                    format: "json",
                    limit: 1,
                },
                headers: {
                    "User-Agent": "parking-app",
                },
            }
        );

        const location1 = location.data;

        if (!location1 || location1.length === 0) {
            return res.status(400).json({
                error: "Invalid address. Unable to fetch location."
            });
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
            totalSlot: value.totalSlot,
            pricing: value.pricing,
            facilities: value.facilities,
            parkingImages,
            propertyDocument: {
                ...value.propertyDocument,
                proof
            },

            vendorId: value.vendorId,
        });

        await newSlot.save();

        res.status(201).json({ message: "Slot added successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
ParkingController.updateSlot = async (req, res) => {
    try {
        const body = req.body;
        console.log({ "body inside update Ctlr": body });

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

        const parkingImages = req.files?.parkingImages?.map(file => file.path) || [];
        const proof = req.files?.proof?.map(file => file.path) || [];

        let updateData = {
            name: body.name || slot.name,
            vehicles: body.vehicles || slot.vehicles,
            totalSlot: body.totalSlot || slot.totalSlot,
        };

        if (body.pricing) updateData.pricing = body.pricing;
        if (body.facilities) updateData.facilities = body.facilities;
        if (body.propertyDocument) {
            updateData.propertyDocument = {
                ...slot.propertyDocument,
                ...body.propertyDocument
            };
        }

        if (parkingImages.length > 0) {
            updateData.parkingImages = parkingImages;
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

            const locationResp = await axios.get(
                "https://nominatim.openstreetmap.org/search",
                {
                    params: {
                        q: Address1,
                        format: "json",
                        limit: 1,
                    },
                    headers: {
                        "User-Agent": "parking-app",
                    },
                }
            );

            const location1 = locationResp.data;

            if (location1 && location1.length > 0) {
                updateData.location = {
                    geo: {
                        lat: location1[0].lat,
                        lng: location1[0].lon
                    }
                };
            } else {
                return res.status(400).json({
                    error: "Invalid address. Unable to fetch location."
                });
            }
        }

        const updatedSlot = await SlotModel.findByIdAndUpdate(slotId, updateData, { new: true });
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

ParkingController.fetchSlots = async (req, res) => {
    try {
        const response = await paginate(SlotModel,req.query,{
            query:{},
            sort:{createdAt: -1},

        })
        res.json(response);
    } catch (error) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}




export default ParkingController;