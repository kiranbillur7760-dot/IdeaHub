import Task from "../models/Task.js";
import Project from "../models/Project.js";
import Activity from "../models/Activity.js";


// ==========================================
// UPDATE PROJECT PROGRESS
// ==========================================

const updateProjectProgress = async (projectId) => {
  const tasks = await Task.find({ projectId });

  const totalTasks = tasks.length;

  if (totalTasks === 0) {
    await Project.findByIdAndUpdate(projectId, {
      progress: 0,
      status: "planning",
    });

    return;
  }

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const progress = Math.round(
    (completedTasks / totalTasks) * 100
  );

  let status = "in-progress";

  if (progress === 100) {
    status = "completed";
  }

  await Project.findByIdAndUpdate(projectId, {
    progress,
    status,
  });
};


// ==========================================
// CREATE TASK
// ==========================================

export const createTask = async (req, res) => {
  try {
    const {
      projectId,
      title,
      description,
      priority,
      dueDate,
      assignedTo,
    } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const task = await Task.create({
      projectId,
      title,
      description,
      priority,
      dueDate,
      assignedTo: assignedTo || null,
    });


    // Update project progress
    await updateProjectProgress(projectId);


    // ==========================================
    // CREATE ACTIVITY
    // ==========================================

    await Activity.create({
      projectId: project._id,
      userId: req.user._id,
      action: "TASK_CREATED",
      message: `${req.user.name} created the task "${task.title}"`,
    });


    // ==========================================
    // TASK ASSIGNED ACTIVITY
    // ==========================================

    if (assignedTo) {
      const assignedUser = await Project.findById(projectId)
        .populate({
          path: "members",
          select: "name email",
          match: { _id: assignedTo },
        });

      const assignedMember =
        assignedUser?.members?.[0];

      if (assignedMember) {
        await Activity.create({
          projectId: project._id,
          userId: req.user._id,
          action: "TASK_ASSIGNED",
          message: `${req.user.name} assigned "${task.title}" to ${assignedMember.name}`,
        });
      }
    }


    return res.status(201).json({
      message: "Task created successfully",
      task,
    });

  } catch (error) {
    console.error("Create task error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// GET ALL TASKS FOR PROJECT
// ==========================================

export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ projectId })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      tasks,
    });

  } catch (error) {
    console.error(
      "Get project tasks error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// UPDATE TASK
// ==========================================

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo,
    } = req.body;


    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }


    // Store old values
    const oldStatus = task.status;
    const oldAssignedTo = task.assignedTo
      ? task.assignedTo.toString()
      : null;


    // Update task
    task.title = title ?? task.title;
    task.description =
      description ?? task.description;
    task.priority =
      priority ?? task.priority;
    task.status =
      status ?? task.status;
    task.dueDate =
      dueDate ?? task.dueDate;
    task.assignedTo =
      assignedTo ?? task.assignedTo;


    await task.save();


    // Update project progress
    await updateProjectProgress(
      task.projectId
    );


    // ==========================================
    // TASK COMPLETED
    // ==========================================

    if (
      status === "completed" &&
      oldStatus !== "completed"
    ) {

      await Activity.create({
        projectId: task.projectId,
        userId: req.user._id,
        action: "TASK_COMPLETED",
        message: `${req.user.name} completed the task "${task.title}"`,
      });

    }

    // ==========================================
    // TASK ASSIGNED
    // ==========================================

    if (
      assignedTo &&
      assignedTo !== oldAssignedTo
    ) {

      const project = await Project.findById(
        task.projectId
      ).populate("members", "name email");

      const assignedMember =
        project.members.find(
          (member) =>
            member._id.toString() === assignedTo
        );

      if (assignedMember) {

        await Activity.create({
          projectId: task.projectId,
          userId: req.user._id,
          action: "TASK_ASSIGNED",
          message: `${req.user.name} assigned "${task.title}" to ${assignedMember.name}`,
        });

      }

    }

    // ==========================================
    // GENERAL TASK UPDATE
    // ==========================================

    if (
      status !== "completed" &&
      (
        title !== undefined ||
        description !== undefined ||
        priority !== undefined ||
        dueDate !== undefined
      )
    ) {

      await Activity.create({
        projectId: task.projectId,
        userId: req.user._id,
        action: "TASK_UPDATED",
        message: `${req.user.name} updated the task "${task.title}"`,
      });

    }


    return res.status(200).json({
      message: "Task updated successfully",
      task,
    });

  } catch (error) {
    console.error(
      "Update task error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// DELETE TASK
// ==========================================

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;


    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }


    // Save information before deleting
    const projectId = task.projectId;
    const taskTitle = task.title;


    await Task.findByIdAndDelete(id);


    // Update project progress
    await updateProjectProgress(
      projectId
    );


    // ==========================================
    // CREATE DELETE ACTIVITY
    // ==========================================

    await Activity.create({
      projectId,
      userId: req.user._id,
      action: "TASK_DELETED",
      message: `${req.user.name} deleted the task "${taskTitle}"`,
    });


    return res.status(200).json({
      message: "Task deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete task error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

