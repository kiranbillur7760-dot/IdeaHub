import User from "../models/user.js";

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

    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
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
      .select("name email")
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