import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../../redux/authSlice";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineShoppingCart, MdOutlineLogout } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { fetchAllOrders } from "../../../../redux/orderSlice";
import { fetchReviewsByUser } from "../../../../redux/reviewsSilce";

const AccountSidebar = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const { orders } = useSelector((state) => state.orders);
  const { reviews: reviewList } = useSelector((state) => state.reviews);

  const reviewCount = reviewList?.length || 0;

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchReviewsByUser());
  }, [dispatch]);

  const orderCount =
    orders?.reduce((total, order) => {
      return total + (order.subOrders?.length || 0);
    }, 0) || 0;

  return (
    <div className="account-sidebar bg-white shadow-md rounded-md overflow-hidden border border-[#5A5758]">
      {/* ===== USER PROFILE ===== */}
      <div className="user-profile p-5 bg-[#3B393A] text-white">
        <div className="flex flex-col items-center">
          <div className="avatar mb-3 relative">
            <div className="w-20 h-20 overflow-hidden rounded-full border-4 border-[#D6D3D1] shadow-md">
              <img
                src={
                  user?.profile_picture ||
                  "https://th.bing.com/th/id/OIP.ByNwhzY5vUBvdIEfMCqDogHaHa?rs=1&pid=ImgDetMain"
                }
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://th.bing.com/th/id/OIP.ByNwhzY5vUBvdIEfMCqDogHaHa?rs=1&pid=ImgDetMain";
                }}
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold truncate">
            {user
              ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
              : "Người dùng"}
          </h3>

          <p className="text-sm text-[#D6D3D1] truncate">
            {user?.email || "user@example.com"}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-[#5A5758]">
          <div className="flex justify-between text-center text-xs">
            <div className="px-2">
              <p className="font-bold text-xl">{orderCount}</p>
              <p className="text-[#D6D3D1]">Đơn hàng</p>
            </div>
            <div className="px-2">
              <p className="font-bold text-xl">0</p>
              <p className="text-[#D6D3D1]">Yêu thích</p>
            </div>
            <div className="px-2">
              <p className="font-bold text-xl">{reviewCount}</p>
              <p className="text-[#D6D3D1]">Đánh giá</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MENU ===== */}
      <div className="p-4">
        <ul className="sidebar-menu">
          {/* Thông tin cá nhân */}
          <li className="mb-2">
            <Link
              to="/my-account/profile"
              className="flex items-center gap-2 p-2 rounded-md 
                         text-[#3B393A] hover:bg-gray-100 transition text-sm sm:text-base"
            >
              <FaRegUser className="text-lg" />
              <span>Thông tin cá nhân</span>
            </Link>
          </li>

          {/* Đơn hàng */}
          <li className="mb-2">
            <Link
              to="/my-account/orders"
              className="flex items-center gap-2 p-2 rounded-md 
                         text-[#3B393A] hover:bg-gray-100 transition text-sm sm:text-base"
            >
              <MdOutlineShoppingCart className="text-lg" />
              <span>Đơn hàng của tôi</span>
            </Link>
          </li>

          {/* Địa chỉ */}
          <li className="mb-2">
            <Link
              to="/my-account/addresses"
              className="flex items-center gap-2 p-2 rounded-md 
                         text-[#3B393A] hover:bg-gray-100 transition text-sm sm:text-base"
            >
              <IoLocationOutline className="text-lg" />
              <span>Địa chỉ</span>
            </Link>
          </li>

          {/* Wishlist */}
          <li className="mb-2">
            <Link
              to="#"
              className="flex items-center gap-2 p-2 rounded-md 
                         text-[#3B393A] hover:bg-gray-100 transition text-sm sm:text-base"
            >
              <CiHeart className="text-lg" />
              <span>Danh sách yêu thích</span>
            </Link>
          </li>

          {/* Logout */}
          <li className="mt-6 border-t pt-4 border-[#5A5758]">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 p-2 rounded-md 
                         text-red-600 hover:bg-red-50 transition w-full text-sm sm:text-base"
            >
              <MdOutlineLogout className="text-lg" />
              <span>Đăng xuất</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AccountSidebar;
