import express from "express";

import {
  createPost,
  getPosts,
  toggleLike,
  addComment,
} from "../controllers/postController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all social posts
router.get("/", authMiddleware, getPosts);

// Create a post
router.post("/", authMiddleware, createPost);

// Like / Unlike a post
router.post("/:id/like", authMiddleware, toggleLike);

// Add a comment
router.post("/:id/comment", authMiddleware, addComment);

export default router;