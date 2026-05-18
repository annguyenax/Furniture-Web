import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, banUser, unbanUser } from "../../redux/adminSlice";

import Table from "../../components/common/Table";
import {
  FaSearch,
  FaUserSlash,
  FaUserCheck,
  FaEye,
  FaUsers,
  FaCheckCircle,
  FaUserClock,
} from "react-icons/fa";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ManageUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users = [], loading } = useSelector((state) => state.admin);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Filter
  const filteredUsers =
    users?.filter((user) => {
      const searchTerm = search.toLowerCase();
      return (
        user.username?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm) ||
        user.user_id?.toString().includes(searchTerm)
      );
    }) ?? [];

  /* ---------------- BAN USER ---------------- */
  const handleBan = (user_id) => {
    Swal.fire({
      title: "Confirm Action",
      text: "Are you sure you want to ban this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, ban the user!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await dispatch(banUser(user_id));

        if (banUser.fulfilled.match(res)) {
          Swal.fire("Success!", "User has been banned.", "success");
          dispatch(fetchAllUsers()); // refresh list
        } else {
          Swal.fire("Error", res.payload || "Ban failed.", "error");
        }
      }
    });
  };

  /* ---------------- UNBAN USER ---------------- */
  const handleUnban = (user_id) => {
    Swal.fire({
      title: "Unban User",
      text: "Are you sure you want to unban this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, unban!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await dispatch(unbanUser(user_id));

        if (unbanUser.fulfilled.match(res)) {
          Swal.fire("Success!", "User has been unbanned.", "success");
          dispatch(fetchAllUsers());
        } else {
          Swal.fire("Error", res.payload || "Unban failed.", "error");
        }
      }
    });
  };

  /* ---------------- TABLE COLUMNS ---------------- */
  const columns = [
    { header: "ID", field: "user_id" },

    {
      header: "Avatar",
      field: "profile_picture",
      render: (img) => (
        <img
          src={
            img ||
            "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
          }
          className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
        />
      ),
    },

    { header: "User name", field: "username" },
    { header: "Email", field: "email" },

    {
      header: "Role",
      field: "roles",
      render: (roles) => (
        <div className="flex flex-wrap gap-1">
          {roles.map((r) => (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              {r}
            </span>
          ))}
        </div>
      ),
    },

    {
      header: "Status",
      field: "status",
      render: (s) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            s === "active"
              ? "bg-green-100 text-green-700"
              : s === "banned"
              ? "bg-red-200 text-red-600"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {s}
        </span>
      ),
    },

    {
      header: "Actions",
      render: (_, user) => (
        <div className="flex space-x-2 justify-center">
          <button
            className="bg-blue-500 text-white p-2 rounded-lg"
            onClick={() => navigate(`/admin/view-user/${user.user_id}`)}
          >
            <FaEye />
          </button>

          {user.status === "banned" ? (
            <button
              className="bg-yellow-500 text-white p-2 rounded-lg"
              onClick={() => handleUnban(user.user_id)}
            >
              <FaCheckCircle />
            </button>
          ) : (
            <button
              className="bg-red-500 text-white p-2 rounded-lg"
              onClick={() => handleBan(user.user_id)}
            >
              <FaUserSlash />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
          <h2 className="text-2xl font-bold text-white">Users Management</h2>
          <p className="text-blue-100">Manage all system users</p>
        </div>

        <div className="p-6">
          {/* Search */}
          <div className="flex items-center bg-gray-100 p-4 rounded-xl mb-6 shadow-sm">
            <FaSearch className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl">
              <FaUsers className="text-blue-500 text-xl mb-1" />
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-blue-500">Total Users</p>
            </div>

            <div className="bg-green-50 p-4 rounded-xl">
              <FaUserCheck className="text-green-500 text-xl mb-1" />
              <p className="text-2xl font-bold">
                {users.filter((u) => u.is_verified).length}
              </p>
              <p className="text-green-600">Verified</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-xl">
              <FaUserClock className="text-purple-500 text-xl mb-1" />
              <p className="text-2xl font-bold">
                {users.filter((u) => u.status === "active").length}
              </p>
              <p className="text-purple-600">Active</p>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center p-10">
              <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 rounded-full" />
            </div>
          ) : (
            <Table columns={columns} data={filteredUsers} pageSize={10} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
