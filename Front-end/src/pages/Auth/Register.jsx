import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, resetMessage, loginWithGoogle } from "../../redux/authSlice";
import { ToastContainer, toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";

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

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message, error, isLoading } = useSelector((state) => state.auth);

  const hasSubmitted = useRef(false);

  useEffect(() => {
    dispatch(resetMessage());
  }, [dispatch]);

  useEffect(() => {
    if (message && hasSubmitted.current) {
      toast.success(message, {
        position: "top-right",
        autoClose: 2000,
        onClose: () => dispatch(resetMessage()),
      });
      setTimeout(() => navigate("/login"), 2000);
    }
    if (error && hasSubmitted.current) {
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
        onClose: () => dispatch(resetMessage()),
      });
    }
  }, [message, error, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    hasSubmitted.current = true;

    if (!username || !email || !password || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    await dispatch(register({ username, email, password }));
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      hasSubmitted.current = true;

      await dispatch(loginWithGoogle(credentialResponse.credential)).unwrap();
      toast.success("Đăng ký / đăng nhập Google thành công!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast.error(err || "Đăng ký Google thất bại");
    }
  };

  const handleGoogleError = () => {
    toast.error("Đăng ký Google thất bại");
  };

  return (
    <div className="flex justify-center items-center h-full p-8 bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl shadow-lg border border-gray-100 bg-white bg-opacity-90 backdrop-blur-md">
        <div className="flex flex-wrap">
          {/* Ảnh minh họa */}
          <div className="hidden md:block w-1/2 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="./sign.png"
                alt="Hình đăng ký"
                className="h-full w-full object-contain hover:scale-102 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Form đăng ký */}
          <div className="w-full md:w-1/2 bg-white p-8 bg-gradient-to-br from-white to-blue-50">
            <div className="max-w-md mx-auto">
              <div className="flex items-center mb-8">
                {/* 🔥 Đổi màu giống login */}
                <div className="bg-gradient-to-r from-stone-500 to-stone-600 p-3 rounded-full shadow-md">
                  <User className="text-white" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 ml-3">
                  Đăng ký
                </h2>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Username */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                    <input
                      type="text"
                      className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white shadow-sm"
                      placeholder="Nhập họ và tên"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                    <input
                      type="email"
                      className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white shadow-sm"
                      placeholder="Nhập email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                    <input
                      type="password"
                      className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white shadow-sm"
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {password && !isStrongPassword(password) && (
                    <p className="text-xs text-amber-600 mt-2 flex items-start gap-1">
                      <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>
                        Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ
                        thường, số và ký tự đặc biệt.
                      </span>
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                    <input
                      type="password"
                      className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white shadow-sm"
                      placeholder="Nhập lại mật khẩu"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-xs text-red-600 mt-2 flex items-start gap-1">
                      <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>Mật khẩu xác nhận không khớp.</span>
                    </p>
                  )}
                </div>

                {/* Nút submit — đổi màu giống Login */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 flex items-center justify-center bg-gradient-to-r from-stone-500 to-stone-600 text-white font-semibold rounded-lg hover:from-stone-600 hover:to-stone-700 shadow-md transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang đăng ký..." : "Đăng ký"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-r from-white to-blue-50 text-gray-500">
                    Hoặc tiếp tục với Google
                  </span>
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  text="continue_with"
                  shape="rectangular"
                  size="large"
                  width="350"
                  locale="vi"
                />
              </div>

              <p className="text-center text-gray-600">
                Đã có tài khoản?{" "}
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

export default Register;