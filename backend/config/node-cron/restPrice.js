import cron from "node-cron";
import { SlotModel } from "../../app/models/ParkingSlot.js";

// // cron.schedule("*/5 * * * *", async () => {
// //     console.log("resetting Slot Prices");
// //     const slots = await SlotModel.find();
// //     for (const slot of slots) {
// //         slot.pricing.hourly = slot.pricing.hourly / 1.2;
// //         slot.pricing.daily = slot.pricing.daily / 1.2;
// //         slot.pricing.monthly = slot.pricing.monthly / 1.2;
// //         await slot.save();
// //     }
// // })

// import cron from "node-cron";
// import { SlotModel } from "../../app/models/ParkingSlot.js";

// cron.schedule("* * * * *", async () => {

//   try {

//     const currentHour = new Date().getHours();

//     const slots = await SlotModel.find({
//       "peakHour.active": true
//     });

//     for (const slot of slots) {

//       if (slot.peakHour.hour !== currentHour) {

//         await SlotModel.updateOne(
//           { _id: slot._id },
//           {
//             $set: {
//               "pricing.hourly": slot.pricing.baseHourly,
//               "pricing.daily": slot.pricing.baseDaily,
//               "pricing.monthly": slot.pricing.baseMonthly,
//               "peakHour.active": false
//             }
//           }
//         );

//         console.log("Price reset for slot:", slot._id);

//       }

//     }

//   } catch (error) {

//     console.log("Reset Price Error:", error);

//   }

// });


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