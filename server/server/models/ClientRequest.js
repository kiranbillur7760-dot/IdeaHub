import mongoose from "mongoose";

const clientRequestSchema = new mongoose.Schema(
  {
    // Project the client is interested in
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // User who wants to work with the team
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Project owner / team leader
    teamOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Optional message from the client
    message: {
      type: String,
      default: "",
      trim: true,
    },

    // Request state
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "ClientRequest",
  clientRequestSchema
);