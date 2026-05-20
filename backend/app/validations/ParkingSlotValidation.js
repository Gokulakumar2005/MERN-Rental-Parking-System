import joi from "joi";

export const PslotValidation = joi.object({
    name: joi.string().trim().min(3).max(100).required(),

    address: joi.string().trim().required(),
    Area:joi.string().trim().required(),
    vehicles: joi.string().trim().required(),
    totalSlot: joi.number().required(),
    vendorId: joi.string().required(),

    pricing: joi.object({
        hourly: joi.string().trim().required(),
        daily: joi.string().trim().required(),
        monthly: joi.string().trim().required()
    }).required(),

    facilities: joi.array().items(joi.string().trim()).required(),

    fullImage: joi.string().trim().allow("").optional(),
    approvalStatus: joi.string().trim().valid("approved", "pending", "rejected").optional(),

    propertyDocument: joi.object({
        documentType: joi.string().trim().required(),

    }).required(),

})

