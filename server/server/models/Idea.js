import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    author: {
      type: String,
      default: "Anonymous",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ❤️ Users who liked this idea
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 💬 Number of comments
    comments: {
      type: Number,
      default: 0,
    },
    executionStatus: {
  type: String,
  enum: ["idea", "in-progress", "completed"],
  default: "idea",
},project: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Project",
  default: null,
},

    // 🚩 Users who reported this idea
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

  // Schema options
  {
    timestamps: true,
  }
);

export default mongoose.model("Idea", ideaSchema);