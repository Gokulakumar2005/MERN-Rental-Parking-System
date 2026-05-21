import Joi from "joi";

export const ChatValidationSchema = Joi.object({
    roomId: Joi.string().required(),
    senderId: Joi.string().hex().length(24).required(),
    receiverId: Joi.string().hex().length(24).required(),
    message: Joi.string().trim().required(),
    isRead: Joi.boolean().optional()
});
