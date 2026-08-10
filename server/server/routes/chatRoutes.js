import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  getChats,
  getChat,
  createChat,
  deleteChat,
  updateChat,
} from "../controllers/chatController.js";

const router = express.Router();

// Get all chats
router.get("/", authMiddleware, getChats);

// Get one chat
router.get("/:id", authMiddleware, getChat);
router.put("/:id", authMiddleware, updateChat);

// Create chat
router.post("/", authMiddleware, createChat);

// Delete chat
router.delete("/:id", authMiddleware, deleteChat);

export default router;