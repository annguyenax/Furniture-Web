import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShipperLogo from "../../components/shipper/ShipperLogo";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";

const REDIRECT_DELAY = 2000;

const ShipperLanding = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    const checkAccess = async () => {
      try {
        // Kiểm tra user hiện tại - sử dụng endpoint đúng
        const res = await axiosClient.get("/users/me");

        if (!res.data?.success) {
          throw new Error("NOT_AUTH");
        }

        const user = res.data.user;

        // Kiểm tra roles là mảng - backend trả về roles: ["shipper"]
        if (!user.roles || !user.roles.includes("shipper")) {
          toast.error("Bạn không có quyền truy cập khu vực shipper");
          navigate("/");
          return;
        }

        // OK → redirect dashboard
        timer = setTimeout(() => {
          navigate("/shipper/dashboard");
        }, REDIRECT_DELAY);
      } catch (err) {
        // Xử lý lỗi từ axios interceptor hoặc lỗi khác
        if (err.response?.status === 401 || err.message === "NOT_AUTH") {
          toast.error("Vui lòng đăng nhập để tiếp tục");
          navigate("/login");
        } else {
          toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
          navigate("/");
        }
      }
    };

    checkAccess();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div
      className="min-h-screen bg-[#F84C4C] flex flex-col items-center justify-center"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="text-center">
        <div className="animate-fade-in-up mb-4">
          <ShipperLogo className="w-24 h-24 mx-auto" />
        </div>

        <h1 className="text-4xl font-bold text-white animate-fade-in-up animation-delay-200">
          ShipPro
        </h1>

        <p className="text-white mt-2 animate-fade-in-up animation-delay-400">
          Đang kiểm tra quyền truy cập...
        </p>
      </div>
    </div>
  );
};

export default ShipperLanding; 