import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getProfile,
  updateProfile,
  getAllUsers,
} from "../controllers/userController.js";

const router = express.Router();

// Get logged-in user's profile
router.get(
  "/profile",
  authMiddleware,
  getProfile
);

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