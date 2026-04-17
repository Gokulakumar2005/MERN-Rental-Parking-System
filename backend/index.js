

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
import "./config/node-cron/peakHours.js";
import "./config/node-cron/restPrice.js";


// modules
import UserCtrl from './app/controllers/User-Ctrl.js';
import BookingCtrl from './app/controllers/BookingCtrl.js';
import ParkingController from './app/controllers/parkingSlot-Ctrl.js';
import { authenticateUser } from './app/middlewares/authenticateUser.js';
import ChatController from './app/controllers/chatCtrl.js';
import { authorizeUser } from './app/middlewares/authorize.js';
import { upload } from './config/multer.js';
// import socketHandler from './app/sockets/sockets.js';
import socketHandler from "./app/Sockets/sockets.js";
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
app.put("/user/cancelBooking/:id", authenticateUser, authorizeUser(["user"]), BookingCtrl.CancelBooking);
app.get("/fetch/allSlot/maps", authenticateUser, authorizeUser(["user", "admin"]), ParkingController.fetchAllSlotWithoutPagination);
app.get("/fetch/allBooking/maps", authenticateUser, authorizeUser(["user", "admin"]), BookingCtrl.fetchAllBookingWithoutPagination);

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


// Area: Kukatpally PeakHour: 22
// Area: T Nagar PeakHour: 2
// Area: Chromepet PeakHour: 22
// Area: Juhu PeakHour: 3
// Area: Madhapur PeakHour: 23
// Area: Andheri PeakHour: 0
// Area: Connaught Place PeakHour: 4
// Area: Guindy PeakHour: 21
// Area: HSR Layout PeakHour: 3
// Area: Electronic City PeakHour: 3
// Area: HITEC City PeakHour: 7
// Area: Nehru Place PeakHour: 19
// Area: Dilsukhnagar PeakHour: 2
// Area: Whitefield PeakHour: 2
// Area: Jubilee Hills PeakHour: 0
// Area: Lajpat Nagar PeakHour: 1
// Area: Porur PeakHour: 7
// Area: Saket PeakHour: 11
// Area: Hauz Khas PeakHour: 22
// Area: Secunderabad PeakHour: 17
// Area: Dadar PeakHour: 0
// Area: Adyar PeakHour: 21
// Area: Thiruvanmiyur PeakHour: 6
// Area: Dwarka PeakHour: 7
// Area: Malad PeakHour: 17
// Area: Gachibowli PeakHour: 2
// Area: Goregaon PeakHour: 0
// Area: Thane PeakHour: 18
// Area: Powai PeakHour: 7
// Area: Rohini PeakHour: 0
// Area: Tambaram PeakHour: 6
// Area: Bandra PeakHour: 5
// Area: Ameerpet PeakHour: 3
// Area: Jayanagar PeakHour: 21
// Area: Malleshwaram PeakHour: 19
// Area: Anna Nagar PeakHour: 20
// Area: Navi Mumbai PeakHour: 7
// Area: Pitampura PeakHour: 7
// Area: Karol Bagh PeakHour: 7
// Area: Koramangala PeakHour: 10
// Area: Borivali PeakHour: 5
// Area: JP Nagar PeakHour: 13
// Area: BTM Layout PeakHour: 2
// Area: Janakpuri PeakHour: 14
// Area: Indiranagar PeakHour: 11
// Area: Mylapore PeakHour: 4
// Area: Banjara Hills PeakHour: 20
// Area: Velachery PeakHour: 15
// Area: LB Nagar PeakHour: 20
// Area: Basavangudi PeakHour: 17
