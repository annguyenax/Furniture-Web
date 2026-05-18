const express = require("express");
const authController = require("../controllers/authController");
const { loginLimiter } = require("../middleware/rateLimiter");
const router = express.Router();

// Register
router.post("/register", authController.handleregisterUser);

// Login - Có rate limiting
router.post("/login", loginLimiter, authController.handleLoginUser);

// ← THÊM ROUTE GOOGLE LOGIN
router.post("/google", authController.handleGoogleLogin);

// Refresh token
router.post("/refresh-token", authController.handleRefreshToken);

// Logout
router.post("/logout", authController.handleLogout);

// Verify email
router.get("/verify-email", authController.verifyEmail);

// Forgot password
router.post("/forgot-password", authController.handleForgotPassword);

// Reset password
router.post("/reset-password", authController.handleResetPassword);

module.exports = router;
