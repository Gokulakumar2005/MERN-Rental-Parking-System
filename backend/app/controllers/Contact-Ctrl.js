import { ContactModel } from "../models/Contact.js";
import { paginate } from "../utils/pagination.js";

const ContactCtrl = {};

ContactCtrl.submitForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newContact = new ContactModel({
            name,
            email,
            subject,
            message
        });

        await newContact.save();
        res.status(201).json({ message: "Contact form submitted successfully!" });
    } catch (err) {
        console.error("Error submitting contact form:", err);
        res.status(500).json({ error: err.message || "Internal server error" });
    }
};

ContactCtrl.getForms = async (req, res) => {
    try {
        const { search, status } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { subject: { $regex: search, $options: "i" } }
            ];
        }

        if (status && status !== "all") {
            query.status = status;
        }

        const response = await paginate(ContactModel, req.query, {
            query,
            sort: { createdAt: -1 }
        });

        res.json(response);
    } catch (err) {
        console.error("Error fetching contact forms:", err);
        res.status(500).json({ error: err.message || "Internal server error" });
    }
};

ContactCtrl.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await ContactModel.findByIdAndUpdate(id, { status: "read" }, { new: true });
        if (!contact) {
            return res.status(404).json({ error: "Contact form not found" });
        }
        res.json({ message: "Marked as read", contact });
    } catch (err) {
        console.error("Error updating contact status:", err);
        res.status(500).json({ error: err.message || "Internal server error" });
    }
};

export default ContactCtrl;
