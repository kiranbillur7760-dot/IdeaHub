import http from "http";
import { Server } from "socket.io";
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
import messageRoutes from "./routes/messageRoutes.js";

import connectDB from "./config/db.js";

// ==========================
// Load Environment Variables
// ==========================

dotenv.config();

// ==========================
// Error Handlers
// ==========================

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION");
  console.error(err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION");
  console.error(err);
});

// ==========================
// Connect Database
// ==========================

connectDB();

// ==========================
// Create Express App
// ==========================

const app = express();

// Create HTTP Server
const server = http.createServer(app);

// Create Socket.IO Server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

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
app.use("/api/collaboration", collaborationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/messages", messageRoutes);

// ==========================
// Test Route
// ==========================

app.get("/", (req, res) => {
  res.send("🚀 IdeaHub Backend Running...");
});

// ==========================
// Socket.IO
// ==========================

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Join a project's chat room
  socket.on("joinProject", (projectId) => {
    socket.join(projectId);
    console.log(`✅ ${socket.id} joined project ${projectId}`);
  });

  // Leave a project's chat room
  socket.on("leaveProject", (projectId) => {
    socket.leave(projectId);
    console.log(`🚪 ${socket.id} left project ${projectId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// ==========================
// Start Server
// ==========================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});