import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateMyProfile, uploadAvatar } from "../../../../redux/adminSlice";
import { fetchMyProfile } from "../../../../redux/adminSlice";

import {
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaTransgender,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

/* -------------------- VALIDATION -------------------- */
const isValidVietnamPhone = (phone) => {
  const vnPhoneRegex = /^(0(3|5|7|8|9)\d{8}|(\+84)(3|5|7|8|9)\d{8})$/;
  return vnPhoneRegex.test(phone);
};

const validateField = (name, value) => {
  if (!value?.trim()) return "Không được để trống";

  if (["first_name", "last_name"].includes(name)) {
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) {
      return "Chỉ được chứa chữ cái";
    }
  }

  if (name === "phone" && !isValidVietnamPhone(value)) {
    return "Số điện thoại không hợp lệ (0xxx… hoặc +84xxx…)";
  }

  if (name === "date_of_birth") {
    const date = new Date(value);
    if (date > new Date()) return "Ngày sinh không hợp lệ";
  }

  return null;
};

/* -------------------- PROFILE FIELD -------------------- */
const ProfileField = ({ icon, label, value, isEditing, onChange, name }) => {
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (field, val) => {
    const err = validateField(field, val);
    setErrorMsg(err);
    onChange(field, val);
  };

  return (
    <div className="mb-5 transition-all duration-300">
      <div className="flex items-center gap-2 text-gray-600 mb-1.5">
        <div className="text-blue-500">{icon}</div>
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>

      {isEditing ? (
        <>
          {name === "date_of_birth" ? (
            <input
              type="date"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={value ? value.split("T")[0] : ""}
              onChange={(e) => handleInputChange(name, e.target.value)}
            />
          ) : name === "gender" ? (
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              value={value}
              onChange={(e) => handleInputChange(name, e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          ) : (
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              value={value || ""}
              onChange={(e) => handleInputChange(name, e.target.value)}
            />
          )}

          {errorMsg && <p className="text-red-500 text-xs mt-1">{errorMsg}</p>}
        </>
      ) : (
        <p className="text-base font-medium text-gray-800 py-2 px-3 bg-gray-50 rounded-lg truncate">
          {name === "date_of_birth"
            ? value
              ? new Date(value).toLocaleDateString("vi-VN")
              : "Not updated yet"
            : value || "Not updated yet"}
        </p>
      )}
    </div>
  );
};

/* -------------------- MAIN PROFILE -------------------- */
const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.admin.myProfile);
  useEffect(() => {
    if (!user || !user.user_id) {
      dispatch(fetchMyProfile());
    }
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  /* Load user from Redux */
  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone: user.phone || "",
        date_of_birth: user.date_of_birth || "",
        gender: user.gender || "male",
        profile_picture: user.profile_picture || "",
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // 1️⃣ Validate
      for (const [field, val] of Object.entries(profileData)) {
        if (field === "profile_picture") continue;
        const err = validateField(field, val);
        if (err) return;
      }

      // 2️⃣ Upload avatar nếu có
      let newAvatarUrl = profileData.profile_picture;

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        const res = await dispatch(uploadAvatar(formData)).unwrap();
        newAvatarUrl = res.profile_picture;
      }

      // 3️⃣ Update profile
      await dispatch(
        updateMyProfile({
          ...profileData,
          profile_picture: newAvatarUrl,
        })
      ).unwrap();

      // 4️⃣ Thoát edit – reset state
      setIsEditing(false);
      setSelectedImage(null);
    } catch (e) {
      // ❌ cố tình bỏ hết thông báo
      setIsEditing(false);
      setSelectedImage(null);
    }
  };

  if (!user || !profileData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="profile-page bg-gray-50 p-6 rounded-xl">
      <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row">
          {/* Avatar Section */}
          <div className="w-full md:w-1/3 p-6 flex flex-col items-center bg-gradient-to-b from-blue-50 to-white border-b md:border-b-0 md:border-r border-gray-200">
            <div className="relative mb-6 group">
              <div className="w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-full border-4 border-white shadow-lg">
                <img
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : user?.profile_picture
                      ? `${user.profile_picture}?v=${user.updated_at}`
                      : "https://th.bing.com/th/id/OIP.ByNwhzY5vUBvdIEfMCqDogHaHa"
                  }
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              {isEditing && (
                <>
                  <label
                    htmlFor="image-upload"
                    className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-2 text-white cursor-pointer shadow-md hover:bg-blue-600"
                  >
                    <FaEdit size={16} />
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                  />
                </>
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {profileData.first_name} {profileData.last_name}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {user.username || user.email || "User"}
            </p>

            {isEditing ? (
              <div className="flex gap-3 w-full mt-4">
                <button
                  onClick={handleSave}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <FaSave /> Save
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="w-full bg-gray-200 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-50 text-blue-600 border border-blue-200 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <FaEdit /> Edit
              </button>
            )}
          </div>

          {/* Fields Section */}
          <div className="w-full md:w-2/3 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField
              icon={<FaUser />}
              label="First Name"
              value={profileData.first_name}
              isEditing={isEditing}
              onChange={handleChange}
              name="first_name"
            />

            <ProfileField
              icon={<FaUser />}
              label="Last Name"
              value={profileData.last_name}
              isEditing={isEditing}
              onChange={handleChange}
              name="last_name"
            />

            <ProfileField
              icon={<FaPhone />}
              label="Phone"
              value={profileData.phone}
              isEditing={isEditing}
              onChange={handleChange}
              name="phone"
            />

            <ProfileField
              icon={<FaCalendarAlt />}
              label="Date of Birth"
              value={profileData.date_of_birth}
              isEditing={isEditing}
              onChange={handleChange}
              name="date_of_birth"
            />

            <ProfileField
              icon={<FaTransgender />}
              label="Gender"
              value={profileData.gender}
              isEditing={isEditing}
              onChange={handleChange}
              name="gender"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
