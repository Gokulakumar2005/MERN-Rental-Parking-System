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

// Google Login Validation
export const GoogleLoginValidation = Joi.object({
    token: Joi.string().required()
})

// Update Profile Validation
export const UpdateProfileValidation = Joi.object({
    userName: Joi.string().trim().min(3).max(30).optional(),
    email: Joi.string().trim().email().optional(),
    phoneNumber: Joi.string().trim().min(10).max(10).optional(),
    profilePic: Joi.string().trim().allow("").optional(),
    wallet: Joi.number().min(0).optional(),
    role: Joi.string().trim().valid("admin", "user", "vendor").optional()
})

// Update Password Validation
export const UpdatePasswordValidation = Joi.object({
    oldPassword: Joi.string().trim().required(),
    newPassword: Joi.string().trim().min(8).max(15).required()
})

// Forgot Password Validation
export const ForgotPasswordValidation = Joi.object({
    detail: Joi.string().trim().required()
})

// Reset Password Validation
export const ResetPasswordValidation = Joi.object({
    detail: Joi.string().trim().required(),
    newPassword: Joi.string().trim().min(8).max(15).required()
})