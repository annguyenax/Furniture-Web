import axiosClient from "./axiosClient";

const adminApi = {
  // ADMIN
  getAllUsers: () => axiosClient.get("/admin/users"),
  getUserById: (userId) => axiosClient.get(`/admin/users/${userId}`),
  updateUser: (userId, userData) =>
    axiosClient.put(`/admin/users/${userId}`, userData),
  banUser: (userId) => axiosClient.put("/admin/users/ban", { userId }),
  unbanUser: (userId) => axiosClient.put("/admin/users/unban", { userId }),
  assignRoleToUser: (userId, roleId) =>
    axiosClient.post("/admin/users/assign-role", { userId, roleId }),

  // CUSTOMER
  getMyProfile: () => axiosClient.get("/users/me"),
  updateMyProfile: (data) => axiosClient.put("/users/me", data),
  uploadAvatar: (formData) =>
    axiosClient.post("/users/me/upload-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default adminApi;
