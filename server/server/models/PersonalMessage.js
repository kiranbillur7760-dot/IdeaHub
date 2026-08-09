import mongoose from "mongoose";

const personalMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Text message
    text: {
      type: String,
      default: "",
      trim: true,
    },

    // Media URL from Cloudinary
    mediaUrl: {
      type: String,
      default: "",
    },

    // Media type: image or video
    mediaType: {
      type: String,
      enum: ["image", "video", ""],
      default: "",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "PersonalMessage",
  personalMessageSchema
);