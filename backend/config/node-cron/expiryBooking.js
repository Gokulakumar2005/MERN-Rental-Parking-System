

import cron from "node-cron";
import { BookingModel } from "../../app/models/BookingModel.js";

cron.schedule("* * * * *", async () => {
    try {
        console.log("Checking expired bookings...");

        const expiredBookings = await BookingModel.find({
            endTime: { $lt: new Date() },
            status: "Booked"
        });

        for (let booking of expiredBookings) {
            booking.status = "Expired";
            await booking.save();

            console.log("Booking expired:", booking._id);
        }

    } catch (error) {
        console.log("Cron Error:", error.message);
    }
});