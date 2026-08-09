
import http from "http";
import { Server } from "socket.io";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import personalMessageRoutes from "./routes/personalMessageRoutes.js";
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

import PersonalMessage from "./models/PersonalMessage.js";

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

// ==========================
// Create HTTP Server
// ==========================

const server = http.createServer(app);

// ==========================
// Create Socket.IO Server
// ==========================

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

app.use(
  "/api/personal-messages",
  personalMessageRoutes
);

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

  // ========================================
  // PROJECT CHAT
  // ========================================

  // Join a project's chat room
  socket.on("joinProject", (projectId) => {
    if (!projectId) {
      return;
    }

    socket.join(projectId);

    console.log(
      `✅ ${socket.id} joined project ${projectId}`
    );
  });

  // Leave a project's chat room
  socket.on("leaveProject", (projectId) => {
    if (!projectId) {
      return;
    }

    socket.leave(projectId);

    console.log(
      `🚪 ${socket.id} left project ${projectId}`
    );
  });

  // ========================================
  // PERSONAL CHAT
  // ========================================

  // Join a private conversation
  socket.on(
    "joinPersonalChat",
    ({ userId, otherUserId }) => {
      try {
        if (!userId || !otherUserId) {
          console.log(
            "⚠️ Missing user IDs for personal chat"
          );

          return;
        }

        const roomId = [
          userId,
          otherUserId,
        ]
          .sort()
          .join("_");

        const personalRoom =
          `personal_${roomId}`;

        socket.join(personalRoom);

        console.log(
          `💬 ${socket.id} joined personal chat ${personalRoom}`
        );
      } catch (error) {
        console.error(
          "JOIN PERSONAL CHAT ERROR:",
          error
        );
      }
    }
  );

  // ========================================
  // SEND PERSONAL MESSAGE
  // Supports:
  // - Text
  // - Image
  // - Video
  // ========================================

  socket.on(
    "sendPersonalMessage",
    async ({
      senderId,
      receiverId,
      text,
      mediaUrl,
      mediaType,
    }) => {
      try {
        // ------------------------------------
        // Validate users
        // ------------------------------------

        if (!senderId || !receiverId) {
          console.log(
            "⚠️ Missing sender or receiver"
          );

          return;
        }

        // ------------------------------------
        // Prevent self messaging
        // ------------------------------------

        if (
          senderId.toString() ===
          receiverId.toString()
        ) {
          console.log(
            "⚠️ User cannot message themselves"
          );

          return;
        }

        // ------------------------------------
        // Check text
        // ------------------------------------

        const hasText =
          typeof text === "string" &&
          text.trim().length > 0;

        // ------------------------------------
        // Check media
        // ------------------------------------

        const hasMedia =
          typeof mediaUrl === "string" &&
          mediaUrl.trim().length > 0 &&
          ["image", "video"].includes(
            mediaType
          );

        // ------------------------------------
        // Message must contain text OR media
        // ------------------------------------

        if (!hasText && !hasMedia) {
          console.log(
            "⚠️ Message has no text or media"
          );

          return;
        }

        // ------------------------------------
        // Create message
        // ------------------------------------

        const newMessage =
          await PersonalMessage.create({
            sender: senderId,
            receiver: receiverId,

            text: hasText
              ? text.trim()
              : "",

            mediaUrl: hasMedia
              ? mediaUrl.trim()
              : "",

            mediaType: hasMedia
              ? mediaType
              : "",
          });

        // ------------------------------------
        // Populate sender and receiver
        // ------------------------------------

        const populatedMessage =
          await PersonalMessage.findById(
            newMessage._id
          )
            .populate(
              "sender",
              "name username"
            )
            .populate(
              "receiver",
              "name username"
            );

        // ------------------------------------
        // Create common room ID
        // ------------------------------------

        const roomId = [
          senderId,
          receiverId,
        ]
          .sort()
          .join("_");

        const personalRoom =
          `personal_${roomId}`;

        // ------------------------------------
        // Send message to both users
        // ------------------------------------

        io.to(personalRoom).emit(
          "newPersonalMessage",
          populatedMessage
        );

        // ------------------------------------
        // Server log
        // ------------------------------------

        console.log(
          `📨 Personal message sent: ${senderId} → ${receiverId}`
        );

        if (hasMedia) {
          console.log(
            `📎 Media: ${mediaType}`
          );
        }

      } catch (error) {
        console.error(
          "PERSONAL MESSAGE SOCKET ERROR:",
          error
        );
      }
    }
  );

  // ========================================
  // DISCONNECT
  // ========================================

  socket.on("disconnect", () => {
    console.log(
      "🔴 User disconnected:",
      socket.id
    );
  });
});

// ==========================
// Start Server
// ==========================

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `✅ Server running on http://localhost:${PORT}`
  );
});

