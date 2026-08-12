import User from "../models/user.js";
import cloudinary from "../config/cloudinary.js";

// ==========================
// Get Logged-in User
// ==========================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.json(user);
  } catch (error) {
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
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ==========================
    // Update Name
    // ==========================
    if (req.body.name) {
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
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
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
      });

      user.profileImage = uploadResult.secure_url;
    }

    // ==========================
    // Save User
    // ==========================
    await user.save();

    // Don't send password back
    const updatedUser = await User.findById(user._id).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

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
    console.error("Get all users error:", error);

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
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({
        message: "You cannot follow yourself.",
      });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (currentUser.following.includes(targetUserId)) {
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
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId
    );

    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId
    );

    await currentUser.save();
    await targetUser.save();

    res.json({
      message: "User unfollowed successfully.",
    });
  } catch (error) {
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
    const user = await User.findById(req.params.id).populate(
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
    const user = await User.findById(req.params.id).populate(
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
    res.status(500).json({
      message: error.message,
    });
  }
};