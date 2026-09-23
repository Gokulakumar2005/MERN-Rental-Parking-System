import cron from "node-cron";
import { SlotModel } from "../../app/models/ParkingSlot.js";

cron.schedule("*/5 * * * *", async () => {

  const now = new Date();
  const currentHour = now.getHours();

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

});