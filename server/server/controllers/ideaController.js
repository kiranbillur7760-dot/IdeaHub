import Notification from "../models/Notification.js";
import Idea from "../models/Idea.js";
import Project from "../models/Project.js";
// =========================
// Create Idea
// =========================
// =========================
// Create Idea
// =========================
export const createIdea = async (req, res) => {
  try {
    console.log("========== CREATE IDEA ==========");
    console.log(req.body);

    const { title, description, category, image } = req.body;

    const idea = await Idea.create({
      title,
      description,
      category,
      image: image || "",
      author: req.user.name,
      userId: req.user._id,

      // 👑 Creator automatically becomes the Founder
      team: [
        {
          user: req.user._id,
          role: "Founder",
        },
      ],
    });

    console.log("Idea Created Successfully");

    res.status(201).json(idea);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// Get Single Idea
// =========================
export const getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate("team.user", "name profilePicture bio");

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    res.json(idea);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// =========================
// Get All Ideas
// =========================
export const getIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find().sort({
      createdAt: -1,
    });

    res.json(ideas);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// Get Trending Ideas
// =========================
export const getTrendingIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find();

    // Sort by number of likes (highest first)
    ideas.sort((a, b) => b.likes.length - a.likes.length);

    res.json(ideas);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// =========================
// Search Ideas
// =========================
// =========================
// Search + Category Filter
// =========================
export const searchIdeas = async (req, res) => {
  try {
    const { keyword, category } = req.query;

    let filter = {};

    if (keyword) {
      filter.title = {
        $regex: keyword,
        $options: "i",
      };
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    const ideas = await Idea.find(filter).sort({
      createdAt: -1,
    });

    res.json(ideas);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// =========================
// Get Logged-in User Ideas
// =========================
export const getMyIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({
      userId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json(ideas);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// Update Idea
// =========================
export const updateIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    if (idea.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const updatedIdea = await Idea.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
      },
      {
        new: true,
      }
    );

    res.json(updatedIdea);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// Delete Idea
// =========================
export const deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    if (idea.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await Idea.findByIdAndDelete(req.params.id);

    res.json({
      message: "Idea deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// Like / Unlike Idea
// =========================
export const likeIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    const userId = req.user._id.toString();

    const alreadyLiked = idea.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      idea.likes = idea.likes.filter(
        (id) => id.toString() !== userId
      );
    } 
    else {
  idea.likes.push(req.user._id);

  // Create notification (don't notify yourself)
  if (idea.userId.toString() !== req.user._id.toString()) {
    await Notification.create({
      recipient: idea.userId,
      sender: req.user._id,
      type: "like",
      message: `${req.user.name} liked your idea.`,
      idea: idea._id,
    });
  }
}

    await idea.save();

    res.json({
      message: alreadyLiked
        ? "Idea unliked successfully"
        : "Idea liked successfully",
      likes: idea.likes.length,
      liked: !alreadyLiked,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// Join Idea
// =========================
export const joinIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    const userId = req.user._id.toString();

    // =========================
    // Collaborators
    // =========================
    const alreadyJoined = idea.collaborators.some(
      (id) => id.toString() === userId
    );

    if (!alreadyJoined) {
      idea.collaborators.push(req.user._id);

      if (idea.executionStatus === "new") {
        idea.executionStatus = "looking-for-team";
      }
    }

    // =========================
    // Team Members
    // =========================
    const alreadyInTeam = idea.team.some(
      (member) => member.user.toString() === userId
    );

    if (!alreadyInTeam) {
      idea.team.push({
        user: req.user._id,
        role: "Member",
      });
    }

    // =========================
    // Create Project if needed
    // =========================
    let project;

    if (idea.project) {
      project = await Project.findById(idea.project);
    }

    if (!project) {
     
     
const project = await Project.create({
  ideaId: idea._id,
  title: idea.title,
  description: idea.description,
  owner: req.user._id,
  members: [
    {
      user: req.user._id,
      role: "owner"
    }
  ],
  status: "planning"
});

      idea.project = project._id;
    } else {
      const exists = project.members.some(
        (member) => member.toString() === userId
      );

      if (!exists) {
        project.members.push(req.user._id);
        await project.save();
      }
    }

    await idea.save();

    if (idea.userId.toString() !== userId) {
      await Notification.create({
        recipient: idea.userId,
        sender: req.user._id,
        type: "collaboration",
        message: `${req.user.name} wants to work on your idea.`,
        idea: idea._id,
      });
    }

    return res.status(200).json({
      message: "Joined idea successfully 🚀",
      projectId: project._id,
    });

  } catch (error) {
    console.error("JOIN IDEA ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    idea.comments.push({
      user: req.user.id,
      text,
    });

    await idea.save();

    const updatedIdea = await Idea.findById(req.params.id)
      .populate("comments.user", "name email");

    res.status(200).json(updatedIdea.comments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate("comments.user", "name email");

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    res.json(idea.comments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    const comment = idea.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    comment.deleteOne();

    await idea.save();

    res.json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Report Idea
// ==========================
export const reportIdea = async (req, res) => {
  try {
    const { reason } = req.body;
    const ideaId = req.params.id;

    // Check reason
    if (!reason || !reason.trim()) {
      return res.status(400).json({
        message: "Please provide a reason",
      });
    }

    // Find idea
    const idea = await Idea.findById(ideaId);

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    // Check if current user already reported this idea
    const alreadyReported = idea.reports.some(
      (report) =>
        report.userId.toString() === req.user._id.toString()
    );

    if (alreadyReported) {
      return res.status(400).json({
        message: "You have already reported this idea",
      });
    }

    // Add report
    idea.reports.push({
      userId: req.user._id,
      reason: reason.trim(),
    });

    await idea.save();

    res.status(201).json({
      message: "Idea reported successfully",
    });

  } catch (error) {
    console.error("REPORT IDEA ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};