import express from "express";

import {
  createIdea,
  getIdeas,
} from "../controllers/ideaController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected Route
router.post("/", authMiddleware, createIdea);

// Public Route
router.get("/", getIdeas);

export default router;