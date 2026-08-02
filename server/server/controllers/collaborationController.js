import Collaboration from "../models/Collaboration.js";
import User from "../models/user.js";
import Project from "../models/Project.js";

/* =====================================================
   Invite Member
===================================================== */
export const inviteMember = async (req, res) => {
  try {
    const { email, projectId } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check project
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Already invited?
    const existing = await Collaboration.findOne({
      project: projectId,
      user: user._id,
    });

    if (existing) {
      return res.status(400).json({
        message: "User already invited",
      });
    }

    const invitation = await Collaboration.create({
      project: projectId,
      user: user._id,
      role: "member",
      status: "pending",
    });

    res.status(201).json(invitation);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* =====================================================
   Get Project Members
===================================================== */

export const getProjectMembers = async (req, res) => {
  try {
    const members = await Collaboration.find({
      project: req.params.projectId,
      status: "accepted",
    }).populate("user", "name email");

    res.json(members);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* =====================================================
   Pending Invitations
===================================================== */

export const getPendingInvites = async (req, res) => {
  try {
    const invites = await Collaboration.find({
      user: req.user.id,
      status: "pending",
    }).populate("project");

    res.json(invites);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* =====================================================
   Accept Invite
===================================================== */

export const acceptInvite = async (req, res) => {
  try {
    const invite = await Collaboration.findById(req.params.id);

    if (!invite) {
      return res.status(404).json({
        message: "Invitation not found",
      });
    }

    invite.status = "accepted";

    await invite.save();

    res.json({
      message: "Invitation accepted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* =====================================================
   Reject Invite
===================================================== */

export const rejectInvite = async (req, res) => {
  try {
    const invite = await Collaboration.findById(req.params.id);

    if (!invite) {
      return res.status(404).json({
        message: "Invitation not found",
      });
    }

    invite.status = "rejected";

    await invite.save();

    res.json({
      message: "Invitation rejected",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* =====================================================
   Remove Member
===================================================== */

export const removeMember = async (req, res) => {
  try {
    await Collaboration.findByIdAndDelete(req.params.id);

    res.json({
      message: "Member removed",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};