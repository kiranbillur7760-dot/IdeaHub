import mongoose from "mongoose";

// 👥 Team Member Schema
const teamMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  role: {
    type: String,
    default: "Member",
  },

  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const ideaSchema = new mongoose.Schema(
  {
    // 💡 Idea title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // 📝 Idea description
    description: {
      type: String,
      required: true,
    },

    // 🏷 Category
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // 🖼 Image
    image: {
      type: String,
      default: "",
    },

    // 👤 Display author name
    author: {
      type: String,
      default: "Anonymous",
    },

    // 👤 Idea creator
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 👥 Project Team
    team: [teamMemberSchema],

    // ❤️ Users who liked the idea
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 💬 Comments
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        text: {
          type: String,
          required: true,
          trim: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // 🚀 Current idea development stage
    executionStatus: {
      type: String,
      enum: [
        "new",
        "looking-for-team",
        "in-progress",
        "completed",
      ],
      default: "new",
    },

    // 👥 Collaborators (keep for now)
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 🏗 Connected project workspace
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    // 🚩 Reports
    reports: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        reason: {
          type: String,
          required: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Idea", ideaSchema);