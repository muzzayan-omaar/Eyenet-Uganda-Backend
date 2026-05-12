import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// ======================
// CLOUDINARY CONFIG
// ======================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// MULTER STORAGE
// ======================
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "eyenet-products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

export { cloudinary, storage };