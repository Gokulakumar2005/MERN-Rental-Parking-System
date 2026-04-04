// const Chat = require("../models/Chat");
import { ChatModel } from "../models/chatModel.js";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    // console.log("User connected:", socket.id);

    // Join room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    //   console.log(`Joined room: ${roomId}`);
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

        // Emit to room
        io.to(roomId).emit("receiveMessage", newMessage);
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