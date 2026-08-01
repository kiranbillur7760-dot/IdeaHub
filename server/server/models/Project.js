import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    // The idea from which this project was created
    ideaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Idea",
      required: true,
    },

    // Project name
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Project description
    description: {
      type: String,
      default: "",
    },

    // Person who started the project
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // People working on the project
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Project state
    status: {
      type: String,
      enum: ["planning", "in-progress", "completed"],
      default: "planning",
    },

    // Overall project completion
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("Project", projectSchema);