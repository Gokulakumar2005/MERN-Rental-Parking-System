import { ChatModel } from "../models/chatModel.js";
import NotificationModel from "../models/NotificationModel.js";
import UserModel from "../models/UserModel.js";
import { ChatValidationSchema } from "../validations/ChatValidation.js";
import { NotificationValidationSchema } from "../validations/NotificationValidation.js";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    //   console.log(`Joined room: ${roomId}`);
    });

    // Join user specific room for notifications
    socket.on("joinUserRoom", (userId) => {
      socket.join(`user_${userId}`);
      // console.log(`User joined personal room: user_${userId}`);
    });

    // Send message
    socket.on("sendMessage", async (data) => {
      try {
        // Validate chat message data
        const { error: chatErr, value: chatValue } = ChatValidationSchema.validate(data, { abortEarly: false });
        if (chatErr) {
          console.error("Chat Message Validation Error:", chatErr.details);
          socket.emit("chatError", { message: "Invalid message data", details: chatErr.details.map(e => e.message) });
          return;
        }

        const { roomId, senderId, receiverId, message } = chatValue;

        // Save message
        const newMessage = await ChatModel.create({
          roomId,
          senderId,
          receiverId,
          message,
        });

        // Emit to room (real-time chat update)
        io.to(roomId).emit("receiveMessage", newMessage);

        // Fetch sender name for prettier notification
        const sender = await UserModel.findById(senderId);
        const senderName = sender ? sender.userName || sender.email : "Someone";

        const notifData = {
          recipient: receiverId.toString(),
          sender: senderId.toString(),
          message: `${senderName}: ${message.substring(0, 35)}${message.length > 35 ? '...' : ''}`,
          type: "message",
          data: {}
        };

        const { error: notifErr } = NotificationValidationSchema.validate(notifData);
        if (notifErr) {
          console.error("Notification Validation Error in Socket:", notifErr.details);
        }

        // Create notification for the receiver
        const notification = await NotificationModel.create(notifData);

        // Emit notification only to the receiver's personal room
        io.to(`user_${receiverId}`).emit("notification", notification);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

// module.exports = socketHandler;
export default socketHandler;