import Comment from "../models/Comment.js";
import Idea from "../models/Idea.js";

// ==========================
// Add Comment
// ==========================
export const createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const ideaId = req.params.ideaId;

    // Check comment text
    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    // Check idea
    const idea = await Idea.findById(ideaId);

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    // Create comment
    const comment = await Comment.create({
      ideaId,
      userId: req.user._id,
      author: req.user.name || "Anonymous",
      text: text.trim(),
    });

    // Increase comment count in Idea
    idea.comments = (idea.comments || 0) + 1;

    await idea.save();

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });

  } catch (error) {
    console.error("CREATE COMMENT ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================
// Get Comments of an Idea
// ==========================
export const getComments = async (req, res) => {
  try {
    const ideaId = req.params.ideaId;

    const comments = await Comment.find({ ideaId })
      .sort({ createdAt: -1 });

    res.status(200).json(comments);

  } catch (error) {
    console.error("GET COMMENTS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================
// Report Comment
// ==========================
export const reportComment = async (req, res) => {
  try {
    const { reason } = req.body;
    const commentId = req.params.id;

    // Check reason
    if (!reason || !reason.trim()) {
      return res.status(400).json({
        message: "Please provide a reason",
      });
    }

    // Find comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // Check whether this user already reported it
    const alreadyReported = comment.reports.some(
      (report) =>
        report.userId.toString() === req.user._id.toString()
    );

    if (alreadyReported) {
      return res.status(400).json({
        message: "You have already reported this comment",
      });
    }

    // Add report
    comment.reports.push({
      userId: req.user._id,
      reason: reason.trim(),
    });

    await comment.save();

    res.status(201).json({
      message: "Comment reported successfully",
    });

  } catch (error) {
    console.error("REPORT COMMENT ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};