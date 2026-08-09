import ClientRequest from "../models/ClientRequest.js";
import Project from "../models/Project.js";

// ==========================================
// SEND CLIENT REQUEST
// ==========================================

export const createClientRequest = async (req, res) => {
  try {
    const { projectId, message } = req.body;

    // Check project ID
    if (!projectId) {
      return res.status(400).json({
        message: "Project ID is required",
      });
    }

    // Find project
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Prevent project owner/team members from requesting
    const currentUserId = req.user._id.toString();

    const isOwner =
      project.owner.toString() === currentUserId;

    const isMember = project.members.some(
      (memberId) => memberId.toString() === currentUserId
    );

    if (isOwner || isMember) {
      return res.status(400).json({
        message: "Team members cannot send a client request to their own project",
      });
    }

    // Check for existing request
    const existingRequest = await ClientRequest.findOne({
      project: projectId,
      client: req.user._id,
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You have already sent a request for this project",
        status: existingRequest.status,
      });
    }

    // Create request
    const request = await ClientRequest.create({
      project: project._id,
      client: req.user._id,
      teamOwner: project.owner,
      message: message?.trim() || "",
    });

    // Return populated request
    const populatedRequest = await ClientRequest.findById(
      request._id
    )
      .populate("client", "name email")
      .populate("teamOwner", "name email")
      .populate("project", "title description status progress");

    return res.status(201).json({
      message: "Request sent successfully",
      request: populatedRequest,
    });
  } catch (error) {
    console.error("Create client request error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};