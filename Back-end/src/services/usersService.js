const { User, Role, UserRole } = require("../models");

const getAllUsers = async () => {
  try {
    const users = await User.findAll({
      attributes: [
        "user_id",
        "profile_picture",
        "username",
        "email",
        "status",
        "is_verified",
      ],
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["role_name"],
          through: { attributes: [] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const usersWithRoles = users.map((user) => ({
      ...user.get({ plain: true }),
      roles: user.roles.map((role) => role.role_name),
    }));

    return { success: true, users: usersWithRoles };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Internal Server Error");
  }
};

const assignRoleToUser = async (userId, roleId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    const role = await Role.findByPk(roleId);

    if (!user || !role)
      return { success: false, message: "User or Role not found" };

    await user.addRole(role);
    return {
      success: true,
      message: "Role assigned successfully",
      userId: userId,
      role: role.role_name,
    };
  } catch (error) {
    console.error("Error assigning role:", error);
    throw new Error("Internal Server Error");
  }
};

const removeRoleFromUser = async (userId, roleId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    const role = await Role.findByPk(roleId);

    if (!user || !role)
      return { success: false, message: "User or Role not found" };

    await user.removeRole(role);
    return {
      success: true,
      message: "Role removed successfully",
      user: userId,
      role: role.role_name,
    };
  } catch (error) {
    console.error("Error removing role:", error);
    throw new Error("Internal Server Error");
  }
};

const getUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return { success: false, message: "User not found", user: null };
    }

    return { success: true, message: "Get user successfully", user };
  } catch (error) {
    console.error("Error in getUserById:", error);
    return { success: false, message: "Internal Server Error", user: null };
  }
};

const banUser = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.status === "banned") {
    return { success: false, message: "User is already banned" };
  }

  user.status = "banned";
  await user.save();

  return {
    success: true,
    message: "Banned user successfully!",
    user: { id: user.user_id, status: user.status },
  };
};

const unbanUser = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });

  if (!user) throw new Error("User not found");

  if (user.status !== "banned") {
    return { success: false, message: "User is not banned" };
  }

  user.status = "active";
  await user.save();

  return {
    success: true,
    message: "User has been unbanned successfully!",
    user: { id: user.user_id, status: user.status },
  };
};

const updateUser = async (userId, updatedData) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return { success: false, message: "User not found", user: null };
    }

    if (updatedData.first_name !== undefined)
      user.first_name = updatedData.first_name;
    if (updatedData.last_name !== undefined)
      user.last_name = updatedData.last_name;
    if (updatedData.phone !== undefined) user.phone = updatedData.phone;
    if (updatedData.gender !== undefined) user.gender = updatedData.gender;
    if (updatedData.date_of_birth !== undefined)
      user.date_of_birth = updatedData.date_of_birth;

    if (updatedData.profile_picture !== undefined) {
      user.profile_picture = updatedData.profile_picture;
    }

    await user.save();

    return {
      success: true,
      message: "User updated successfully",
      data: user,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: "Internal Server Error", user: null };
  }
};

const uploadAvatar = async (user_id, imageUrl) => {
  try {
    const user = await User.findByPk(user_id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) throw new Error("User not found");

    user.profile_picture = imageUrl;
    await user.save();

    return {
      success: true,
      message: "User updated avatar successfully",
      data: user,
    };
  } catch (error) {
    console.error("Error updating avatar:", error);
    throw new Error("Error updating avatar");
  }
};

const getUserProfile = async (userId) => {
  try {
    const user = await User.findOne({
      where: { user_id: userId },
      attributes: [
        "user_id",
        "username",
        "email",
        "first_name",
        "last_name",
        "phone",
        "gender",
        "date_of_birth",
        "profile_picture",
        "status",
        "is_verified",
        "created_at",
        "updated_at",
      ],
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["role_name"],
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      return { success: false, user: null };
    }

    // Convert to plain object
    const userData = user.get({ plain: true });

    return {
      success: true,
      user: {
        ...userData,
        roles: userData.roles.map((r) => r.role_name),
      },
    };
  } catch (error) {
    console.error("getUserProfile error:", error);
    return { success: false, user: null };
  }
};

module.exports = {
  getAllUsers,
  assignRoleToUser,
  removeRoleFromUser,
  getUserById,
  banUser,
  unbanUser,
  updateUser,
  uploadAvatar,
  getUserProfile,
};
