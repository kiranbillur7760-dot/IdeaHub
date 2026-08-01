
import Activity from "../models/Activity.js";


// ==========================================
// GET PROJECT ACTIVITIES
// ==========================================

export const getProjectActivities = async (req, res) => {
  try {
    const { projectId } = req.params;

    const activities = await Activity.find({
      projectId,
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      activities,
    });
  } catch (error) {
    console.error(
      "Get project activities error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

