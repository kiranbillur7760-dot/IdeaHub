
import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createProject,
  getProject,
  getPublicProject,
  addProjectMember,
  removeProjectMember,
} from "../controllers/projectController.js";

const router = express.Router();


// ==========================================
// CREATE PROJECT
// ==========================================

router.post(
  "/",
  authMiddleware,
  createProject
);
// ==========================================
// GET PUBLIC PROJECT FOR CLIENTS
// ==========================================

router.get(
  "/discover/:id",
  getPublicProject
);


// ==========================================
// GET PROJECT
// ==========================================

router.get(
  "/:id",
  authMiddleware,
  getProject
);


// ==========================================
// ADD MEMBER
// ==========================================

router.post(
  "/:projectId/members",
  authMiddleware,
  addProjectMember
);


// ==========================================
// REMOVE MEMBER
// ==========================================

router.delete(
  "/:projectId/members/:userId",
  authMiddleware,
  removeProjectMember
);


export default router;
