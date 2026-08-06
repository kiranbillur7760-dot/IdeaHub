import express from "express";

import {
  createIdea,
  getIdeas,
  getIdeaById,
  getTrendingIdeas,
  searchIdeas,
  getMyIdeas,
  updateIdea,
  deleteIdea,
  likeIdea,
  reportIdea,
  joinIdea,
  addComment,
  getComments,
  deleteComment,
} from "../controllers/ideaController.js";

import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();



// ==========================
// Public Routes
// ==========================


// Get all ideas
router.get(
  "/",
  getIdeas
);


// Trending ideas
router.get(
  "/trending",
  getTrendingIdeas
);


// Search ideas
router.get(
  "/search",
  searchIdeas
);

// Get Single Idea
router.get(
  "/:id",
  getIdeaById
);




// ==========================
// Protected Routes
// ==========================
// Get comments for an idea
router.get("/:id/comments", getComments);

// Add a comment
router.post("/:id/comments", authMiddleware, addComment);

// Delete a comment
router.delete(
  "/:id/comments/:commentId",
  authMiddleware,
  deleteComment
);

// Create Idea
router.post(
  "/",
  authMiddleware,
  createIdea
);



// Join Idea / Work on Idea
router.post(
  "/:id/join",
  authMiddleware,
  joinIdea
);



// Report Idea
router.post(
  "/:id/report",
  authMiddleware,
  reportIdea
);



// My Ideas
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