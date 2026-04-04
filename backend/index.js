import 'dotenv/config'
import express from "express";
import ConfigureDb from './config/db.js';
import cors from "cors";
import { Server } from "socket.io";
import http from "http"

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



const app = express();
const port = process.env.port
ConfigureDb();
app.use(express.json());
app.use(cors());

// chat

const server = http.createServer(app);

// Socket setup
const io = new Server(server, {
  cors: {
    origin: "*", // change in production
  },
});

// Socket logic
socketHandler(io);

//Routes...

app.post("/user/register", UserCtrl.register)
app.post("/user/login", UserCtrl.login)
app.get("/user/account", authenticateUser, UserCtrl.account)
app.put("/update/profile/:id",authenticateUser,authorizeUser(["vendor","user","admin"]), upload.single("profilePic"), UserCtrl.updateProfile)
app.put("/update/password", authenticateUser,authorizeUser(["vendor","user","admin"]), UserCtrl.updatePassword);
app.post("/forgot/password",UserCtrl.forgotPassword)
app.post("/reset/password", UserCtrl.resetPassword)

// vendor
app.post(
  "/vendor/addSlot", upload.fields([
    { name: "parkingImages", maxCount: 10 },
    { name: "proof", maxCount: 5 },
  ]), authenticateUser, authorizeUser(["admin", "vendor"]),
  ParkingController.addSlot
);
app.put("/update/vendor/slot",upload.fields([
    { name: "parkingImages", maxCount: 10 },
    { name: "proof", maxCount: 5 },
  ]), authenticateUser, authorizeUser(["admin", "vendor"]),ParkingController.updateSlot)
app.delete("/vendor/delete/slot/:id",authenticateUser,authorizeUser(["vendor"]),ParkingController.deleteSlot)
// User
app.get("/user/fetchSlots", authenticateUser, authorizeUser(["admin", "user","vendor"]), ParkingController.fetchSlots)
app.get("/user/myBookings", authenticateUser, authorizeUser(["user", "admin", "vendor"]), BookingCtrl.fetchBookings);

//payment
app.post("/payment/create-order", authenticateUser, authorizeUser(["user"]), BookingCtrl.createOrder);
app.post("/payment/verify", authenticateUser, authorizeUser(["user"]), BookingCtrl.verifyPayment);
app.get("/user/fetch/payments", authenticateUser, authorizeUser(["user"]), BookingCtrl.fetchPayments);

// chat 

app.get("/api/chat/:roomId",  ChatController.getMessages);
server.listen(port, () => {
  console.log(`server is running on ${port}`)
});


