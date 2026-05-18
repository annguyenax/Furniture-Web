import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile } from "../../../../redux/adminSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.admin.myProfile);
  const isLoading = useSelector((state) => state.admin.loading);

  useEffect(() => {
    if (!user || !user.user_id) {
      dispatch(fetchMyProfile());
    }
  }, [dispatch]);

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      <div className="welcome mb-8">
        <p className="text-lg">
          Xin chào,{" "}
          <span className="font-semibold">
            {user?.first_name} {user?.last_name}
          </span>
          !
        </p>
        <p className="mt-2 text-gray-600">
          Từ dashboard bạn có thể xem đơn hàng, cập nhật thông tin cá nhân.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
