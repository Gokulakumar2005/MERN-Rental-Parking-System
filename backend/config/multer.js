import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "parking-slots", // better name
      allowed_formats: ["jpg", "png", "jpeg", "pdf"],
      public_id: Date.now() + "-" + file.originalname.split(".")[0],
    };
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 80 * 1024 * 1024 }, // 80MB limit
});