import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";

export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Registration failed"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ userData, captchaToken }, thunkAPI) => {
    try {
      const response = await authService.login(userData, captchaToken);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message:
          error.response?.data?.message || error.message || "Login failed",
        needCaptcha: error.response?.data?.needCaptcha || false,
        isLocked: error.response?.data?.isLocked || false,
        attempts: error.response?.data?.attempts || 0,
      });
    }
  }
);

// ← THÊM GOOGLE LOGIN ACTION
export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (googleToken, thunkAPI) => {
    try {
      const response = await authService.loginWithGoogle(googleToken);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Google login failed"
      );
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
  return null;
});

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, thunkAPI) => {
    try {
      const response = await authService.getProfile();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  roles: [],
  isAuthenticated: false,
  isLoading: false,
  message: null,
  error: null,
  needCaptcha: false,
  isLocked: false,
  attempts: 0,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    checkAuthStatus: (state) => {
      state.isAuthenticated = !!state.user;
    },
    resetMessage: (state) => {
      state.message = null;
      state.error = null;
      state.needCaptcha = false;
      state.isLocked = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user || null;
        state.roles = action.payload.user?.roles || [];
        state.isAuthenticated = false;
        state.message = action.payload.message;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.roles = action.payload.user.roles || [];
        state.isAuthenticated = true;
        state.message = action.payload.message;
        state.needCaptcha = false;
        state.isLocked = false;
        state.attempts = 0;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.payload ||
          action.error?.message ||
          "Đăng nhập thất bại";
        state.needCaptcha = action.payload?.needCaptcha || false;
        state.isLocked = action.payload?.isLocked || false;
        state.attempts = action.payload?.attempts || 0;
      })
      // ← THÊM GOOGLE LOGIN CASES
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.roles = action.payload.user.roles || [];
        state.isAuthenticated = true;
        state.message = action.payload.message;
        state.needCaptcha = false;
        state.isLocked = false;
        state.attempts = 0;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Đăng nhập Google thất bại";
      })
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user || action.payload;
        state.roles = action.payload.user?.roles || action.payload.roles || [];
        state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.roles = [];
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.roles = [];
        state.isAuthenticated = false;
        state.message = null;
        state.error = null;
        state.needCaptcha = false;
        state.isLocked = false;
        state.attempts = 0;
      });
  },
});

export const { checkAuthStatus, resetMessage } = authSlice.actions;
export default authSlice.reducer;
