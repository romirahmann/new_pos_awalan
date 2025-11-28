const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../database/cloud.config");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "dexprint",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

module.exports = upload;
