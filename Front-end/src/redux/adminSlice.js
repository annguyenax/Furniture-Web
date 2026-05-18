import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "../services/adminService";

/* ================= ADMIN ================= */

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminService.getAllUsers();
      console.log("FETCH_ALL_USERS_RESPONSE:", res);

      // BE trả { success: true, users: [...] }
      return Array.isArray(res.users) ? res.users : [];
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "admin/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await adminService.getUserById(userId);
      return res.user || null;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ user_id, ...data }, { rejectWithValue }) => {
    try {
      const res = await adminService.updateUserById(user_id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const banUser = createAsyncThunk(
  "admin/banUser",
  async (userId, { rejectWithValue }) => {
    try {
      await adminService.banUser(userId);
      return { userId };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const unbanUser = createAsyncThunk(
  "admin/unbanUser",
  async (userId, { rejectWithValue }) => {
    try {
      await adminService.unbanUser(userId);
      return { userId };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const assignRoleToUser = createAsyncThunk(
  "admin/assignRoleToUser",
  async ({ userId, roleId }, { rejectWithValue }) => {
    try {
      const res = await adminService.assignRoleToUser(userId, roleId);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= CUSTOMER ================= */

export const fetchMyProfile = createAsyncThunk(
  "admin/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminService.getMyProfile();
      return res.user || {};
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const updateMyProfile = createAsyncThunk(
  "admin/updateMyProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await adminService.updateMyProfile(data);
      return res.data || res.user || res;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  "admin/uploadAvatar",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await adminService.uploadAvatar(formData);
      return res.data; // FIX
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= SLICE ================= */

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    selectedUser: null,
    myProfile: {},
    loading: false,
    error: null,
  },
  reducers: {
    updateUserStatus: (state, action) => {
      const { userId, status } = action.payload;
      state.users = state.users.map((u) =>
        u.user_id === userId ? { ...u, status } : u
      );
    },
  },
  extraReducers: (builder) => {
    builder
      /* ================= ADMIN ================= */

      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload || [];
      })
      .addCase(fetchAllUsers.rejected, (state) => {
        state.loading = false;
      })

      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.users = state.users.map((u) =>
          u.user_id === action.payload.user_id ? { ...u, ...action.payload } : u
        );
      })

      .addCase(banUser.fulfilled, (state, action) => {
        state.users = state.users.map((u) =>
          u.user_id === action.payload.userId ? { ...u, status: "banned" } : u
        );
      })

      .addCase(unbanUser.fulfilled, (state, action) => {
        state.users = state.users.map((u) =>
          u.user_id === action.payload.userId ? { ...u, status: "active" } : u
        );
      })

      /* ================= CUSTOMER ================= */

      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.myProfile = action.payload;
        state.loading = false;
      })
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyProfile.rejected, (state) => {
        state.loading = false;
      })

      .addCase(uploadAvatar.fulfilled, (state, action) => {
        if (state.myProfile && action.payload?.profile_picture) {
          state.myProfile.profile_picture = action.payload.profile_picture;
        }
      })

      .addCase(updateMyProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload) {
          state.myProfile = {
            ...state.myProfile,
            ...action.payload,
          };
        }
      })
      .addCase(updateMyProfile.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { updateUserStatus } = adminSlice.actions;
export default adminSlice.reducer;
