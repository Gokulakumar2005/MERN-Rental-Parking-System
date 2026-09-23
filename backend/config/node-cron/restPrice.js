import cron from "node-cron";
import { SlotModel } from "../../app/models/ParkingSlot.js";

cron.schedule("*/5 * * * *", async () => {

  try {
    console.log("Resetting slot prices after peak hours");
    const currentHour = new Date().getHours();

    const slots = await SlotModel.find({
      "surge.isActive": true
    });

    for (const slot of slots) {

      if (currentHour > slot.surge.surgeHour) {

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

        console.log("Price Reset:", slot.Area);
      }
    }
  } catch (error) {
    console.log("Price Reset Error:", error.message);
  }
}, { noOverlap: true });