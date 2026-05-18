import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, roles, isLoading } = useSelector((state) => state.auth);

  // 🕐 Chờ redux load xong (tránh redirect sai khi F5)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // ❌ Nếu chưa đăng nhập → chuyển login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ⚙️ Nếu chưa có role
  if (!roles || roles.length === 0) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Có quyền truy cập
  const hasPermission = roles.some((role) => allowedRoles.includes(role));

  return hasPermission ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
