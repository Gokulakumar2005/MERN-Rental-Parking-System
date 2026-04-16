import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

import UserModel from "../app/models/UserModel.js";
import { BookingModel } from "../app/models/BookingModel.js";
import { SlotModel } from "../app/models/ParkingSlot.js";
import { PaymentModel } from "../app/models/PaymentModel.js";
import NotificationModel from "../app/models/NotificationModel.js";
import { ChatModel } from "../app/models/chatModel.js";

const RECORD_COUNT = 1000;

const indianCities = [
    { name: "Bangalore", areas: ["Koramangala", "Indiranagar", "Whitefield", "HSR Layout", "JP Nagar", "Jayanagar", "Basavangudi", "Malleshwaram", "BTM Layout", "Electronic City"] },
    { name: "Chennai", areas: ["T Nagar", "Adyar", "Anna Nagar", "Velachery", "Mylapore", "Guindy", "Tambaram", "Porur", "Chromepet", "Thiruvanmiyur"] },
    { name: "Mumbai", areas: ["Andheri", "Bandra", "Dadar", "Powai", "Malad", "Goregaon", "Borivali", "Thane", "Navi Mumbai", "Juhu"] },
    { name: "Delhi", areas: ["Connaught Place", "Saket", "Dwarka", "Rohini", "Karol Bagh", "Lajpat Nagar", "Hauz Khas", "Nehru Place", "Janakpuri", "Pitampura"] },
    { name: "Hyderabad", areas: ["Banjara Hills", "Jubilee Hills", "Madhapur", "Gachibowli", "Secunderabad", "Kukatpally", "Ameerpet", "HITEC City", "LB Nagar", "Dilsukhnagar"] },
];

const vehicleTypes = ["Car", "Bike"];
const basedTypes = ["Hourly", "daily", "Monthly"];
const facilities = ["CCTV", "Security", "EV Charging", "Covered Parking", "24/7 Access", "Wheelchair Access", "Car Wash", "Valet", "Restrooms", "WiFi"];
const notificationTypes = ["booking", "cancellation", "message", "peakHours"];
const bookingStatuses = ["Booked", "Cancelled", "Expired"];
const paymentStatuses = ["pending", "completed", "rejected"];
const documentTypes = ["registration-document", "rental-document"];

function generateVehicleNumber() {
    const states = ["TN", "KA", "MH", "DL", "AP", "TS", "KL", "UP", "GJ", "RJ"];
    const state = faker.helpers.arrayElement(states);
    const district = faker.number.int({ min: 1, max: 99 }).toString().padStart(2, "0");
    const letters = faker.string.alpha({ length: 2, casing: "upper" });
    const num = faker.number.int({ min: 1000, max: 9999 });
    return `${state} ${district} ${letters} ${num}`;
}

function randomDate(startMonthsAgo, endMonthsAgo = 0) {
    const start = new Date();
    start.setMonth(start.getMonth() - startMonthsAgo);
    const end = new Date();
    end.setMonth(end.getMonth() - endMonthsAgo);
    return faker.date.between({ from: start, to: end });
}

async function seed() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("✅ Connected to DB");

        console.log("\n🗑️  Clearing existing data...");
        await Promise.all([
            UserModel.deleteMany({}),
            SlotModel.deleteMany({}),
            BookingModel.deleteMany({}),
            PaymentModel.deleteMany({}),
            NotificationModel.deleteMany({}),
            ChatModel.deleteMany({}),
        ]);
        console.log("   Done clearing.\n");

        // ──────────────────────────────────────────
        // 1. USERS (1000)
        // ──────────────────────────────────────────
        console.log("👤 Seeding 1000 Users...");
        const hashedPassword = await bcrypt.hash("Password@123", 10);
        const userDocs = [];
        const roles = ["user", "vendor", "admin"];
        const roleWeights = [0.6, 0.35, 0.05];

        for (let i = 0; i < RECORD_COUNT; i++) {
            const rand = Math.random();
            let role;
            if (rand < roleWeights[0]) role = "user";
            else if (rand < roleWeights[0] + roleWeights[1]) role = "vendor";
            else role = "admin";

            userDocs.push({
                userName: faker.person.fullName(),
                email: faker.internet.email().toLowerCase(),
                password: hashedPassword,
                role,
                profilePic: faker.image.avatar(),
                wallet: faker.number.int({ min: 0, max: 50000 }),
                phoneNumber: faker.phone.number({ style: "national" }),
                createdAt: randomDate(12),
            });
        }
        const users = await UserModel.insertMany(userDocs);
        console.log(`   ✅ ${users.length} users created`);

        const userIds = users.filter((u) => u.role === "user").map((u) => u._id);
        const vendorIds = users.filter((u) => u.role === "vendor").map((u) => u._id);
        const allUserIds = users.map((u) => u._id);

        if (vendorIds.length === 0) {
            console.log("⚠️  No vendors created, forcing first 100 users as vendors.");
            users.slice(0, 100).forEach((u) => vendorIds.push(u._id));
        }
        if (userIds.length === 0) {
            console.log("⚠️  No regular users created, forcing last 100 as users.");
            users.slice(-100).forEach((u) => userIds.push(u._id));
        }

        // ──────────────────────────────────────────
        // 2. PARKING SLOTS (1000)
        // ──────────────────────────────────────────
        console.log("🅿️  Seeding 1000 Parking Slots...");
        const slotDocs = [];

        for (let i = 0; i < RECORD_COUNT; i++) {
            const city = faker.helpers.arrayElement(indianCities);
            const area = faker.helpers.arrayElement(city.areas);
            const hourly = faker.number.int({ min: 10, max: 100 });

            slotDocs.push({
                vendorId: faker.helpers.arrayElement(vendorIds),
                name: `${faker.company.name()} Parking`,
                address: `${faker.location.streetAddress()}, ${area}, ${city.name}`,
                Area: area,
                vehicles: faker.helpers.arrayElement(["car", "bike"]),
                location: {
                    type: "Point",
                    geo: {
                        lat: faker.location.latitude({ min: 12.8, max: 28.7 }),
                        lng: faker.location.longitude({ min: 72.8, max: 80.3 }),
                    },
                },
                totalSlot: faker.number.int({ min: 5, max: 50 }),
                basePricing: {
                    hourly,
                    daily: hourly * 8,
                    monthly: hourly * 8 * 25,
                },
                pricing: {
                    hourly,
                    daily: hourly * 8,
                    monthly: hourly * 8 * 25,
                },
                surge: {
                    isActive: faker.datatype.boolean(),
                    surgeHour: faker.number.int({ min: 8, max: 20 }),
                },
                facilities: faker.helpers.arrayElements(facilities, { min: 2, max: 6 }),
                parkingImages: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
                    faker.image.urlPicsumPhotos({ width: 640, height: 480 })
                ),
                propertyDocument: {
                    documentType: faker.helpers.arrayElement(documentTypes),
                    proof: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
                        faker.image.urlPicsumPhotos({ width: 800, height: 600 })
                    ),
                },
                createdAt: randomDate(10),
            });
        }
        const slots = await SlotModel.insertMany(slotDocs);
        console.log(`   ✅ ${slots.length} parking slots created`);

        const slotIds = slots.map((s) => s._id);

        // ──────────────────────────────────────────
        // 3. BOOKINGS (1000)
        // ──────────────────────────────────────────
        console.log("📅 Seeding 1000 Bookings...");
        const bookingDocs = [];

        for (let i = 0; i < RECORD_COUNT; i++) {
            const slot = faker.helpers.arrayElement(slots);
            const based = faker.helpers.arrayElement(basedTypes);
            const startTime = randomDate(6, 0);
            const endTime = new Date(startTime);

            if (based === "Hourly") endTime.setHours(endTime.getHours() + faker.number.int({ min: 1, max: 12 }));
            else if (based === "daily") endTime.setDate(endTime.getDate() + faker.number.int({ min: 1, max: 30 }));
            else endTime.setMonth(endTime.getMonth() + faker.number.int({ min: 1, max: 6 }));

            const slotCount = faker.number.int({ min: 1, max: Math.min(3, slot.totalSlot) });
            const bookedSlots = faker.helpers.arrayElements(
                Array.from({ length: slot.totalSlot }, (_, j) => j + 1),
                slotCount
            );

            let amount;
            const diff = endTime - startTime;
            if (based === "Hourly") amount = slotCount * Math.ceil(diff / 3600000) * (slot.pricing?.hourly || 20);
            else if (based === "daily") amount = slotCount * Math.ceil(diff / 86400000) * (slot.pricing?.daily || 160);
            else amount = slotCount * Math.ceil(diff / 2592000000) * (slot.pricing?.monthly || 4000);

            bookingDocs.push({
                slotId: slot._id,
                userId: faker.helpers.arrayElement(userIds),
                vendorId: slot.vendorId,
                vehicletype: faker.helpers.arrayElement(vehicleTypes),
                vehiclesNumber: generateVehicleNumber(),
                Based: based,
                startTime,
                endTime,
                Amount: Math.round(amount),
                BookedSlots: bookedSlots,
                paymentId: `pay_${faker.string.alphanumeric(14)}`,
                Area: slot.Area,
                status: faker.helpers.arrayElement(bookingStatuses),
                createdAt: startTime,
            });
        }
        const bookings = await BookingModel.insertMany(bookingDocs);
        console.log(`   ✅ ${bookings.length} bookings created`);

        // ──────────────────────────────────────────
        // 4. PAYMENTS (1000)
        // ──────────────────────────────────────────
        console.log("💳 Seeding 1000 Payments...");
        const paymentDocs = [];

        for (let i = 0; i < RECORD_COUNT; i++) {
            const booking = bookings[i] || faker.helpers.arrayElement(bookings);
            paymentDocs.push({
                userId: booking.userId,
                VendorId: booking.vendorId,
                slotcount: booking.BookedSlots.length,
                amount: booking.Amount,
                orderId: `order_${faker.string.alphanumeric(14)}`,
                paymentId: booking.paymentId,
                PaymentStatus: booking.status === "Booked" ? "completed" : faker.helpers.arrayElement(paymentStatuses),
                createdAt: booking.createdAt,
            });
        }
        const payments = await PaymentModel.insertMany(paymentDocs);
        console.log(`   ✅ ${payments.length} payments created`);

        // ──────────────────────────────────────────
        // 5. NOTIFICATIONS (1000)
        // ──────────────────────────────────────────
        console.log("🔔 Seeding 1000 Notifications...");
        const notifDocs = [];
        const notifMessages = {
            booking: ["Your parking slot has been booked!", "New booking received for your slot.", "Booking confirmed — enjoy your spot!"],
            cancellation: ["Your booking has been cancelled.", "A booking on your slot was cancelled.", "Refund initiated for cancelled booking."],
            message: ["You have a new message.", "New chat from your parking host.", "Reply received on your conversation."],
            peakHours: ["Peak hours pricing is now active!", "Surge pricing enabled for your area.", "High demand — prices updated."],
        };

        for (let i = 0; i < RECORD_COUNT; i++) {
            const type = faker.helpers.arrayElement(notificationTypes);
            const booking = faker.helpers.arrayElement(bookings);

            notifDocs.push({
                recipient: faker.helpers.arrayElement(allUserIds),
                sender: faker.helpers.arrayElement(allUserIds),
                message: faker.helpers.arrayElement(notifMessages[type]),
                type,
                data: {
                    bookingId: booking._id,
                    slotId: booking.slotId,
                },
                isRead: faker.datatype.boolean(),
                createdAt: randomDate(6),
            });
        }
        const notifications = await NotificationModel.insertMany(notifDocs);
        console.log(`   ✅ ${notifications.length} notifications created`);

        // ──────────────────────────────────────────
        // 6. CHAT MESSAGES (1000)
        // ──────────────────────────────────────────
        console.log("💬 Seeding 1000 Chat Messages...");
        const chatDocs = [];
        const chatMessages = [
            "Hi, is my parking slot confirmed?",
            "Yes, it's confirmed. Welcome!",
            "Can I extend my booking by 2 hours?",
            "Sure, I'll update the slot for you.",
            "Where exactly is the entrance?",
            "Take the second left after the main gate.",
            "Is EV charging available?",
            "Yes, we have two charging stations.",
            "Thank you for the great service!",
            "My pleasure! Come again.",
            "Is there a security guard at night?",
            "24/7 security is available.",
            "Can I park a SUV in a car slot?",
            "Yes, our slots accommodate SUVs.",
            "What time does the gate close?",
            "We're open 24 hours.",
            "I'll be arriving late, is that okay?",
            "No problem, your slot will be reserved.",
            "How do I cancel my booking?",
            "You can cancel from the app up to 8 hours before.",
        ];

        for (let i = 0; i < RECORD_COUNT; i++) {
            const sender = faker.helpers.arrayElement(allUserIds);
            let receiver = faker.helpers.arrayElement(allUserIds);
            while (receiver.equals(sender)) {
                receiver = faker.helpers.arrayElement(allUserIds);
            }
            const roomId = [sender.toString(), receiver.toString()].sort().join("_");

            chatDocs.push({
                roomId,
                senderId: sender,
                receiverId: receiver,
                message: faker.helpers.arrayElement(chatMessages),
                isRead: faker.datatype.boolean(),
                createdAt: randomDate(3),
            });
        }
        const chats = await ChatModel.insertMany(chatDocs);
        console.log(`   ✅ ${chats.length} chat messages created`);

        // ──────────────────────────────────────────
        console.log("\n🎉 Seeding complete!");
        console.log("────────────────────────────────");
        console.log(`   Users:          ${users.length}`);
        console.log(`   Parking Slots:  ${slots.length}`);
        console.log(`   Bookings:       ${bookings.length}`);
        console.log(`   Payments:       ${payments.length}`);
        console.log(`   Notifications:  ${notifications.length}`);
        console.log(`   Chat Messages:  ${chats.length}`);
        console.log(`   TOTAL:          ${users.length + slots.length + bookings.length + payments.length + notifications.length + chats.length}`);
        console.log("────────────────────────────────\n");

    } catch (err) {
        console.error("❌ Seeding failed:", err);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from DB");
        process.exit(0);
    }
}

seed();
