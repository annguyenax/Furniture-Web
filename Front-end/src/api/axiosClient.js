import axios from "axios";

// API base URL từ .env
const API_URL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // gửi cookie HttpOnly (access + refresh)
  timeout: 10000,
});

// ===========================
//   REQUEST INTERCEPTOR
// ===========================
axiosClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ===========================
//   REFRESH TOKEN LOGIC
// ===========================

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve(token);
  });
  failedQueue = [];
};

// ===========================
//   RESPONSE INTERCEPTOR
// ===========================
axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response) return Promise.reject(error);

    // Handle banned account: clear session and redirect to login
    if (error.response.status === 403 && error.response.data?.banned) {
      try {
        await axiosClient.post("/auth/logout"); // yêu cầu BE clear cookie HttpOnly
      } catch (_) {
        // ignore logout failure để tránh vòng lặp
      }
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login?banned=1";
      }
      return Promise.reject(error);
    }

    // Không bao giờ refresh khi lỗi xảy ra ở login/register
    if (
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/register")
    ) {
      return Promise.reject(error);
    }

    // Không retry chính refresh-token
    if (originalRequest.url.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

    // ===============================
    //       TOKEN HẾT HẠN
    // ===============================
    if (
      error.response.status === 401 &&
      error.response.data?.needRefresh === true && // BE báo cần refresh
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Nếu đã có refresh đang chạy thì chờ
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // refresh-token gửi cookie từ trình duyệt
        await axiosClient.post("/auth/refresh-token");

        processQueue(null, true);

        // retry lại request ban đầu
        return axiosClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // Các lỗi khác => trả về FE
    return Promise.reject(error);
  }
);

export default axiosClient;
