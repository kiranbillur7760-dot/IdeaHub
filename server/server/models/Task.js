
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    // Project this task belongs to
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // Task title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Task description
    description: {
      type: String,
      default: "",
    },

    // Person responsible for this task
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Task status
    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo",
    },

    // Task priority
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // Task deadline
    dueDate: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("Task", taskSchema);
