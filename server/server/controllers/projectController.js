import Activity from "../models/Activity.js";
import Project from "../models/Project.js";
import Idea from "../models/Idea.js";
import User from "../models/user.js";

// ADD MEMBER TO PROJECT
export const addProjectMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (project.members.some(
      (memberId) => memberId.toString() === userId
    )) {
      return res.status(400).json({
        message: "User is already a project member",
      });
    }

    project.members.push(userId);

    await project.save();
    await Activity.create({
  projectId: project._id,
  userId: req.user._id,
  action: "MEMBER_ADDED",
  message: `${req.user.name} added ${user.name} to the project`,
});

    return res.status(200).json({
      message: "Member added successfully",
      project,
    });
  } catch (error) {
    console.error("Add project member error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
// REMOVE MEMBER FROM PROJECT
export const removeProjectMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Prevent removing the project owner
    if (project.owner.toString() === userId) {
      return res.status(400).json({
        message: "Project owner cannot be removed",
      });
    }

    // Check whether user is actually a member
    const isMember = project.members.some(
      (memberId) => memberId.toString() === userId
    );

    if (!isMember) {
      return res.status(400).json({
        message: "User is not a project member",
      });
    }

    project.members = project.members.filter(
      (memberId) => memberId.toString() !== userId
    );

    await project.save();

    await Activity.create({
  projectId: project._id,
  userId: req.user._id,
  action: "MEMBER_REMOVED",
  message: `${req.user.name} removed ${userId} from the project`,
});

    return res.status(200).json({
      message: "Member removed successfully",
      project,
    });
  } catch (error) {
    console.error("Remove project member error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const { ideaId } = req.body;

    const idea = await Idea.findById(ideaId);

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    if (idea.project) {
      return res.status(400).json({
        message: "This idea is already being executed",
      });
    }

    const project = await Project.create({
      ideaId: idea._id,
      title: idea.title,
      description: idea.description,
      owner: idea.userId,
      members: [idea.userId],
    });

    idea.executionStatus = "in-progress";
    idea.project = project._id;

    await idea.save();
    await Activity.create({
  projectId: project._id,
  userId: req.user._id,
  action: "PROJECT_CREATED",
  message: `${req.user.name} created the project`,
});

    return res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// GET PROJECT
export const getProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    return res.status(200).json({
      project,
    });
  } catch (error) {
    console.error("Get project error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
// GET PUBLIC PROJECT FOR CLIENT DISCOVERY
export const getPublicProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    return res.status(200).json({
      project,
    });
  } catch (error) {
    console.error("Get public project error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};