import { useState } from "react";
import {
  Bell,
  Search,
  Sun,
  Moon,
  LogOut,
  User,
  Menu,
  Home,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({ onMenuClick }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="p-4 bg-gray-900 text-white shadow-md flex items-center gap-4">
      {/* Sidebar Button */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-xl hover:bg-gray-800 transition-all"
      >
        <Menu size={26} />
      </button>

      {/* Home Button */}
      <button
        className="p-2 rounded-xl hover:bg-gray-800 transition-all"
        onClick={() => navigate("/admin")}
      >
        <Home size={24} />
      </button>

      {/* Search bar */}
      <div className="relative hidden md:block w-80">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="pl-10 pr-4 py-2 w-full rounded-xl bg-gray-800 text-white border border-gray-600 
          focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>

      {/* Right Side */}
      <div className="ml-auto flex items-center gap-6">
        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl hover:bg-gray-800 transition-all"
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        {/* Notification */}
        <button className="relative p-2 rounded-xl hover:bg-gray-800 transition-all">
          <Bell size={24} />
          <span className="absolute top-1 right-1 bg-red-500 w-3 h-3 rounded-full animate-pulse"></span>
        </button>

        {/* Settings */}
        <button className="p-2 rounded-xl hover:bg-gray-800 transition-all">
          <Settings size={24} />
        </button>

        {/* ICON USER (thay avatar) */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-800 transition-all"
          >
            <User size={30} className="text-blue-400" />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div
              className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg w-44 z-10 
            transition-all transform origin-top-right scale-95"
            >
              <button className="flex items-center p-3 hover:bg-gray-100 w-full transition">
                <User className="mr-2" size={18} /> Trang cá nhân
              </button>
              <button className="flex items-center p-3 hover:bg-gray-100 w-full transition">
                <LogOut className="mr-2" size={18} /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
