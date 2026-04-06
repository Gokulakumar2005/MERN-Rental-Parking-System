// import 'dotenv/config';

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import ConfigureDb from './config/db.js';
import cors from "cors";
import { Server } from "socket.io";
import http from "http"
import morgan from "morgan";
import fs from "fs";
import path from "path";
import "./config/node-cron/expiryBooking.js";



// modules
import UserCtrl from './app/controllers/User-Ctrl.js';
import BookingCtrl from './app/controllers/BookingCtrl.js';
import ParkingController from './app/controllers/parkingSlot-Ctrl.js';
import { authenticateUser } from './app/middlewares/authenticateUser.js';
import ChatController from './app/controllers/chatCtrl.js';
import { authorizeUser } from './app/middlewares/authorize.js';
import { upload } from './config/multer.js';
import socketHandler from './app/sockets/sockets.js';
import NotificationCtrl from './app/controllers/Notification-Ctrl.js';



const app = express();
const port = process.env.PORT || 3030;
ConfigureDb();
app.use(express.json());
app.use(cors());
const accessLogStream = fs.createWriteStream(path.join(process.cwd(), 'access.log'), { flags: 'a' });
app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("dev"));

// chat

const server = http.createServer(app);


// Socket setup
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});


global.io = io;
io.on("connection", (socket) => {
  console.log("User Connected :", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnect");
  })
})
// Socket logic
socketHandler(io);

//Routes...

app.post("/user/register", UserCtrl.register)
app.post("/user/google-login", UserCtrl.googleLogin)
app.post("/user/login", UserCtrl.login)
app.get("/user/account", authenticateUser, UserCtrl.account)
app.put("/update/profile/:id", authenticateUser, authorizeUser(["vendor", "user", "admin"]), upload.single("profilePic"), UserCtrl.updateProfile)
app.put("/update/password", authenticateUser, authorizeUser(["vendor", "user", "admin"]), UserCtrl.updatePassword);
app.post("/forgot/password", UserCtrl.forgotPassword)
app.post("/reset/password", UserCtrl.resetPassword)
app.put("/user/switchRole/:id", authenticateUser, authorizeUser(["vendor", "user", "admin"]), UserCtrl.switchRole)

// vendor
app.post(
  "/vendor/addSlot", upload.fields([
    { name: "parkingImages", maxCount: 10 },
    { name: "proof", maxCount: 5 },
  ]), authenticateUser, authorizeUser(["admin", "vendor"]),
  ParkingController.addSlot
);
app.put("/update/vendor/slot", upload.fields([
  { name: "parkingImages", maxCount: 10 },
  { name: "proof", maxCount: 5 },
]), authenticateUser, authorizeUser(["admin", "vendor"]), ParkingController.updateSlot)
app.delete("/vendor/delete/slot/:id", authenticateUser, authorizeUser(["vendor"]), ParkingController.deleteSlot)
// User
app.get("/user/fetchSlots", authenticateUser, authorizeUser(["admin", "user", "vendor"]), ParkingController.fetchSlots)
app.get("/user/myBookings", authenticateUser, authorizeUser(["user", "admin", "vendor"]), BookingCtrl.fetchBookings);
app.put("/user/cancelBooking/:id", authenticateUser, authorizeUser(["user"]), BookingCtrl.CancelBooking)

//admin
app.get("/admin/fetch/allUser",authenticateUser,authorizeUser(["admin"]),UserCtrl.fetchAllUser)

//payment
app.post("/payment/create-order", authenticateUser, authorizeUser(["user", "admin", "vendor"]), BookingCtrl.createOrder);
app.post("/payment/verify", authenticateUser, authorizeUser(["user", "admin", "vendor"]), BookingCtrl.verifyPayment);
app.get("/user/fetch/payments", authenticateUser, authorizeUser(["user", "admin", "vendor"]), BookingCtrl.fetchPayments);

// notification
app.get("/api/notifications", authenticateUser, NotificationCtrl.fetchNotifications);
app.put("/api/notifications/:id/read", authenticateUser, NotificationCtrl.markAsRead);
app.put("/api/notifications/read-all", authenticateUser, NotificationCtrl.markAllAsRead);

// chat 
app.get("/api/chat/:roomId", ChatController.getMessages);
server.listen(port, () => {
  console.log(`server is running on ${port}`)
});


