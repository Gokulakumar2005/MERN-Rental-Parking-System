import { ChatModel } from "../models/chatModel.js";
import NotificationModel from "../models/NotificationModel.js";
import UserModel from "../models/UserModel.js";

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
        const { roomId, senderId, receiverId, message } = data;

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

        // Create notification for the receiver
        const notification = await NotificationModel.create({
          recipient: receiverId,
          sender: senderId,
          message: `${senderName}: ${message.substring(0, 35)}${message.length > 35 ? '...' : ''}`,
          type: "message",
          data: { 
            // We can add roomId or other data here if needed
          }
        });

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