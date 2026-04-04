// import Joi from "joi";

// export const createOrderSchema = Joi.object({
//     amount: Joi.number().positive().required()
// });



// export const verifyPaymentSchema = Joi.object({
//     razorpay_order_id: Joi.string().required(),
//     razorpay_payment_id: Joi.string().required(),
//     razorpay_signature: Joi.string().required(),

//     bookingData: Joi.object({
//         userId: Joi.string().required(),
//         vendorId: Joi.string().required(),
//         slotId: Joi.string().required(),

//         vehicletype: Joi.string().required(),
//         vehiclesNumber: Joi.string().required(),
//         Based: Joi.string().required(),

//         startTime: Joi.date().required(),
//         endTime: Joi.date().greater(Joi.ref("startTime")).required(),

//         Amount: Joi.number().positive().required(),

//         slotcount: Joi.array().items(Joi.string()).min(1).required()
//     }).required()
// });

import Joi from "joi";

// reusable ObjectId validator
const objectId = Joi.string().hex().length(24);

export const createOrderSchema = Joi.object({
    amount: Joi.number().positive().min(1).required()
});


export const verifyPaymentSchema = Joi.object({
    razorpay_order_id: Joi.string().required(),
    razorpay_payment_id: Joi.string().required(),
    razorpay_signature: Joi.string().required(),

    bookingData: Joi.object({
        userId: objectId.required(),
        vendorId: objectId.required(),
        slotId: objectId.required(),

        vehicletype: Joi.string()
            .required(),

        vehiclesNumber: Joi.string()
            .min(5)
            .max(15)
            .required(),

        Based: Joi.string()
            .required(),

        startTime: Joi.date().required(),

        endTime: Joi.date()
            .greater(Joi.ref("startTime"))
            .required(),

        Amount: Joi.number().positive().required(),

        slotcount: Joi.array()
    .items(Joi.number())
    .min(1)
    .required()
    }).required()
});