import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createClientRequest,
} from "../controllers/clientRequestController.js";

const router = express.Router();

// ==========================================
// SEND CLIENT REQUEST
// ==========================================

router.post(
  "/",
  authMiddleware,
  createClientRequest
);

export default router;