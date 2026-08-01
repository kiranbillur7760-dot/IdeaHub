
import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();


// ==========================================
// CREATE TASK
// ==========================================

router.post(
  "/",
  authMiddleware,
  createTask
);


// ==========================================
// GET PROJECT TASKS
// ==========================================

router.get(
  "/:projectId",
  authMiddleware,
  getProjectTasks
);


// ==========================================
// UPDATE TASK
// ==========================================

router.put(
  "/:id",
  authMiddleware,
  updateTask
);


// ==========================================
// DELETE TASK
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  deleteTask
);


export default router;

