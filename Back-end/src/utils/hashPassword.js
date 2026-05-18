const bcrypt = require("bcrypt");

/**
 * Băm mật khẩu an toàn bằng bcrypt
 * @param {string} password - Mật khẩu gốc của người dùng
 * @returns {Promise<string>} - Mật khẩu đã được băm (hash)
 */
const hashPassword = async (password) => {
  if (!password || typeof password !== "string") {
    throw new Error("Invalid password input for hashing");
  }

  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error.message);
    throw new Error("Password hashing failed");
  }
};

/**
 * So sánh mật khẩu người dùng nhập với mật khẩu đã băm trong DB
 * @param {string} password - Mật khẩu người dùng nhập
 * @param {string} hashedPassword - Mật khẩu đã băm trong cơ sở dữ liệu
 * @returns {Promise<boolean>} - true nếu khớp, false nếu sai
 */
const comparePassword = async (password, hashedPassword) => {
  if (!password || !hashedPassword) {
    throw new Error("Missing password or hash for comparison");
  }

  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error("Error comparing password:", error.message);
    throw new Error("Password comparison failed");
  }
};

module.exports = {
  hashPassword,
  comparePassword,
};
