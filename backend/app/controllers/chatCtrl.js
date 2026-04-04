
import { ChatModel } from "../models/chatModel.js";
const ChatController = {}


// Get messages by room
ChatController.getMessages = async (req, res) => {
    // console.log({ "incoming request in Chat Ctrl": req.body })
    try {
        const { roomId } = req.params;

        const messages = await ChatModel.find({ roomId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export default ChatController;