// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import cloudinary from "./cloudinary.js";

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     return {
//       folder: "parking-slots", // better name
//       allowed_formats: ["jpg", "png", "jpeg", "pdf"],
//       public_id: Date.now() + "-" + file.originalname.split(".")[0],
//     };
//   },
// });

// export const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 80MB limit
// });

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {

    // Check if uploaded file is PDF
    const isPDF = file.mimetype === "application/pdf";

    return {
      folder: "parking-slots",

      // Important for PDF uploads
      resource_type: isPDF ? "raw" : "image",

      allowed_formats: ["jpg", "png", "jpeg", "pdf"],

      public_id:
        Date.now() +
        "-" +
        file.originalname.split(".")[0],
    };
  },
});

export const upload = multer({
  storage,

  limits: {
    // 10MB limit
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only JPG, PNG, JPEG, and PDF files are allowed")
      );
    }

    cb(null, true);
  },
});