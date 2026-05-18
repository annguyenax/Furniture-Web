import authApi from "../api/authApi";

const authService = {
  login: async (userData, captchaToken = null) => {
    const response = await authApi.login({
      ...userData,
      captchaToken,
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await authApi.register(userData);
    return response.data;
  },

  logout: async () => {
    await authApi.logout();
  },

  getUserById: async (userId) => {
    if (!userId) throw new Error("userId is required");
    const response = await authApi.getUserById(userId);
    return response.data;
  },

  refresh: async () => {
    const response = await authApi.refresh();
    return response.data.user;
  },

  getProfile: async () => {
    const response = await authApi.getProfile();
    return response.data.user;
  },

  loginWithGoogle: async (googleToken) => {
    const response = await authApi.loginWithGoogle(googleToken);
    return response.data;
  },
  // ========================== PASSWORD ==========================
  forgotPassword: async (email) => {
    const response = await authApi.forgotPassword(email);
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await authApi.resetPassword(token, newPassword);
    return response.data;
  },
};

export default authService;
