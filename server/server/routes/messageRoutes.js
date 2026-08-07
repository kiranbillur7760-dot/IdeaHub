import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getMessages,
  sendMessage,
} from "../controllers/messageController.js";

const router = express.Router();

// Get chat history
router.get("/:projectId", authMiddleware, getMessages);

// Send message
router.post("/", authMiddleware, sendMessage);

export default router;