
import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// ========================================
// Multer
// Store uploaded file temporarily in memory
// ========================================

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    // 50 MB maximum
    fileSize: 50 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/",
      "video/",
    ];

    const isAllowed =
      allowedTypes.some((type) =>
        file.mimetype.startsWith(type)
      );

    if (!isAllowed) {
      return cb(
        new Error(
          "Only images and videos are allowed"
        )
      );
    }

    cb(null, true);
  },
});

// ========================================
// Upload Image / Video
// ========================================

router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    try {
      const file = req.file;

      // ------------------------------------
      // Check file
      // ------------------------------------

      if (!file) {
        return res.status(400).json({
          message:
            "No image or video uploaded",
        });
      }

      // ------------------------------------
      // Determine resource type
      // ------------------------------------

      const isVideo =
        file.mimetype.startsWith("video/");

      const resourceType = isVideo
        ? "video"
        : "image";

      // ------------------------------------
      // Convert file to Base64
      // ------------------------------------

      const base64 =
        `data:${file.mimetype};base64,` +
        file.buffer.toString("base64");

      // ------------------------------------
      // Upload to Cloudinary
      // ------------------------------------

      const result =
        await cloudinary.uploader.upload(
          base64,
          {
            folder: "IdeaHub",
            resource_type:
              resourceType,
          }
        );

      // ------------------------------------
      // Send response
      // ------------------------------------

      res.json({
        mediaUrl: result.secure_url,
        mediaType: resourceType,
      });

    } catch (error) {
      console.error(
        "MEDIA UPLOAD ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Image/video upload failed",
        error: error.message,
      });
    }
  }
);

export default router;
