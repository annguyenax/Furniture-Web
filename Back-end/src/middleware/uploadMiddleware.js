const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const folder = req.url.includes("avatar") ? "avatars" : "products";
    return {
      folder: folder,
      allowed_formats: ["jpg", "png", "jpeg"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    };
  },
});

// 🛡 Thêm GIỚI HẠN kích thước file (2MB)
const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB → chống upload 50MB gây nghẽn RAM
  },
});

module.exports = upload;
