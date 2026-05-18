const axios = require("axios");
require("dotenv").config();

/**
 * Verify Google reCAPTCHA v3 token
 * @param {string} token - CAPTCHA token from frontend
 * @returns {Promise<boolean>} - true if valid, false otherwise
 */
const verifyCaptcha = async (token) => {
  if (!token) return false;

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );

    const data = response.data;

    console.log("CAPTCHA verification result:", {
      success: data.success,
      score: data.score,
      action: data.action,
    });

    // reCAPTCHA v3 trả về score 0.0 - 1.0
    // Score > 0.5 = likely human
    // Score < 0.5 = likely bot
    return data.success && data.score > 0.5;
  } catch (error) {
    console.error("CAPTCHA verification error:", error.message);
    return false;
  }
};

module.exports = { verifyCaptcha };
