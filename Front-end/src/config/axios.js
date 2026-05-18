import axios from "axios";

// Lấy cổng backend từ biến môi trường hoặc mặc định là 8080 cho local
const BACKEND_PORT = 8080;
const API_URL =
  import.meta.env.VITE_API_URL || `http://localhost:${BACKEND_PORT}/api/v1`;

// Cấu hình mặc định cho axios
axios.defaults.baseURL = API_URL;


export default axios;
