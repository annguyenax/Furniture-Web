const rateLimit = require("express-rate-limit");

// Rate limiter cho login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 20, // Tối đa 20 request/15 phút từ 1 IP
  message: {
    message:
      "Quá nhiều yêu cầu đăng nhập từ IP này. Vui lòng thử lại sau 15 phút.",
  },
  standardHeaders: true, // Trả về info trong `RateLimit-*` headers
  legacyHeaders: false, // Tắt `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // Không đếm request thành công
  handler: (req, res) => {
    res.status(429).json({
      message:
        "Quá nhiều yêu cầu đăng nhập từ IP này. Vui lòng thử lại sau 15 phút.",
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000 / 60), // phút
    });
  },
});

// Rate limiter cho API chung
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // 100 requests/15 phút
  message: {
    message: "Quá nhiều request. Vui lòng thử lại sau.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter, apiLimiter };
