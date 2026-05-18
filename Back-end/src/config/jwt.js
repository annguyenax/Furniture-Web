const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}
const SECRET_KEY = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h"; // access token mặc định 2h

// Tạo token
const generateToken = (payload, expiresIn = EXPIRES_IN) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

// Xác thực token, có log lỗi
const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.error("JWT verify error:", error.name, "-", error.message);
    return null;
  }
};

module.exports = { generateToken, verifyToken };
