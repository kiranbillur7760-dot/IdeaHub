import express from "express";

import {
  createComment,
  getComments,
  reportComment,
} from "../controllers/commentController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================
// Public Routes
// ==========================

// Get all comments of an idea
router.get("/:ideaId", getComments);


// ==========================
// Protected Routes
// ==========================

// Add a comment
router.post(
  "/:ideaId",
  authMiddleware,
  createComment
);


// Report a comment
router.post(
  "/:id/report",
  authMiddleware,
  reportComment
);


export default router;