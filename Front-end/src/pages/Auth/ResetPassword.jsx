import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import authService from "../../services/authService";
import "react-toastify/dist/ReactToastify.css";

// 🟢 Hàm kiểm tra mật khẩu mạnh
const isStrongPassword = (password) => {
  const minLength = /.{8,}/;
  const lowercase = /[a-z]/;
  const uppercase = /[A-Z]/;
  const number = /[0-9]/;
  const special = /[^A-Za-z0-9]/;

  return (
    minLength.test(password) &&
    lowercase.test(password) &&
    uppercase.test(password) &&
    number.test(password) &&
    special.test(password)
  );
};

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // 🟢 Lấy token từ URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlToken = queryParams.get("token");

    if (urlToken) {
      setToken(urlToken);
    } else {
      toast.error("Token không hợp lệ hoặc bị thiếu!");
      setTokenValid(false);
    }
  }, [location]);

  // 🟢 Submit Reset Password
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields
    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // ✅ BỎ: Kiểm tra mật khẩu mạnh (đã có cảnh báo inline + backend validate)
    // Confirm password match
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (!token) {
      toast.error("Token không hợp lệ hoặc bị thiếu!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword(token, newPassword);

      toast.success(response.message || "Đặt lại mật khẩu thành công!", {
        autoClose: 2000,
      });

      setIsSuccess(true);

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Đã xảy ra lỗi! Vui lòng thử lại.";

      toast.error(errorMessage);

      if (err.response?.data?.expired) {
        setTimeout(() => navigate("/forgot-password"), 4000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 🟠 Token invalid screen
  if (!tokenValid) {
    return (
      <div className="flex justify-center items-center h-full p-8 bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Token Không Hợp Lệ
          </h2>
          <p className="text-gray-600 mb-6">
            Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
          </p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Yêu cầu link mới
          </button>
        </div>
        <ToastContainer />
      </div>
    );
  }

  // 🟢 Success screen
  if (isSuccess) {
    return (
      <div className="flex justify-center items-center h-full p-8 bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Đặt Lại Mật Khẩu Thành Công!
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn sẽ được chuyển đến trang đăng nhập...
          </p>
          <Loader2 className="mx-auto h-8 w-8 text-indigo-600 animate-spin" />
        </div>
        <ToastContainer />
      </div>
    );
  }

  // 🟢 Main Reset Password Form
  return (
    <div className="flex justify-center items-center h-full p-8 bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl shadow-lg border border-gray-100 bg-white bg-opacity-90 backdrop-blur-md">
        <div className="flex flex-wrap">
          {/* Hình minh họa */}
          <div className="hidden md:block w-1/2 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="./login.png"
                alt="Đặt lại mật khẩu"
                className="h-full w-full object-contain hover:scale-102 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Form */}
          <div className="w-full md:w-1/2 bg-white p-8 bg-gradient-to-br from-white to-blue-50">
            <div className="max-w-md mx-auto">
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full shadow-md">
                  <Lock className="text-white" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 ml-3">
                  Đặt Lại Mật Khẩu
                </h2>
              </div>

              <p className="text-gray-600 mb-6">
                Nhập mật khẩu mới của bạn để hoàn tất việc đặt lại.
              </p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Mật khẩu mới */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white shadow-sm"
                      placeholder="Nhập mật khẩu mới"
                      disabled={isLoading}
                    />
                  </div>

                  {/* ✅ CẢNH BÁO INLINE - Màu amber */}
                  {newPassword && !isStrongPassword(newPassword) && (
                    <p className="text-xs text-amber-600 mt-2 flex items-start gap-1">
                      <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>
                        Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ
                        thường, số và ký tự đặc biệt để tăng bảo mật.
                      </span>
                    </p>
                  )}
                </div>

                {/* Xác nhận mật khẩu */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white shadow-sm"
                      placeholder="Nhập lại mật khẩu mới"
                      disabled={isLoading}
                    />
                  </div>

                  {/* ✅ CẢNH BÁO INLINE - Màu red */}
                  {confirmPassword && confirmPassword !== newPassword && (
                    <p className="text-xs text-red-600 mt-2 flex items-start gap-1">
                      <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>
                        Mật khẩu xác nhận phải giống với mật khẩu mới.
                      </span>
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 shadow-md transition disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      Đặt Lại Mật Khẩu
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-gray-600 mt-6">
                Nhớ mật khẩu rồi?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline"
                >
                  Đăng nhập ngay
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ResetPassword;
