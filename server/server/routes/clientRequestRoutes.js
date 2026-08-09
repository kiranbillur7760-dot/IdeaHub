
import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createClientRequest,
  getClientRequests,
  acceptClientRequest,
  rejectClientRequest,
} from "../controllers/clientRequestController.js";

const router = express.Router();

// ==========================================
// SEND CLIENT REQUEST
// POST /api/client-requests
// ==========================================

router.post(
  "/",
  authMiddleware,
  createClientRequest
);

// ==========================================
// GET CLIENT REQUESTS
// GET /api/client-requests
// ==========================================

router.get(
  "/",
  authMiddleware,
  getClientRequests
);

// ==========================================
// ACCEPT CLIENT REQUEST
// PATCH /api/client-requests/:id/accept
// ==========================================

router.patch(
  "/:id/accept",
  authMiddleware,
  acceptClientRequest
);

// ==========================================
// REJECT CLIENT REQUEST
// PATCH /api/client-requests/:id/reject
// ==========================================

router.patch(
  "/:id/reject",
  authMiddleware,
  rejectClientRequest
);

export default router;
