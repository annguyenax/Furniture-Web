import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../redux/authSlice";
import { fetchAllOrders } from "../../../../redux/orderSlice";
import Search from "../Search/Search";

import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

import { MdOutlineShoppingCart, MdNotificationsNone } from "react-icons/md";
import { FaRegHeart, FaUser } from "react-icons/fa";

import Navigation from "./Navigation";
import MyContext from "../../../../context/MyContext";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, roles } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.admin.selectedUser);
  const cartItems = useSelector((state) => state.cart.items);
  const { orders } = useSelector((state) => state.orders);

  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchAllOrders());
  }, [dispatch, isAuthenticated]);

  const cartCount = isAuthenticated
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;

  const orderCount =
    orders?.reduce((total, order) => {
      return total + (order.subOrders?.length || 0);
    }, 0) || 0;

  const handleLogout = () => {
    setShowAccountMenu(false);
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="relative">
      {/* ================= TOP STRIP ================= */}
      <div className="bg-[#3B393A] py-1 border-b border-[#5A5758]">
        <div className="container px-4 sm:px-6 flex justify-between items-center">
          <p className="text-white text-[10px] sm:text-[12px] font-medium truncate">
            Giảm giá lên đến 50% cho các sản phẩm mùa mới – chỉ trong thời gian
            có hạn!
          </p>

          <ul className="hidden sm:flex items-center gap-4">
            <li>
              <Link
                to="#"
                className="text-white text-[12px] font-medium hover:text-gray-300 transition"
              >
                Trung tâm hỗ trợ
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="text-white text-[12px] font-medium hover:text-gray-300 transition"
              >
                Theo dõi đơn hàng
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* ================= MAIN HEADER ================= */}
      <div className="py-3 bg-white border-b border-[#D0D0D0]">
        <div className="container px-4 sm:px-6 flex items-center justify-between flex-wrap gap-3">
          {/* LOGO */}
          <Link to="/" className="block w-[120px] sm:w-[150px] flex-shrink-0">
            <img
              src="/logo.jpg"
              alt="logo"
              className="max-h-10 sm:max-h-12 w-auto"
            />
          </Link>

          {/* ICONS */}
          <ul className="flex items-center gap-4 sm:gap-6 order-2 sm:order-3">
            {/* Cart */}
            <li>
              <Tooltip title="Giỏ hàng">
                <IconButton onClick={() => navigate("/cart")}>
                  <StyledBadge badgeContent={cartCount} color="secondary">
                    <MdOutlineShoppingCart className="text-black text-lg" />
                  </StyledBadge>
                </IconButton>
              </Tooltip>
            </li>

            {/* Wishlist */}
            <li>
              <Tooltip title="Yêu thích">
                <IconButton>
                  <FaRegHeart className="text-black text-lg" />
                </IconButton>
              </Tooltip>
            </li>

            {/* Notifications */}
            <li>
              <Tooltip title="Thông báo">
                <IconButton>
                  <StyledBadge badgeContent={999} color="secondary">
                    <MdNotificationsNone className="text-black text-lg" />
                  </StyledBadge>
                </IconButton>
              </Tooltip>
            </li>

            {/* ACCOUNT */}
            {isAuthenticated ? (
              <li className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center gap-2 font-medium text-[13px]"
                >
                  <FaUser className="text-lg text-black" />
                  <span>Tài khoản của bạn</span>
                </button>

                {/* ACCOUNT MENU DROPDOWN */}
                {showAccountMenu && (
                  <div className="absolute right-0 mt-2 w-[220px] bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="py-3 px-4 border-b">
                      <p className="text-sm font-medium truncate">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <ul>
                      <li>
                        <Link
                          to="/my-account"
                          onClick={() => setShowAccountMenu(false)}
                          className="block px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          Hồ sơ cá nhân
                        </Link>
                      </li>

                      <li>
                        <Link
                          to="/my-account/orders"
                          onClick={() => setShowAccountMenu(false)}
                          className="block px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          Đơn hàng của tôi ({orderCount})
                        </Link>
                      </li>

                      {/* Role-based */}
                      {roles.includes("admin") && (
                        <li>
                          <Link
                            to="/admin"
                            onClick={() => setShowAccountMenu(false)}
                            className="block px-4 py-2 hover:bg-gray-100 text-sm"
                          >
                            Trang quản trị
                          </Link>
                        </li>
                      )}

                      {roles.includes("vendor") && (
                        <li>
                          <Link
                            to="/vendor"
                            onClick={() => setShowAccountMenu(false)}
                            className="block px-4 py-2 hover:bg-gray-100 text-sm"
                          >
                            Trang người bán
                          </Link>
                        </li>
                      )}

                      {roles.includes("shipper") && (
                        <li>
                          <Link
                            to="/shipper"
                            onClick={() => setShowAccountMenu(false)}
                            className="block px-4 py-2 hover:bg-gray-100 text-sm"
                          >
                            Trang giao hàng
                          </Link>
                        </li>
                      )}

                      <li className="border-t">
                        <button
                          onClick={handleLogout}
                          className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 text-sm"
                        >
                          Đăng xuất
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="flex items-center gap-1 font-medium text-[13px] text-black hover:text-gray-700"
                >
                  <FaUser className="text-lg" />
                  Đăng nhập
                </Link>
              </li>
            )}
          </ul>

          {/* SEARCH */}
          <div className="w-full sm:flex-1 sm:mx-4 order-3 sm:order-2">
            <Search />
          </div>
        </div>
      </div>

      <Navigation />
    </header>
  );
};

export default Header;
