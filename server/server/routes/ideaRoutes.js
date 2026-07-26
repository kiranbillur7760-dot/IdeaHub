import express from "express";
import upload from "../middleware/upload.js";

import {
  createIdea,
  getIdeas,
  getTrendingIdeas,
  searchIdeas,
  getMyIdeas,
  updateIdea,
  deleteIdea,
  likeIdea,
  reportIdea,
} from "../controllers/ideaController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================
// Public Routes
// ==========================

router.get("/", getIdeas);
router.get("/trending", getTrendingIdeas);
router.get("/search", searchIdeas);

// ==========================
// Protected Routes
// ==========================

// Create Idea with Image Upload
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createIdea
);
router.post(
  "/:id/report",
  authMiddleware,
  reportIdea
);
// Get My Ideas
router.get("/myideas", authMiddleware, getMyIdeas);

// Update Idea
router.put("/:id", authMiddleware, updateIdea);

// Like / Unlike Idea
router.put("/:id/like", authMiddleware, likeIdea);

// Delete Idea
router.delete("/:id", authMiddleware, deleteIdea);

export default router;