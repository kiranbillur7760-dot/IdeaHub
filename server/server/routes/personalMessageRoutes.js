import express from "express";

import {
  sendPersonalMessage,
  getPersonalMessages,
  markPersonalMessagesAsRead,
} from "../controllers/personalMessageController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Send a personal message
router.post(
  "/:receiver",
  authMiddleware,
  sendPersonalMessage
);

// Get conversation with another user
router.get(
  "/:userId",
  authMiddleware,
  getPersonalMessages
);

// Mark messages as read
router.put(
  "/:userId/read",
  authMiddleware,
  markPersonalMessagesAsRead
);

export default router;