import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import authService from "../../services/authService";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validate email
    if (!email.trim()) {
      toast.error("Vui lòng nhập email!", { position: "top-right" });
      return;
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email không hợp lệ!", { position: "top-right" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.forgotPassword(email);

      toast.success(response.message || "Email đặt lại mật khẩu đã được gửi!", {
        position: "top-right",
        autoClose: 3000,
      });

      setIsSubmitted(true);
      setEmail("");
    } catch (err) {
      console.error("Forgot password error:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Đã xảy ra lỗi! Vui lòng thử lại.";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full p-8 bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl shadow-lg border border-gray-100 bg-white bg-opacity-90 backdrop-blur-md">
        <div className="flex flex-wrap">
          {/* Hình minh họa */}
          <div className="hidden md:block w-1/2 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="./login.png"
                alt="Quên mật khẩu"
                className="h-full w-full object-contain hover:scale-102 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Form quên mật khẩu */}
          <div className="w-full md:w-1/2 bg-white p-8 bg-gradient-to-br from-white to-blue-50">
            <div className="max-w-md mx-auto">
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-r from-stone-500 to-stone-600 p-3 rounded-full shadow-md">
                  <Mail className="text-white" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 ml-3">
                  Quên Mật Khẩu
                </h2>
              </div>

              {/* ✅ Thông báo thành công */}
              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">
                    ✓ Email đã được gửi! Vui lòng kiểm tra hộp thư của bạn.
                  </p>
                </div>
              )}

              <p className="text-gray-600 mb-6">
                Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
              </p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none"
                      placeholder="Nhập email của bạn"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 flex items-center justify-center bg-gradient-to-r from-stone-500 to-stone-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      Gửi Email Đặt Lại
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-gray-600 mt-6">
                Nhớ mật khẩu rồi?{" "}
                <Link
                  to="/login"
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
