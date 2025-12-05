import cloudinary from "cloudinary";
export const v2 = cloudinary.v2;
import { CloudinaryStorage } from "multer-storage-cloudinary";

v2.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const storage = new CloudinaryStorage({
  cloudinary: v2,
  params: {
    folder: "users-avatar",
    allowedFormats: ["jpg", "png"],
  },
});
