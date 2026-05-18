import axiosClient from "./axiosClient";

const authApi = {
  login: (data) => axiosClient.post("/auth/login", data),
  register: (data) => axiosClient.post("/auth/register", data),

  // refresh token
  refresh: () => axiosClient.post("/auth/refresh-token"),

  logout: () => axiosClient.post("/auth/logout"),

  // user (admin dùng)
  getUserById: (userId) => axiosClient.get(`/admin/users/${userId}`),

  // ⭐ PROFILE ĐÚNG ROUTE MỚI
  getProfile: () => axiosClient.get("/users/me"),

  // login Google
  loginWithGoogle: (googleToken) =>
    axiosClient.post("/auth/google", { googleToken }),

  // PASSWORD
  forgotPassword: (email) =>
    axiosClient.post("/auth/forgot-password", { email }),

  resetPassword: (token, newPassword) =>
    axiosClient.post("/auth/reset-password", { token, newPassword }),
};

export default authApi;
