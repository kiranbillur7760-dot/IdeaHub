import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  registerUser,
  loginUser,
  saveIdea,
  getSavedIdeas,
} from "../controllers/authController.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Save / Unsave Idea
router.put(
  "/save/:id",
  authMiddleware,
  saveIdea
);

// Get Saved Ideas
router.get(
  "/saved",
  authMiddleware,
  getSavedIdeas
);

export default router;