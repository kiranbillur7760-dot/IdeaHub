
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

    // Current logged-in user
    const currentUserId = req.user._id.toString();

    // Prevent project owner from requesting
    const isOwner =
      project.owner.toString() === currentUserId;

    // Prevent team members from requesting
    const isMember = project.members.some(
      (memberId) =>
        memberId.toString() === currentUserId
    );

    if (isOwner || isMember) {
      return res.status(400).json({
        message:
          "Team members cannot send a client request to their own project",
      });
    }

    // Check existing request
    const existingRequest =
      await ClientRequest.findOne({
        project: projectId,
        client: req.user._id,
      });

    if (existingRequest) {
      return res.status(400).json({
        message:
          "You have already sent a request for this project",
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

    // Populate request
    const populatedRequest =
      await ClientRequest.findById(request._id)
        .populate("client", "name email")
        .populate("teamOwner", "name email")
        .populate(
          "project",
          "title description status progress"
        );

    return res.status(201).json({
      message: "Request sent successfully",
      request: populatedRequest,
    });
  } catch (error) {
    console.error(
      "Create client request error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// GET CLIENT REQUESTS FOR TEAM OWNER
// ==========================================

export const getClientRequests = async (req, res) => {
  try {
    const requests =
      await ClientRequest.find({
        teamOwner: req.user._id,
      })
        .populate("client", "name email")
        .populate(
          "project",
          "title description status progress"
        )
        .sort({ createdAt: -1 });

    return res.status(200).json({
      requests,
    });
  } catch (error) {
    console.error(
      "Get client requests error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// ACCEPT CLIENT REQUEST
// ==========================================

export const acceptClientRequest = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const request =
      await ClientRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        message: "Client request not found",
      });
    }

    // Only project owner can accept
    if (
      request.teamOwner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to accept this request",
      });
    }

    // Already processed
    if (request.status !== "pending") {
      return res.status(400).json({
        message:
          `Request has already been ${request.status}`,
      });
    }

    request.status = "accepted";

    await request.save();

    const populatedRequest =
      await ClientRequest.findById(request._id)
        .populate("client", "name email")
        .populate("teamOwner", "name email")
        .populate(
          "project",
          "title description status progress"
        );

    return res.status(200).json({
      message: "Client request accepted",
      request: populatedRequest,
    });
  } catch (error) {
    console.error(
      "Accept client request error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// REJECT CLIENT REQUEST
// ==========================================

export const rejectClientRequest = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const request =
      await ClientRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        message: "Client request not found",
      });
    }

    // Only project owner can reject
    if (
      request.teamOwner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to reject this request",
      });
    }

    // Already processed
    if (request.status !== "pending") {
      return res.status(400).json({
        message:
          `Request has already been ${request.status}`,
      });
    }

    request.status = "rejected";

    await request.save();

    const populatedRequest =
      await ClientRequest.findById(request._id)
        .populate("client", "name email")
        .populate("teamOwner", "name email")
        .populate(
          "project",
          "title description status progress"
        );

    return res.status(200).json({
      message: "Client request rejected",
      request: populatedRequest,
    });
  } catch (error) {
    console.error(
      "Reject client request error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};
