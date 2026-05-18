import React, { useState, useRef, useEffect } from "react";
import { Menu, Bell, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { getShipperProfile, resetShipperState } from "../../redux/shipperSlice";
import { toast } from "react-toastify";

const NotificationDropdown = ({ notifications, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
      <div className="px-4 py-2 border-b">
        <h3 className="font-semibold">Thông báo</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="px-4 py-3 hover:bg-gray-50 border-b last:border-0 cursor-pointer"
              onClick={onClose}
            >
              <p className="text-sm text-gray-800">{notification.message}</p>
              <span className="text-xs text-gray-500">{notification.time}</span>
            </div>
          ))
        ) : (
          <div className="px-4 py-3 text-center text-gray-500">
            Không có thông báo mới
          </div>
        )}
      </div>
    </div>
  );
};

const UserDropdown = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shipper } = useSelector((state) => state.shipper);

  if (!isOpen || !shipper?.user) return null;

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      dispatch(resetShipperState());
      toast.success("Đăng xuất thành công");
      navigate("/");
    } catch (error) {
      // Even if logout fails, clear local state
      dispatch(resetShipperState());
      navigate("/");
    }
  };

  const userFullName = `${shipper.user.first_name} ${shipper.user.last_name}`;

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
      <div className="px-4 py-2 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img 
              src={shipper.user.profile_picture || '/default-avatar.png'} 
              alt={userFullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-semibold">{userFullName}</p>
            <p className="text-xs text-gray-500">ID: {shipper.user.user_id}</p>
          </div>
        </div>
      </div>
      <Link
        to="/shipper/profile"
        className="px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-gray-700"
      >
        <User size={16} />
        <span>Thông tin cá nhân</span>
      </Link>
      <button
        onClick={handleLogout}
        className="w-full px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-red-600"
      >
        <LogOut size={16} />
        <span>Đăng xuất</span>
      </button>
    </div>
  );
};

const ShipperHeader = ({ onMenuClick, currentPath }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const dispatch = useDispatch();
  const { shipper, loading } = useSelector((state) => state.shipper);

  // Fetch profile only once if missing
  useEffect(() => {
    if (!shipper?.user) {
      dispatch(getShipperProfile()).catch((error) => {
        console.error("Failed to fetch shipper profile:", error);
      });
    }
  }, [dispatch, shipper?.user]);

  // Mock notifications data (TODO: Replace with real API call)
  const notifications = [
    {
      id: 1,
      message: "Bạn có đơn hàng mới #123456",
      time: "5 phút trước"
    },
    {
      id: 2,
      message: "Đơn hàng #123455 đã được giao thành công",
      time: "10 phút trước"
    },
    {
      id: 3,
      message: "Khách hàng đã đánh giá 5 sao cho đơn hàng #123454",
      time: "30 phút trước"
    }
  ];

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageTitle = () => {
    // Use includes for sub-routes, exact match for main routes
    if (currentPath?.includes("/dashboard")) return "Dashboard";
    if (currentPath?.includes("/orders")) return "Đơn hàng";
    if (currentPath?.includes("/profile")) return "Thông tin cá nhân";
    if (currentPath?.includes("/income")) return "Thu nhập";
    return "ShipPro";
  };

  const userFullName = shipper?.user ? `${shipper.user.first_name} ${shipper.user.last_name}` : '';

  return (
    <header className="bg-red-500 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 md:hidden"
          >
            <Menu size={24} />
          </button>
          <h1 className="ml-2 text-xl font-semibold text-white">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 rounded-full text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 relative"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full" />
              )}
            </button>
            <NotificationDropdown
              notifications={notifications}
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
            />
          </div>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-full text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden">
                {shipper?.user && (
                  <img 
                    src={shipper.user.profile_picture || '/default-avatar.png'} 
                    alt={userFullName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </button>
            <UserDropdown
              isOpen={isUserMenuOpen}
              onClose={() => setIsUserMenuOpen(false)}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ShipperHeader;