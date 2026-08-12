import User from "../models/user.js";
import cloudinary from "../config/cloudinary.js";

// ==========================
// Get Logged-in User
// ==========================
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "User authentication information is missing.",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Update Profile
// ==========================
export const updateProfile = async (req, res) => {
  try {
    // Get logged-in user's ID safely
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "User authentication information is missing.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // ==========================
    // Update Name
    // ==========================
    if (req.body.name !== undefined) {
      user.name = req.body.name;
    }

    // ==========================
    // Update Bio
    // ==========================
    if (req.body.bio !== undefined) {
      user.bio = req.body.bio;
    }

    // ==========================
    // Upload Profile Picture
    // ==========================
    if (req.file) {
      const uploadResult = await new Promise(
        (resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder: "ideahub/profile-images",
                resource_type: "image",
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );

          uploadStream.end(req.file.buffer);
        }
      );

      if (!uploadResult?.secure_url) {
        return res.status(500).json({
          message: "Profile image upload failed.",
        });
      }

      user.profileImage =
        uploadResult.secure_url;
    }

    // ==========================
    // Save User
    // ==========================
    await user.save();

    // ==========================
    // Get Updated User
    // Don't return password
    // ==========================
    const updatedUser = await User.findById(
      user._id
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "Updated user could not be found.",
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "UPDATE PROFILE ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Get All Users
// ==========================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email profileImage")
      .sort({ name: 1 });

    res.status(200).json({
      users,
    });
  } catch (error) {
    console.error(
      "Get all users error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================
// Follow User
// ==========================
export const followUser = async (req, res) => {
  try {
    const currentUserId =
      req.user?._id || req.user?.id;

    const targetUserId = req.params.id;

    if (!currentUserId) {
      return res.status(401).json({
        message: "User authentication information is missing.",
      });
    }

    if (
      currentUserId.toString() ===
      targetUserId.toString()
    ) {
      return res.status(400).json({
        message: "You cannot follow yourself.",
      });
    }

    const currentUser =
      await User.findById(currentUserId);

    const targetUser =
      await User.findById(targetUserId);

    if (!currentUser) {
      return res.status(404).json({
        message: "Current user not found.",
      });
    }

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (
      currentUser.following.some(
        (id) =>
          id.toString() ===
          targetUserId.toString()
      )
    ) {
      return res.status(400).json({
        message: "Already following this user.",
      });
    }

    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    res.json({
      message: "User followed successfully.",
    });
  } catch (error) {
    console.error("Follow user error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Unfollow User
// ==========================
export const unfollowUser = async (req, res) => {
  try {
    const currentUserId =
      req.user?._id || req.user?.id;

    const targetUserId = req.params.id;

    if (!currentUserId) {
      return res.status(401).json({
        message: "User authentication information is missing.",
      });
    }

    const currentUser =
      await User.findById(currentUserId);

    const targetUser =
      await User.findById(targetUserId);

    if (!currentUser) {
      return res.status(404).json({
        message: "Current user not found.",
      });
    }

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    currentUser.following =
      currentUser.following.filter(
        (id) =>
          id.toString() !==
          targetUserId.toString()
      );

    targetUser.followers =
      targetUser.followers.filter(
        (id) =>
          id.toString() !==
          currentUserId.toString()
      );

    await currentUser.save();
    await targetUser.save();

    res.json({
      message: "User unfollowed successfully.",
    });
  } catch (error) {
    console.error(
      "Unfollow user error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Get Followers
// ==========================
export const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    ).populate(
      "followers",
      "name email profileImage"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json(user.followers);
  } catch (error) {
    console.error(
      "Get followers error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Get Following
// ==========================
export const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    ).populate(
      "following",
      "name email profileImage"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json(user.following);
  } catch (error) {
    console.error(
      "Get following error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};