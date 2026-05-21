import Joi from "joi";

export const PaymentValidationSchema = Joi.object({
    userId: Joi.string().hex().length(24).required(),
    VendorId: Joi.string().hex().length(24).required(),
    slotcount: Joi.number().integer().min(0).required(), // can be 0 or more
    amount: Joi.number().min(0).required(),
    orderId: Joi.string().required(),
    paymentId: Joi.string().required(),
    PaymentStatus: Joi.string().valid("pending", "completed", "rejected").optional()
});
