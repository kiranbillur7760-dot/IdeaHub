
import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getProjectActivities,
} from "../controllers/activityController.js";

const router = express.Router();


// GET PROJECT ACTIVITIES

router.get(
  "/:projectId",
  authMiddleware,
  getProjectActivities
);


export default router;

