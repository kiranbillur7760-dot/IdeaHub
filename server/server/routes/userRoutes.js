import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  getProfile,
  updateProfile,
  getAllUsers,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "../controllers/userController.js";

const router = express.Router();

// ==========================
// Get Logged-in User Profile
// ==========================
router.get(
  "/profile",
  authMiddleware,
  getProfile
);

// ==========================
// Follow a User
// ==========================
router.put(
  "/:id/follow",
  authMiddleware,
  followUser
);

// ==========================
// Unfollow a User
// ==========================
router.put(
  "/:id/unfollow",
  authMiddleware,
  unfollowUser
);

// ==========================
// Get Followers
// ==========================
router.get(
  "/:id/followers",
  getFollowers
);

// ==========================
// Get Following
// ==========================
router.get(
  "/:id/following",
  getFollowing
);

// ==========================
// Update Profile
// Supports:
// - name
// - bio
// - profile picture
// ==========================
router.put(
  "/profile",
  authMiddleware,
  upload.single("profileImage"),
  updateProfile
);

// ==========================
// Get All Users
// ==========================
router.get(
  "/",
  authMiddleware,
  getAllUsers
);

export default router;