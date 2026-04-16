import cron from "node-cron";
import { BookingModel } from "../../app/models/BookingModel.js";
import { SlotModel } from "../../app/models/ParkingSlot.js";


cron.schedule("55 19 * * *", async () => {

  try {

    console.log("Detecting Peak Hour...");

    const bookings = await BookingModel.find();

    const areaHourMap = {};

    bookings.forEach((booking) => {

      if (!booking.startTime) return;

      const date = new Date(booking.startTime);

      if (isNaN(date.getTime())) return;

      const area = booking.Area;
      const hour = date.getHours();

      if (!areaHourMap[area]) areaHourMap[area] = {};
      if (!areaHourMap[area][hour]) areaHourMap[area][hour] = 0;

      areaHourMap[area][hour]++;

    });

    for (const area in areaHourMap) {

      const hours = areaHourMap[area];

      let peakHour = null;
      let maxBookings = 0;

      for (const hour in hours) {

        if (hours[hour] > maxBookings) {
          maxBookings = hours[hour];
          peakHour = hour;
        }

      }

      console.log("Area:", area, "PeakHour:", peakHour);

      await SlotModel.updateMany(
        { Area: area },
        {
          $set: {
            "surge.surgeHour": Number(peakHour),
            "surge.isActive": false
          }
        }
      );

    }

  } catch (error) {

    console.log("Peak Detection Error:", error);

  }

});



cron.schedule("0 * * * *", async () => {

  try {

    const currentHour = new Date().getHours();

    const slots = await SlotModel.find();

    for (const slot of slots) {

      if (
        slot.surge &&
        currentHour === slot.surge.surgeHour &&
        !slot.surge.isActive
      ) {

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

      }

    }

  } catch (error) {

    console.log("Surge Activation Error:", error);

  }

});