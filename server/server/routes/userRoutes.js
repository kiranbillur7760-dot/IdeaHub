import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

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

// Get logged-in user's profile
router.get(
  "/profile",
  authMiddleware,
  getProfile
);


// Follow a user
router.put("/:id/follow", authMiddleware, followUser);

// Unfollow a user
router.put("/:id/unfollow", authMiddleware, unfollowUser);

// Get followers
router.get("/:id/followers", getFollowers);

// Get following
router.get("/:id/following", getFollowing);
// Update logged-in user's profile
router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

// Get all users
router.get(
  "/",
  authMiddleware,
  getAllUsers
);

export default router;