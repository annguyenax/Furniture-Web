const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided", needLogin: true });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Access token expired", needRefresh: true });
      }
      return res.status(401).json({ message: "Invalid token", needLogin: true });
    }

    // Block refresh tokens from accessing protected routes
    if (decoded?.type === "refresh") {
      return res.status(401).json({ message: "Invalid token", needLogin: true });
    }

    // Lấy user từ DB để kiểm tra trạng thái
    const user = await User.findOne({
      where: { user_id: decoded.user_id || decoded.id },
      attributes: ["user_id", "status", "email"],
    });

    if (!user) {
      return res.status(401).json({ message: "User not found", needLogin: true });
    }

    if (user.status === "banned") {
      return res.status(403).json({ message: "Tài khoản đã bị khóa", banned: true });
    }

    req.user = {
      ...decoded,
      id: decoded.id || decoded.user_id,
      user_id: decoded.user_id || decoded.id,
      email: decoded.email || user.email,
      roles: decoded.roles || [],
    };

    next();
  } catch (error) {
    console.error("authMiddleware error:", error.message);
    return res.status(500).json({ message: "Internal authentication error" });
  }
};

module.exports = authMiddleware;
