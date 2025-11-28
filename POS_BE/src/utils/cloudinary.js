const cloudinary = require("../database/cloud.config");

const getPublicId = (url) => {
  try {
    const parts = url.split("/");
    const filename = parts.pop().split(".")[0];
    return `awalan/${filename}`;
  } catch {
    return null;
  }
};

const deleteFile = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { getPublicId, deleteFile };
