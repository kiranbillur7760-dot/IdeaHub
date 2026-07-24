import express from "express";

import {
  createIdea,
  getIdeas,
  getMyIdeas,
  deleteIdea,
} from "../controllers/ideaController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createIdea);

router.get("/", getIdeas);

router.get("/myideas", authMiddleware, getMyIdeas);

router.delete("/:id", authMiddleware, deleteIdea);

export default router;