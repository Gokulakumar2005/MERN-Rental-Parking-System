

import cron from "node-cron";
import { BookingModel } from "../../app/models/BookingModel.js";

cron.schedule("* * * * *", async () => {
    try {
        console.log("Checking expired bookings...");

        const result = await BookingModel.updateMany({
            endTime: { $lt: new Date() },
            status: "Booked"
        }, {
            $set: { status: "Expired" }
        });

        if (result.modifiedCount > 0) {
            console.log("Bookings expired:", result.modifiedCount);
        }

    } catch (error) {
        console.log("Cron Error:", error.message);
    }
}, { noOverlap: true });