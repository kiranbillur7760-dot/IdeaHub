import express from "express";

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

// Get all ideas
router.get("/", getIdeas);

// Get trending ideas
router.get("/trending", getTrendingIdeas);

// Search ideas
router.get("/search", searchIdeas);

// ==========================
// Protected Routes
// ==========================

// Create Idea
router.post(
  "/",
  authMiddleware,
  createIdea
);

// Report Idea
router.post(
  "/:id/report",
  authMiddleware,
  reportIdea
);

// Get Logged-in User Ideas
router.get(
  "/myideas",
  authMiddleware,
  getMyIdeas
);

// Update Idea
router.put(
  "/:id",
  authMiddleware,
  updateIdea
);

// Like / Unlike Idea
router.put(
  "/:id/like",
  authMiddleware,
  likeIdea
);

// Delete Idea
router.delete(
  "/:id",
  authMiddleware,
  deleteIdea
);

export default router;