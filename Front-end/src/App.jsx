import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getProfile } from "./redux/authSlice";
import AppRoutes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  const checkAuth = async () => {
    try {
      // Luôn gọi profile → để BE tự xác định login hay chưa
      await dispatch(getProfile()).unwrap();
    } catch (error) {
      // Nếu BE trả needLogin → user chưa đăng nhập → bỏ qua
      console.log("User is not logged in.");
    }

    setIsInitialized(true);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </GoogleOAuthProvider>
  );
}

export default App;
