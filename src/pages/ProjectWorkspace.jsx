
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProjectWorkspace = () => {
  const { projectId } = useParams();

  // ==========================================
  // AUTH TOKEN
  // ==========================================

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ==========================================
  // PROJECT + TASK STATE
  // ==========================================

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // USERS
  // ==========================================

  const [users, setUsers] = useState([]);

  // ==========================================
  // ACTIVITIES
  // ==========================================

  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // ==========================================
  // ADD MEMBER STATE
  // ==========================================

  const [showMemberForm, setShowMemberForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [removingMember, setRemovingMember] = useState(null);

  // ==========================================
  // TASK FORM STATE
  // ==========================================

  const [showTaskForm, setShowTaskForm] = useState(false);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
  });

  const [creatingTask, setCreatingTask] = useState(false);

  // ==========================================
  // EDIT TASK
  // ==========================================

  const [editingTask, setEditingTask] = useState(null);
  const [updatingTask, setUpdatingTask] = useState(false);

  // ==========================================
  // DELETE TASK
  // ==========================================

  const [deletingTask, setDeletingTask] = useState(null);

  // ==========================================
  // FETCH PROJECT + TASKS
  // ==========================================

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      setError("");

      const projectResponse = await axios.get(
        `http://localhost:5000/api/projects/${projectId}`,
        authConfig
      );

      const tasksResponse = await axios.get(
        `http://localhost:5000/api/tasks/${projectId}`,
        authConfig
      );

      setProject(projectResponse.data.project);
      setTasks(tasksResponse.data.tasks);
    } catch (error) {
      console.error("Fetch project data error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load project data."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH ALL USERS
  // ==========================================

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/",
        authConfig
      );

      setUsers(response.data.users);
    } catch (error) {
      console.error("Fetch users error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load users."
      );
    }
  };

  // ==========================================
  // FETCH PROJECT ACTIVITIES
  // ==========================================

  const fetchActivities = async () => {
    try {
      setLoadingActivities(true);

      const response = await axios.get(
        `http://localhost:5000/api/activities/${projectId}`,
        authConfig
      );

      setActivities(response.data.activities);
    } catch (error) {
      console.error("Fetch activities error:", error);
    } finally {
      setLoadingActivities(false);
    }
  };

  // ==========================================
  // REFRESH EVERYTHING
  // ==========================================

  const refreshWorkspace = async () => {
    await Promise.all([
      fetchProjectData(),
      fetchActivities(),
    ]);
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchProjectData();
    fetchUsers();
    fetchActivities();
  }, [projectId]);

  // ==========================================
  // AVAILABLE USERS
  // ==========================================

  const availableUsers = users.filter((user) => {
    const alreadyMember = project?.members?.some(
      (member) => member._id === user._id
    );

    return !alreadyMember;
  });

  // ==========================================
  // ADD MEMBER
  // ==========================================

  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!selectedUserId) {
      alert("Please select a user.");
      return;
    }

    try {
      setAddingMember(true);

      await axios.post(
        `http://localhost:5000/api/projects/${projectId}/members`,
        {
          userId: selectedUserId,
        },
        authConfig
      );

      setSelectedUserId("");
      setShowMemberForm(false);

      await refreshWorkspace();
    } catch (error) {
      console.error("Add member error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to add member."
      );
    } finally {
      setAddingMember(false);
    }
  };

  // ==========================================
  // REMOVE MEMBER
  // ==========================================

  const handleRemoveMember = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this member?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingMember(userId);

      await axios.delete(
        `http://localhost:5000/api/projects/${projectId}/members/${userId}`,
        authConfig
      );

      await refreshWorkspace();
    } catch (error) {
      console.error("Remove member error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to remove member."
      );
    } finally {
      setRemovingMember(null);
    }
  };

  // ==========================================
  // HANDLE TASK INPUT
  // ==========================================

  const handleTaskChange = (e) => {
    const { name, value } = e.target;

    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // CREATE TASK
  // ==========================================

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!taskData.title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    try {
      setCreatingTask(true);

      await axios.post(
        "http://localhost:5000/api/tasks",
        {
          projectId,
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          dueDate: taskData.dueDate || null,
          assignedTo: taskData.assignedTo || null,
        },
        authConfig
      );

      setTaskData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        assignedTo: "",
      });

      setShowTaskForm(false);

      await refreshWorkspace();
    } catch (error) {
      console.error("Create task error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to create task."
      );
    } finally {
      setCreatingTask(false);
    }
  };

  // ==========================================
  // UPDATE TASK
  // ==========================================

  const handleUpdateTask = async (taskId, updates) => {
    try {
      setUpdatingTask(true);

      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        updates,
        authConfig
      );

      setEditingTask(null);

      await refreshWorkspace();
    } catch (error) {
      console.error("Update task error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to update task."
      );
    } finally {
      setUpdatingTask(false);
    }
  };

  // ==========================================
  // DELETE TASK
  // ==========================================

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingTask(taskId);

      await axios.delete(
        `http://localhost:5000/api/tasks/${taskId}`,
        authConfig
      );

      await refreshWorkspace();
    } catch (error) {
      console.error("Delete task error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete task."
      );
    } finally {
      setDeletingTask(null);
    }
  };

  // ==========================================
  // CHANGE TASK STATUS
  // ==========================================

  const handleStatusChange = async (taskId, status) => {
    await handleUpdateTask(taskId, {
      status,
    });
  };

  // ==========================================
  // EDIT TASK
  // ==========================================

  const startEditingTask = (task) => {
    setEditingTask({
      ...task,
      dueDate: task.dueDate
        ? task.dueDate.substring(0, 10)
        : "",
      assignedTo: task.assignedTo?._id || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditingTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveEditedTask = async (e) => {
    e.preventDefault();

    if (!editingTask.title.trim()) {
      alert("Task title cannot be empty.");
      return;
    }

    await handleUpdateTask(editingTask._id, {
      title: editingTask.title,
      description: editingTask.description,
      priority: editingTask.priority,
      dueDate: editingTask.dueDate || null,
      assignedTo: editingTask.assignedTo || null,
    });
  };

  // ==========================================
  // ACTIVITY ICON
  // ==========================================

  const getActivityIcon = (action) => {
    switch (action) {
      case "PROJECT_CREATED":
        return "🚀";

      case "MEMBER_ADDED":
        return "👤";

      case "MEMBER_REMOVED":
        return "👋";

      case "TASK_CREATED":
        return "📝";

      case "TASK_ASSIGNED":
        return "🎯";

      case "TASK_UPDATED":
        return "✏️";

      case "TASK_COMPLETED":
        return "✅";

      case "TASK_DELETED":
        return "🗑️";

      default:
        return "📌";
    }
  };

  // ==========================================
  // ACTIVITY TIME
  // ==========================================

  const formatActivityTime = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString();
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg font-semibold text-gray-600">
          Loading project...
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">

          <h2 className="text-xl font-bold text-red-600 mb-2">
            Something went wrong
          </h2>

          <p className="text-gray-600 mb-4">
            {error}
          </p>

          <button
            onClick={fetchProjectData}
            className="px-5 py-2 bg-black text-white rounded-lg"
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // PROJECT NOT FOUND
  // ==========================================

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-bold">
          Project not found
        </h2>
      </div>
    );
  }

  // ==========================================
  // TASK COUNTS
  // ==========================================

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "todo"
  ).length;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-7xl mx-auto">

        {/* ======================================
            PROJECT HEADER
        ====================================== */}

        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <p className="text-sm text-gray-500 mb-1">
                Project Workspace
              </p>

              <h1 className="text-3xl font-bold text-gray-900">
                {project.title}
              </h1>

              <p className="text-gray-600 mt-2">
                {project.description ||
                  "No project description."}
              </p>

            </div>

            <div>

              <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold capitalize">
                {project.status}
              </span>

            </div>

          </div>

          {/* PROJECT PROGRESS */}

          <div className="mt-6">

            <div className="flex justify-between mb-2">

              <span className="font-semibold text-gray-700">
                Project Progress
              </span>

              <span className="font-bold text-gray-900">
                {project.progress || 0}%
              </span>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">

              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${project.progress || 0}%`,
                }}
              />

            </div>

          </div>

        </div>

        {/* ======================================
            PROJECT STATS
        ====================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <div className="bg-white rounded-xl border p-5">

            <p className="text-gray-500 text-sm">
              Total Tasks
            </p>

            <p className="text-3xl font-bold mt-1">
              {totalTasks}
            </p>

          </div>

          <div className="bg-white rounded-xl border p-5">

            <p className="text-gray-500 text-sm">
              Pending
            </p>

            <p className="text-3xl font-bold mt-1">
              {pendingTasks}
            </p>

          </div>

          <div className="bg-white rounded-xl border p-5">

            <p className="text-gray-500 text-sm">
              In Progress
            </p>

            <p className="text-3xl font-bold mt-1">
              {inProgressTasks}
            </p>

          </div>

          <div className="bg-white rounded-xl border p-5">

            <p className="text-gray-500 text-sm">
              Completed
            </p>

            <p className="text-3xl font-bold mt-1">
              {completedTasks}
            </p>

          </div>

        </div>

        {/* ======================================
            PROJECT TEAM
        ====================================== */}

        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

            <div>

              <h2 className="text-xl font-bold">
                Project Team
              </h2>

              <p className="text-sm text-gray-500">
                {project.members?.length || 0} member(s)
              </p>

            </div>

            <button
              onClick={() => {
                setShowMemberForm(true);
                setSelectedUserId("");
              }}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              + Add Member
            </button>

          </div>

          {/* ADD MEMBER */}

          {showMemberForm && (

            <div className="border rounded-xl p-5 mb-5 bg-gray-50">

              <h3 className="text-lg font-bold mb-1">
                Add Project Member
              </h3>

              <p className="text-sm text-gray-500 mb-4">
                Select a user to add to this project.
              </p>

              {availableUsers.length === 0 ? (

                <div>

                  <p className="text-sm text-gray-500">
                    There are no other users available to add.
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowMemberForm(false)}
                    className="mt-3 px-4 py-2 border rounded-lg"
                  >
                    Close
                  </button>

                </div>

              ) : (

                <form onSubmit={handleAddMember}>

                  <select
                    value={selectedUserId}
                    onChange={(e) =>
                      setSelectedUserId(e.target.value)
                    }
                    className="w-full border rounded-lg px-4 py-2.5 bg-white"
                  >

                    <option value="">
                      Select a user
                    </option>

                    {availableUsers.map((user) => (

                      <option
                        key={user._id}
                        value={user._id}
                      >
                        {user.name} — {user.email}
                      </option>

                    ))}

                  </select>

                  <div className="flex gap-3 mt-4">

                    <button
                      type="submit"
                      disabled={
                        addingMember || !selectedUserId
                      }
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                    >
                      {addingMember
                        ? "Adding..."
                        : "Add Member"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowMemberForm(false);
                        setSelectedUserId("");
                      }}
                      className="px-5 py-2.5 border rounded-lg"
                    >
                      Cancel
                    </button>

                  </div>

                </form>

              )}

            </div>

          )}

          {/* MEMBER LIST */}

          <div className="flex flex-wrap gap-3">

            {project.members?.map((member) => {

              const isOwner =
                project.owner?._id === member._id;

              return (
                <div
                  key={member._id}
                  className="flex items-center gap-3 border rounded-xl px-4 py-3 bg-gray-50"
                >

                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {member.name
                      ? member.name.charAt(0).toUpperCase()
                      : "U"}
                  </div>

                  <div>

                    <p className="font-semibold text-gray-800">
                      {member.name || "Unknown User"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {member.email}
                    </p>

                  </div>

                  {isOwner ? (

                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      Owner
                    </span>

                  ) : (

                    <button
                      onClick={() =>
                        handleRemoveMember(member._id)
                      }
                      disabled={
                        removingMember === member._id
                      }
                      className="text-xs px-2.5 py-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
                    >
                      {removingMember === member._id
                        ? "Removing..."
                        : "Remove"}
                    </button>

                  )}

                </div>
              );
            })}

          </div>

        </div>

        {/* ======================================
            MAIN CONTENT
        ====================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ======================================
              TASK SECTION
          ====================================== */}

          <div className="xl:col-span-2 bg-white rounded-2xl border shadow-sm p-6">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

              <div>

                <h2 className="text-2xl font-bold">
                  Tasks
                </h2>

                <p className="text-gray-500 text-sm">
                  Manage project tasks and progress.
                </p>

              </div>

              <button
                onClick={() => setShowTaskForm(true)}
                className="px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                + Add Task
              </button>

            </div>

            {/* CREATE TASK */}

            {showTaskForm && (

              <div className="border rounded-xl p-5 mb-6 bg-gray-50">

                <h3 className="text-lg font-bold mb-4">
                  Create New Task
                </h3>

                <form onSubmit={handleCreateTask}>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="md:col-span-2">

                      <label className="block text-sm font-semibold mb-1">
                        Task Title
                      </label>

                      <input
                        type="text"
                        name="title"
                        value={taskData.title}
                        onChange={handleTaskChange}
                        placeholder="Enter task title"
                        className="w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                      />

                    </div>

                    <div className="md:col-span-2">

                      <label className="block text-sm font-semibold mb-1">
                        Description
                      </label>

                      <textarea
                        name="description"
                        value={taskData.description}
                        onChange={handleTaskChange}
                        placeholder="Describe the task"
                        rows="3"
                        className="w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                      />

                    </div>

                    <div>

                      <label className="block text-sm font-semibold mb-1">
                        Priority
                      </label>

                      <select
                        name="priority"
                        value={taskData.priority}
                        onChange={handleTaskChange}
                        className="w-full border rounded-lg px-4 py-2.5"
                      >

                        <option value="low">
                          Low
                        </option>

                        <option value="medium">
                          Medium
                        </option>

                        <option value="high">
                          High
                        </option>

                      </select>

                    </div>

                    <div>

                      <label className="block text-sm font-semibold mb-1">
                        Due Date
                      </label>

                      <input
                        type="date"
                        name="dueDate"
                        value={taskData.dueDate}
                        onChange={handleTaskChange}
                        className="w-full border rounded-lg px-4 py-2.5"
                      />

                    </div>

                    <div>

                      <label className="block text-sm font-semibold mb-1">
                        Assign To
                      </label>

                      <select
                        name="assignedTo"
                        value={taskData.assignedTo}
                        onChange={handleTaskChange}
                        className="w-full border rounded-lg px-4 py-2.5"
                      >

                        <option value="">
                          Unassigned
                        </option>

                        {project.members?.map((member) => (

                          <option
                            key={member._id}
                            value={member._id}
                          >
                            {member.name}
                          </option>

                        ))}

                      </select>

                    </div>

                  </div>

                  <div className="flex gap-3 mt-5">

                    <button
                      type="submit"
                      disabled={creatingTask}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                    >
                      {creatingTask
                        ? "Creating..."
                        : "Create Task"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowTaskForm(false)}
                      className="px-5 py-2.5 border rounded-lg"
                    >
                      Cancel
                    </button>

                  </div>

                </form>

              </div>

            )}

            {/* TASK LIST */}

            {tasks.length === 0 ? (

              <div className="text-center py-12 border rounded-xl">

                <p className="text-gray-500">
                  No tasks yet.
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Create your first task to start working.
                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {tasks.map((task) => (

                  <div
                    key={task._id}
                    className="border rounded-xl p-5 hover:shadow-sm transition"
                  >

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                      <div className="flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="text-lg font-bold">
                            {task.title}
                          </h3>

                          <span
                            className={`text-xs px-2.5 py-1 rounded-full capitalize ${
                              task.priority === "high"
                                ? "bg-red-100 text-red-700"
                                : task.priority === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {task.priority}
                          </span>

                        </div>

                        <p className="text-gray-600 mt-2">
                          {task.description ||
                            "No description provided."}
                        </p>

                      </div>

                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            startEditingTask(task)
                          }
                          className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteTask(task._id)
                          }
                          disabled={
                            deletingTask === task._id
                          }
                          className="px-3 py-1.5 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingTask === task._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>

                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">

                      <div>
                        Status:
                      </div>

                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(
                            task._id,
                            e.target.value
                          )
                        }
                        disabled={updatingTask}
                        className="border rounded-lg px-3 py-1.5 text-gray-700"
                      >

                        <option value="todo">
                          Pending
                        </option>

                        <option value="in-progress">
                          In Progress
                        </option>

                        <option value="completed">
                          Completed
                        </option>

                      </select>

                      {task.dueDate && (

                        <span>
                          Due:{" "}
                          {new Date(
                            task.dueDate
                          ).toLocaleDateString()}
                        </span>

                      )}

                      {task.assignedTo && (

                        <span>
                          Assigned to:{" "}
                          <strong>
                            {task.assignedTo.name}
                          </strong>
                        </span>

                      )}

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* ======================================
              ACTIVITY FEED
          ====================================== */}

          <div className="bg-white rounded-2xl border shadow-sm p-6 h-fit">

            <div className="flex items-center justify-between mb-5">

              <div>

                <h2 className="text-xl font-bold">
                  Activity
                </h2>

                <p className="text-sm text-gray-500">
                  Recent project activity
                </p>

              </div>

              <button
                onClick={fetchActivities}
                disabled={loadingActivities}
                className="text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                {loadingActivities
                  ? "Refreshing..."
                  : "Refresh"}
              </button>

            </div>

            {loadingActivities ? (

              <div className="py-8 text-center text-gray-500">
                Loading activity...
              </div>

            ) : activities.length === 0 ? (

              <div className="py-8 text-center border rounded-xl">

                <div className="text-3xl mb-2">
                  📭
                </div>

                <p className="font-semibold text-gray-700">
                  No activity yet
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Project activity will appear here.
                </p>

              </div>

            ) : (

              <div className="space-y-4 max-h-[650px] overflow-y-auto pr-1">

                {activities.map((activity) => (

                  <div
                    key={activity._id}
                    className="flex gap-3"
                  >

                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {getActivityIcon(activity.action)}
                    </div>

                    <div className="min-w-0">

                      <p className="text-sm text-gray-700">
                        {activity.message}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-1">

                        {activity.userId?.name && (

                          <span className="text-xs font-semibold text-gray-500">
                            {activity.userId.name}
                          </span>

                        )}

                        <span className="text-xs text-gray-400">
                          {formatActivityTime(
                            activity.createdAt
                          )}
                        </span>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </div>

      {/* ========================================
          EDIT TASK MODAL
      ======================================== */}

      {editingTask && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-2xl w-full max-w-2xl p-6">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-xl font-bold">
                Edit Task
              </h2>

              <button
                onClick={() => setEditingTask(null)}
                className="text-gray-500 text-xl"
              >
                ×
              </button>

            </div>

            <form onSubmit={saveEditedTask}>

              <div className="space-y-4">

                <div>

                  <label className="block text-sm font-semibold mb-1">
                    Task Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={editingTask.title}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-4 py-2.5"
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold mb-1">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={editingTask.description || ""}
                    onChange={handleEditChange}
                    rows="4"
                    className="w-full border rounded-lg px-4 py-2.5"
                  />

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  <div>

                    <label className="block text-sm font-semibold mb-1">
                      Priority
                    </label>

                    <select
                      name="priority"
                      value={editingTask.priority}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-4 py-2.5"
                    >

                      <option value="low">
                        Low
                      </option>

                      <option value="medium">
                        Medium
                      </option>

                      <option value="high">
                        High
                      </option>

                    </select>

                  </div>

                  <div>

                    <label className="block text-sm font-semibold mb-1">
                      Due Date
                    </label>

                    <input
                      type="date"
                      name="dueDate"
                      value={editingTask.dueDate || ""}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-4 py-2.5"
                    />

                  </div>

                  <div>

                    <label className="block text-sm font-semibold mb-1">
                      Assigned To
                    </label>

                    <select
                      name="assignedTo"
                      value={editingTask.assignedTo || ""}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-4 py-2.5"
                    >

                      <option value="">
                        Unassigned
                      </option>

                      {project.members?.map((member) => (

                        <option
                          key={member._id}
                          value={member._id}
                        >
                          {member.name}
                        </option>

                      ))}

                    </select>

                  </div>

                </div>

              </div>

              <div className="flex justify-end gap-3 mt-6">

                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-5 py-2.5 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updatingTask}
                  className="px-5 py-2.5 bg-black text-white rounded-lg disabled:opacity-50"
                >
                  {updatingTask
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default ProjectWorkspace;

