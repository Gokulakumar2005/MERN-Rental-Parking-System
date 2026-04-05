import NotificationModel from "../models/NotificationModel.js";

const notificationCtrl = {};

notificationCtrl.fetchNotifications = async (req, res) => {
    try {
        const notifications = await NotificationModel.find({ recipient: req.userId })
            .sort({ createdAt: -1 })
            .limit(20);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

notificationCtrl.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await NotificationModel.findByIdAndUpdate(id, { $set: { isRead: true } });
        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

notificationCtrl.markAllAsRead = async (req, res) => {
    try {
        await NotificationModel.updateMany({ recipient: req.userId, isRead: false }, { $set: { isRead: true } });
        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default notificationCtrl;
