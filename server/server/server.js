import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import commentRoutes from "./routes/commentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import ideaRoutes from "./routes/ideaRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import collaborationRoutes from "./routes/collaborationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";


import connectDB from "./config/db.js";

// Load environment variables
dotenv.config();

// Error handlers
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION");
  console.error(err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION");
  console.error(err);
});

// Connect MongoDB
connectDB();

const app = express();

// ==========================
// Middlewares
// ==========================

app.use(cors());
app.use(express.json());

// ==========================
// Routes
// ==========================

app.use("/api/auth", authRoutes);

app.use("/api/ideas", ideaRoutes);

app.use("/api/comments", commentRoutes);

app.use("/api/users", userRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/activities", activityRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/upload", uploadRoutes);
// ==========================
// Test Route
// ==========================

app.get("/", (req, res) => {
  res.send("🚀 IdeaHub Backend Running...");
});

// ==========================
// Start Server
// ==========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});