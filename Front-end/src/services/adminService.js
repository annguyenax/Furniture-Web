import adminApi from "../api/adminApi";

const adminService = {
  /* ================= ADMIN ================= */

  getAllUsers: async () => {
    const res = await adminApi.getAllUsers();
    return res.data;
  },

  getUserById: async (userId) => {
    const res = await adminApi.getUserById(userId);
    return res.data;
  },

  updateUserById: async (userId, userData) => {
    const res = await adminApi.updateUser(userId, userData);
    return res.data;
  },

  banUser: async (userId) => {
    const res = await adminApi.banUser(userId);
    return res.data;
  },

  unbanUser: async (userId) => {
    const res = await adminApi.unbanUser(userId);
    return res.data;
  },

  assignRoleToUser: async (userId, roleId) => {
    const res = await adminApi.assignRoleToUser(userId, roleId);
    return res.data;
  },

  /* ================= CUSTOMER ================= */

  getMyProfile: async () => {
    const res = await adminApi.getMyProfile();
    return res.data; // { user: {...} }
  },

  updateMyProfile: async (data) => {
    const res = await adminApi.updateMyProfile(data);
    return res.data; // { success: true, data: {...} }
  },

  uploadAvatar: async (formData) => {
    const res = await adminApi.uploadAvatar(formData);
    return res.data;
  },
};

export default adminService;
