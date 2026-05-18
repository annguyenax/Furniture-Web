const User = require("../models/user");
const {
  registerUser,
  loginUser,
  loginWithGoogle, // ← THÊM
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
} = require("../services/authService");
const { verifyToken } = require("../config/jwt");
require("dotenv").config();

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd ? true : false,
  sameSite: isProd ? "None" : "Lax",
  domain: isProd ? process.env.COOKIE_DOMAIN : undefined,
  path: "/",
};

// ========================== REGISTER ==========================
const handleregisterUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const result = await registerUser(username, email, password);

    return res.status(201).json({
      message: result.message || "User registration successful.",
      user: result.user || null,
    });
  } catch (error) {
    console.error(" Lỗi đăng ký:", error.message);
    return res.status(400).json({
      message: error.message || "Đăng ký thất bại, vui lòng thử lại.",
    });
  }
};

// ========================== LOGIN ==========================
const handleLoginUser = async (req, res) => {
  try {
    const { email, password, rememberMe, captchaToken } = req.body;

    const { accessToken, refreshToken, user } = await loginUser(
      email,
      password,
      rememberMe,
      captchaToken
    );

    const accessTokenMaxAge = rememberMe
      ? 7 * 24 * 60 * 60 * 1000
      : 2 * 60 * 60 * 1000;
    const refreshTokenMaxAge = rememberMe
      ? 30 * 24 * 60 * 60 * 1000
      : 7 * 24 * 60 * 60 * 1000;

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: accessTokenMaxAge,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: refreshTokenMaxAge,
    });

    res.json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Login error:", error.message);

    // Xác định status code
    const statusCode = error.isLocked ? 423 : 401; // 423 = Locked

    return res.status(statusCode).json({
      message: error.message,
      needCaptcha: error.needCaptcha || false,
      isLocked: error.isLocked || false,
      attempts: error.attempts || 0,
    });
  }
};

// ========================== GOOGLE LOGIN ==========================
const handleGoogleLogin = async (req, res) => {
  try {
    const { googleToken } = req.body;

    if (!googleToken) {
      return res.status(400).json({
        message: "Google token is required",
      });
    }

    const { accessToken, refreshToken, user } = await loginWithGoogle(
      googleToken
    );

    // Set cookies với thời gian dài hơn cho Google login
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày
    });

    return res.status(200).json({
      console: "Google login successful",
      user,
    });
  } catch (error) {
    console.error("Google login error:", error.message);
    return res.status(401).json({
      message: error.message,
    });
  }
};

// ========================== REFRESH TOKEN ==========================
const handleRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    console.log(
      "Refresh token from cookie:",
      refreshToken ? "exists" : "missing"
    );

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not found",
        needLogin: true,
      });
    }

    const {
      accessToken,
      refreshToken: newRefresh,
      user,
    } = await refreshAccessToken(refreshToken);

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefresh, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Token refreshed successfully",
      user,
    });
  } catch (error) {
    console.error("Refresh token error:", error.message);

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res.status(401).json({
      message: error.message,
      needLogin: true,
    });
  }
};

// ========================== VERIFY EMAIL ==========================
const verifyEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    const decoded = verifyToken(token);

    const user = await User.findOne({ where: { user_id: decoded.user_id } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.is_verified = true;
    await user.save();

    return res.redirect(`${process.env.CLIENT_URL}/login`);
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

// ========================== FORGOT PASSWORD ==========================
const handleForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    //  Validate email
    if (!email) {
      return res.status(400).json({
        message: "Email không được để trống.",
      });
    }

    const result = await forgotPassword(email);

    return res.status(200).json(result);
  } catch (error) {
    console.error("[ERROR] Forgot password error:", error.message);

    // ✅ Luôn return generic message để tránh lộ thông tin
    return res.status(200).json({
      message:
        "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.",
    });
  }
};

// ========================== RESET PASSWORD ==========================
const handleResetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // ✅ Validate inputs
    if (!token) {
      return res.status(400).json({
        message: "Thiếu token đặt lại mật khẩu.",
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        message: "Mật khẩu mới không được để trống.",
      });
    }

    // ✅ Call service
    const resultMessage = await resetPassword(token, newPassword);

    return res.status(200).json({
      message: resultMessage,
      success: true,
    });
  } catch (error) {
    console.error("[ERROR] Reset password error:", error.message);

    // ✅ Handle specific errors
    if (
      error.name === "TokenExpiredError" ||
      error.message.includes("hết hạn")
    ) {
      return res.status(400).json({
        message: "Link đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu lại.",
        expired: true,
      });
    }

    if (error.message.includes("Token da het han")) {
      return res.status(400).json({
        message: "Link dat lai mat khau da het han. Vui long yeu cau lai.",
        expired: true,
      });
    }

    if (
      error.message.includes("Token không hợp lệ") ||
      error.message.includes("Thiếu token")
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    if (
      error.message.includes("Token khong hop le") ||
      error.message.includes("Thieu token")
    ) {
      return res.status(400).json({
        message: error.message,
        invalid: true,
      });
    }

    if (error.message.includes("Không tìm thấy tài khoản")) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản.",
      });
    }

    if (error.message.includes("Mật khẩu phải có ít nhất")) {
      return res.status(400).json({
        message: error.message,
      });
    }

    if (error.message.includes("bị khóa")) {
      return res.status(403).json({
        message: error.message,
      });
    }

    // ✅ Generic error
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại sau.",
    });
  }
};

// ========================== LOGOUT ==========================
const handleLogout = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.user_id;

    if (userId) {
      await logoutUser(userId);
    }

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Logout failed",
    });
  }
};

module.exports = {
  handleregisterUser,
  handleLoginUser,
  handleGoogleLogin,
  handleRefreshToken,
  verifyEmail,
  handleForgotPassword,
  handleResetPassword,
  handleLogout,
};
