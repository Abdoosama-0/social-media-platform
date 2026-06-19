const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// helper function
const isVideo = (file) => file.mimetype.startsWith("video");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    return {
      folder: "uploads",
      resource_type: isVideo(file) ? "video" : "image",
      allowed_formats: isVideo(file)
        ? ["mp4", "mov", "webm"]
        : ["jpg", "png", "jpeg"],
    };
  },
});

module.exports = storage;