const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");
const uploadLimiter = require("../middleware/uploadLimiter");

const {
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
} = require("../controllers/usersController");

const router = express.Router();

// ----------- STATIC ROUTES FIRST -------------
router.put(
  "/admin/users/ban",
  authMiddleware,
  roleMiddleware(["admin"]),
  handleBanUser
);

router.put(
  "/admin/users/unban",
  authMiddleware,
  roleMiddleware(["admin"]),
  handleUnbanUser
);

// ---------------------------------------------

router.get(
  "/admin/users",
  authMiddleware,
  roleMiddleware(["admin"]),
  handleGetAllUsers
);

router.get(
  "/admin/users/:userId",
  authMiddleware,
  roleMiddleware(["admin"]),
  handleGetUserById
);

router.put(
  "/admin/users/:userId",
  authMiddleware,
  roleMiddleware(["admin"]),
  handleAdminUpdateUser
);

router.get("/users/me", authMiddleware, handleGetProfile);

router.put("/users/me", authMiddleware, handleUpdateUser);

router.post(
  "/users/me/upload-avatar",
  authMiddleware,
  uploadLimiter,
  upload.single("image"),
  handleUploadAvatar
);

module.exports = router;
