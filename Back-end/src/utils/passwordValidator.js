/**
 * Kiểm tra mật khẩu có đủ mạnh không
 * @param {string} password - Mật khẩu cần kiểm tra
 * @returns {object} { isValid: boolean, message: string }
 */
const validatePassword = (password) => {
  if (!password) {
    return {
      isValid: false,
      message: "Mật khẩu không được để trống.",
    };
  }

  // Kiểm tra độ dài tối thiểu
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Mật khẩu phải có ít nhất 8 ký tự.",
    };
  }

  // Kiểm tra độ dài tối đa (tránh DoS)
  if (password.length > 128) {
    return {
      isValid: false,
      message: "Mật khẩu không được vượt quá 128 ký tự.",
    };
  }

  // Regex kiểm tra các yêu cầu
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  // Kiểm tra từng điều kiện
  if (!hasLowercase) {
    return {
      isValid: false,
      message: "Mật khẩu phải có ít nhất 1 chữ cái thường (a-z).",
    };
  }

  if (!hasUppercase) {
    return {
      isValid: false,
      message: "Mật khẩu phải có ít nhất 1 chữ cái hoa (A-Z).",
    };
  }

  if (!hasNumber) {
    return {
      isValid: false,
      message: "Mật khẩu phải có ít nhất 1 chữ số (0-9).",
    };
  }

  if (!hasSpecialChar) {
    return {
      isValid: false,
      message: "Mật khẩu phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*...).",
    };
  }

  // Tất cả đều hợp lệ
  return {
    isValid: true,
    message: "Mật khẩu hợp lệ.",
  };
};

/**
 * Kiểm tra mật khẩu có chứa thông tin cá nhân không
 * @param {string} password - Mật khẩu
 * @param {string} email - Email người dùng
 * @param {string} username - Username người dùng
 * @returns {boolean}
 */
const containsPersonalInfo = (password, email, username) => {
  const lowerPassword = password.toLowerCase();

  // Kiểm tra có chứa email (phần trước @)
  if (email) {
    const emailPrefix = email.split("@")[0].toLowerCase();
    if (lowerPassword.includes(emailPrefix)) {
      return true;
    }
  }

  // Kiểm tra có chứa username
  if (username && lowerPassword.includes(username.toLowerCase())) {
    return true;
  }

  return false;
};

/**
 * Kiểm tra mật khẩu phổ biến/yếu
 * @param {string} password
 * @returns {boolean}
 */
const isCommonPassword = (password) => {
  const commonPasswords = [
    "password",
    "12345678",
    "password123",
    "qwerty123",
    "abc12345",
    "password1",
    "admin123",
    "letmein",
    "welcome123",
    "monkey",
  ];

  return commonPasswords.includes(password.toLowerCase());
};

module.exports = {
  validatePassword,
  containsPersonalInfo,
  isCommonPassword,
};
