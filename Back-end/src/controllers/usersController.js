const {
  getAllUsers,
  assignRoleToUser,
  removeRoleFromUser,
  getUserById,
  banUser,
  unbanUser,
  updateUser,
  uploadAvatar,
  getUserProfile,
} = require("../services/usersService");

const handleGetAllUsers = async (req, res) => {
  try {
    const { users } = await getAllUsers();

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const handleAssignRoleToUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;
    const result = await assignRoleToUser(userId, roleId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error assigning role:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const handleRemoveRoleFromUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;
    const result = await removeRoleFromUser(userId, roleId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error removing role:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const handleGetUserById = async (req, res) => {
  try {
    const roles = req.user.roles;
    const loggedInUserId = req.user.user_id;
    const requestedId = req.params.userId
      ? parseInt(req.params.userId)
      : loggedInUserId;

    // CHỈ chặn customer, KHÔNG chặn admin
    if (roles.includes("customer") && !roles.includes("admin")) {
      if (requestedId !== loggedInUserId) {
        return res.status(403).json({
          success: false,
          message: "Forbidden — Customers cannot view other users",
        });
      }
    }

    const result = await getUserById(requestedId);
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const handleBanUser = async (req, res) => {
  console.log("BODY BAN:", req.body);

  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const result = await banUser(userId);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const handleUnbanUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const result = await unbanUser(userId);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const handleUpdateUser = async (req, res) => {
  const loggedInUserId = req.user.user_id;

  // ⭐ THÊM ĐOẠN NÀY
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No data to update",
    });
  }

  try {
    const result = await updateUser(loggedInUserId, req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error("handleUpdateUser error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const handleUploadAvatar = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Please select an image" });

    const userId = req.user.user_id; // ⭐ KHÔNG BAO GIỜ LẤY body.user_id
    const imageUrl = req.file.path;

    const result = await uploadAvatar(userId, imageUrl);
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================== GET PROFILE ==========================
const handleGetProfile = async (req, res) => {
  try {
    const result = await getUserProfile(req.user.user_id);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      user: result.user,
    });
  } catch (error) {
    console.error("handleGetProfile error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const handleAdminUpdateUser = async (req, res) => {
  try {
    const targetUserId = parseInt(req.params.userId);

    if (isNaN(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const result = await updateUser(targetUserId, req.body);

    return res.status(200).json(result);
  } catch (error) {
    console.error("handleAdminUpdateUser error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  handleGetAllUsers,
  handleAssignRoleToUser,
  handleRemoveRoleFromUser,
  handleGetUserById,
  handleBanUser,
  handleUnbanUser,
  handleUpdateUser,
  handleUploadAvatar,
  handleGetProfile,
  handleAdminUpdateUser,
};
