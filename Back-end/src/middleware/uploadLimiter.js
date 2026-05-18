const rateLimit = require("express-rate-limit");

const uploadLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 5, // Tối đa 5 upload/phút
  message: {
    success: false,
    message: "Bạn upload ảnh quá nhiều lần. Vui lòng thử lại sau 1 phút.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = uploadLimiter;
