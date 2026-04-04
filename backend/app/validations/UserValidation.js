import Joi from "joi";

// Register Validation
export const UserValidation = Joi.object({
    userName: Joi.string().trim().min(3).max(30).required(),
    role: Joi.string().trim().min(3).max(30).required(),
    email: Joi.string().trim().email().required(),
    wallet:Joi.number().required(),
    password: Joi.string().trim().min(8).max(15).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    phoneNumber: Joi.string().trim().min(10).max(10).required()
})

export const LoginValidation = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(8).max(15).required(),
})