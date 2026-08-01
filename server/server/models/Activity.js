
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      enum: [
        "PROJECT_CREATED",
        "MEMBER_ADDED",
        "MEMBER_REMOVED",
        "TASK_CREATED",
        "TASK_ASSIGNED",
        "TASK_UPDATED",
        "TASK_COMPLETED",
        "TASK_DELETED",
      ],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model(
  "Activity",
  activitySchema
);

export default Activity;

