import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { resetShipperState } from "../../redux/shipperSlice";
import { toast } from "react-toastify";

const UserMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarError, setAvatarError] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("profileData");
      if (savedProfile) {
        const parsedData = JSON.parse(savedProfile);
        if (parsedData && parsedData.avatar) {
          setAvatar(parsedData.avatar);
        }
      }
    } catch (error) {
      console.error("Error parsing profile data from localStorage:", error);
      // Clear invalid data
      localStorage.removeItem("profileData");
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      dispatch(resetShipperState());
      toast.success("Đăng xuất thành công");
      setShowUserMenu(false);
      navigate("/");
    } catch (error) {
      // Even if logout fails, clear local state and redirect
      dispatch(resetShipperState());
      setShowUserMenu(false);
      navigate("/");
    }
  };

  return (
    <div className="relative" ref={userMenuRef}>
      <button 
        onClick={() => setShowUserMenu((prev) => !prev)} 
        className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
        aria-label="User menu"
      >
        {avatar && !avatarError ? (
          <img 
            src={avatar} 
            alt="Avatar" 
            className="w-10 h-10 rounded-full object-cover border border-white"
            onError={() => setAvatarError(true)}
          />
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
            ?
          </div>
        )}
      </button>

      {showUserMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg p-2 z-50">
          <button
            onClick={() => {
              navigate("/shipper/profile");
              setShowUserMenu(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Xem hồ sơ
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
