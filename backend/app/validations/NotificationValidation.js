import Joi from "joi";

export const NotificationValidationSchema = Joi.object({
    recipient: Joi.string().hex().length(24).required(),
    sender: Joi.string().hex().length(24).optional(),
    message: Joi.string().required(),
    type: Joi.string().valid("booking", "cancellation", "message", "peakHours", "slotApproval").required(),
    data: Joi.object({
        bookingId: Joi.string().hex().length(24).optional(),
        slotId: Joi.string().hex().length(24).optional()
    }).optional(),
    isRead: Joi.boolean().optional()
});
