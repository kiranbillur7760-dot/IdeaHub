import mongoose from "mongoose";

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


    // ❤️ Users who liked the idea
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


    // 👥 People working on this idea
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


    // 🚩 Reported by users
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