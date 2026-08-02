import express from "express";

import {
  inviteMember,
  getProjectMembers,
  getPendingInvites,
  acceptInvite,
  rejectInvite,
  removeMember,
} from "../controllers/collaborationController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Invite a user
router.post("/invite", authMiddleware, inviteMember);

// Get all accepted members of a project
router.get("/project/:projectId", authMiddleware, getProjectMembers);

// Get logged-in user's pending invitations
router.get("/pending", authMiddleware, getPendingInvites);

// Accept invitation
router.put("/accept/:id", authMiddleware, acceptInvite);

// Reject invitation
router.put("/reject/:id", authMiddleware, rejectInvite);

// Remove member
router.delete("/remove/:id", authMiddleware, removeMember);

export default router;