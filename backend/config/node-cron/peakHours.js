import cron from "node-cron";
import { BookingModel } from "../../app/models/BookingModel.js";
import { SlotModel } from "../../app/models/ParkingSlot.js";


cron.schedule("59 23 * * *", async () => {

  try {

    console.log("Detecting yesterday's peak hours...");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const bookings = await BookingModel.find({
      startTime: {
        $gte: yesterday,
        $lt: today
      },
      status: { $ne: "Cancelled" }
    });

    const areaHourMap = {};

    bookings.forEach((booking) => {

      if (!booking.startTime) return;

      const date = new Date(booking.startTime);

      if (isNaN(date.getTime())) return;

      const area = booking.Area;
      const hour = date.getHours();

      if (!area) return;

      if (!areaHourMap[area]) areaHourMap[area] = {};
      if (!areaHourMap[area][hour]) areaHourMap[area][hour] = 0;

      areaHourMap[area][hour]++;

    });
    const slots = await SlotModel.find();

    if (slots.length > 0) {
      await SlotModel.bulkWrite(
        slots.map((slot) => ({
          updateOne: {
            filter: { _id: slot._id },
            update: {
              $set: {
                "surge.surgeHour": null,
                "surge.isActive": false,
                "pricing.hourly": slot.basePricing.hourly,
                "pricing.daily": slot.basePricing.daily,
                "pricing.monthly": slot.basePricing.monthly
              }
            }
          }
        }))
      );
    }

    for (const area in areaHourMap) {

      const hours = areaHourMap[area];

      let peakHour = null;
      let maxBookings = 0;

      for (const hour in hours) {

        if (hours[hour] > maxBookings) {
          maxBookings = hours[hour];
          peakHour = Number(hour);
        }

      }

      console.log("Area:", area, "PeakHour:", peakHour);

      await SlotModel.updateMany(
        { Area: area },
        {
          $set: {
            "surge.surgeHour": peakHour,
            "surge.isActive": false
          }
        }
      );

    }

  } catch (error) {

    console.log("Peak Detection Error:", error);

  }
}, { noOverlap: true });



cron.schedule("0 * * * *", async () => {

  try {
    const currentHour = new Date().getHours();

    const slots = await SlotModel.find();

    for (const slot of slots) {

      if (!slot.surge) continue;

      // Peak hour -> increase price
      if (currentHour === slot.surge.surgeHour && !slot.surge.isActive) {

        await SlotModel.updateOne(
          { _id: slot._id },
          {
            $set: {
              "pricing.hourly": slot.basePricing.hourly * 1.2,
              "pricing.daily": slot.basePricing.daily * 1.2,
              "pricing.monthly": slot.basePricing.monthly * 1.2,
              "surge.isActive": true
            }
          }
        );

        console.log("Surge Activated:", slot.Area);

      } else if (
        currentHour !== slot.surge.surgeHour &&
        slot.surge.isActive
      ) {

        await SlotModel.updateOne(
          { _id: slot._id },
          {
            $set: {
              "pricing.hourly": slot.basePricing.hourly,
              "pricing.daily": slot.basePricing.daily,
              "pricing.monthly": slot.basePricing.monthly,
              "surge.isActive": false
            }
          }
        );

        console.log("Surge Deactivated:", slot.Area);
      }

    }

  } catch (error) {

    console.log("Surge Price Error:", error);

  }
}, { noOverlap: true });
