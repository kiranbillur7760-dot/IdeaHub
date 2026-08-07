import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const API_BASE = "https://ideahub-4-ybrb.onrender.com/api";
const SOCKET_URL = "https://ideahub-4-ybrb.onrender.com";

const ProjectWorkspace = () => {
  const { projectId } = useParams();

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ===========================
  // Refs
  // ===========================

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ===========================
  // Project
  // ===========================

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===========================
  // Users
  // ===========================

  const [users, setUsers] = useState([]);

  // ===========================
  // Chat
  // ===========================

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // ===========================
  // Activities
  // ===========================

  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // ===========================
  // Invite Member
  // ===========================

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  // ===========================
  // Members
  // ===========================

  const [showMemberForm, setShowMemberForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [removingMember, setRemovingMember] = useState(null);

  // ===========================
  // Task Form
  // ===========================

  const [showTaskForm, setShowTaskForm] = useState(false);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
  });

  const [creatingTask, setCreatingTask] = useState(false);

  // ===========================
  // Edit Task
  // ===========================

  const [editingTask, setEditingTask] = useState(null);
  const [updatingTask, setUpdatingTask] = useState(false);

  // ===========================
  // Delete Task
  // ===========================

  const [deletingTask, setDeletingTask] = useState(null);

  // ==========================================
  // Invite Member
  // ==========================================

  const inviteMember = async () => {
    try {
      setInviting(true);

      await axios.post(
        `${API_BASE}/collaboration/invite`,
        {
          projectId,
          email: inviteEmail,
        },
        authConfig
      );

      alert("Invitation sent successfully!");

      setInviteEmail("");
      setShowInviteModal(false);

      await refreshWorkspace();
    } catch (err) {
      alert(err.response?.data?.message || "Error inviting member");
    } finally {
      setInviting(false);
    }
  };

  // ==========================================
  // Fetch Project
  // ==========================================

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      setError("");

      const [projectRes, taskRes] = await Promise.all([
        axios.get(`${API_BASE}/projects/${projectId}`, authConfig),
        axios.get(`${API_BASE}/tasks/${projectId}`, authConfig),
      ]);

      setProject(projectRes.data.project);
      setTasks(taskRes.data.tasks || []);
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Unable to load project.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Fetch Users
  // ==========================================

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users`, authConfig);

      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // Fetch Activities
  // ==========================================

  const fetchActivities = async () => {
    try {
      setLoadingActivities(true);

      const res = await axios.get(
        `${API_BASE}/activities/${projectId}`,
        authConfig
      );

      setActivities(res.data.activities || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingActivities(false);
    }
  };

  // ==========================================
  // Fetch Messages
  // ==========================================

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/messages/${projectId}`,
        authConfig
      );

      setMessages(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // Refresh Workspace
  // ==========================================

  const refreshWorkspace = async () => {
    await Promise.all([
      fetchProjectData(),
      fetchUsers(),
      fetchActivities(),
      fetchMessages(),
    ]);
  };

  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {
    refreshWorkspace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // ==========================================
  // Socket Connection
  // ==========================================

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socketRef.current.emit("joinProject", projectId);

    socketRef.current.on("receiveMessage", (message) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === message._id);

        if (exists) return prev;

        return [...prev, message];
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("receiveMessage");
        socketRef.current.emit("leaveProject", projectId);
        socketRef.current.disconnect();
      }
    };
  }, [projectId]);

  // ==========================================
  // Auto Scroll Chat
  // ==========================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ==========================================
  // Send Message
  // ==========================================

 const sendMessage = async () => {
  console.log("1. sendMessage called");

  if (!newMessage.trim()) {
    console.log("2. Message is empty");
    return;
  }

  console.log("3. Message:", newMessage);
  console.log("4. Project ID:", projectId);

  try {
    console.log("5. Sending request...");

    const res = await axios.post(
      `${API_BASE}/messages`,
      {
        project: projectId,
        text: newMessage.trim(),
      },
      authConfig
    );

    console.log("6. Success:", res.data);

setMessages((prev) => [...prev, res.data]);

socketRef.current.emit("sendMessage", res.data);

setNewMessage("");
  } catch (err) {
    console.error("7. Error:", err);
    console.error("Response:", err.response?.data);
  }
};

  // ==========================================
  // Enter Key
  // ==========================================

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  // ==========================================
  // Available Users (not already members)
  // ==========================================

  const availableUsers = users.filter((user) => {
    return !project?.members?.some((member) => member._id === user._id);
  });

  // ==========================================
  // Add Member
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
        `${API_BASE}/projects/${projectId}/members`,
        {
          userId: selectedUserId,
        },
        authConfig
      );

      setSelectedUserId("");
      setShowMemberForm(false);

      await refreshWorkspace();

      alert("Member added successfully!");
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Unable to add member.");
    } finally {
      setAddingMember(false);
    }
  };

  // ==========================================
  // Remove Member
  // ==========================================

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) {
      return;
    }

    try {
      setRemovingMember(userId);

      await axios.delete(
        `${API_BASE}/projects/${projectId}/members/${userId}`,
        authConfig
      );

      await refreshWorkspace();

      alert("Member removed successfully!");
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Unable to remove member.");
    } finally {
      setRemovingMember(null);
    }
  };

  // ==========================================
  // Task Form Input
  // ==========================================

  const handleTaskChange = (e) => {
    const { name, value } = e.target;

    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // Create Task
  // ==========================================

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!taskData.title.trim()) {
      alert("Task title is required.");
      return;
    }

    try {
      setCreatingTask(true);

      await axios.post(
        `${API_BASE}/tasks`,
        {
          projectId,
          title: taskData.title.trim(),
          description: taskData.description.trim(),
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

      alert("Task created successfully!");
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Unable to create task.");
    } finally {
      setCreatingTask(false);
    }
  };

  // ==========================================
  // Update Task
  // ==========================================

  const handleUpdateTask = async (taskId, updates) => {
    try {
      setUpdatingTask(true);

      await axios.put(`${API_BASE}/tasks/${taskId}`, updates, authConfig);

      setEditingTask(null);

      await refreshWorkspace();

      alert("Task updated successfully!");
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Unable to update task.");
    } finally {
      setUpdatingTask(false);
    }
  };

  // ==========================================
  // Delete Task
  // ==========================================

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      setDeletingTask(taskId);

      await axios.delete(`${API_BASE}/tasks/${taskId}`, authConfig);

      await refreshWorkspace();

      alert("Task deleted successfully!");
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Unable to delete task.");
    } finally {
      setDeletingTask(null);
    }
  };

  // ==========================================
  // Change Status
  // ==========================================

  const handleStatusChange = async (taskId, status) => {
    await handleUpdateTask(taskId, { status });
  };

  // ==========================================
  // Start Editing
  // ==========================================

  const startEditingTask = (task) => {
    setEditingTask({
      ...task,
      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : "",
      assignedTo: task.assignedTo?._id || "",
    });
  };

  // ==========================================
  // Edit Form Input
  // ==========================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditingTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // Save Edited Task
  // ==========================================

  const saveEditedTask = async (e) => {
    e.preventDefault();

    if (!editingTask.title.trim()) {
      alert("Task title cannot be empty.");
      return;
    }

    await handleUpdateTask(editingTask._id, {
      title: editingTask.title.trim(),
      description: editingTask.description.trim(),
      priority: editingTask.priority,
      dueDate: editingTask.dueDate || null,
      assignedTo: editingTask.assignedTo || null,
    });
  };

  // ==========================================
  // Activity Helpers
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

  const formatActivityTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString();
  };

  const priorityStyles = {
    low: "bg-gray-100 text-gray-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Loading Project...</h2>
      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Something went wrong
          </h2>

          <p className="text-gray-600 mb-6">{error}</p>

          <button
            onClick={refreshWorkspace}
            className="px-5 py-2 bg-black text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // Project Not Found
  // ==========================================

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Project not found</h2>

          <p className="text-gray-500 mt-2">
            This project may have been deleted or you don't have access.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Statistics
  // ==========================================

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const pendingTasks = tasks.filter((task) => task.status === "todo").length;

  // ==========================================
  // JSX
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Project Header */}

      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div>
            <p className="text-sm text-gray-500">Project Workspace</p>

            <h1 className="text-3xl font-bold mt-2">{project.title}</h1>

            <p className="text-gray-600 mt-3">
              {project.description || "No description"}
            </p>
          </div>

          <div>
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full capitalize">
              {project.status}
            </span>

            <div className="mt-5">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{project.progress || 0}%</span>
              </div>

              <div className="w-60 h-3 bg-gray-200 rounded-full">
                <div
                  className="h-3 bg-blue-600 rounded-full transition-all"
                  style={{
                    width: `${project.progress || 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border">
          <p className="text-gray-500 text-sm">Total Tasks</p>
          <h2 className="text-3xl font-bold mt-2">{totalTasks}</h2>
        </div>

        <div className="bg-white rounded-xl p-5 border">
          <p className="text-gray-500 text-sm">Pending</p>
          <h2 className="text-3xl font-bold mt-2">{pendingTasks}</h2>
        </div>

        <div className="bg-white rounded-xl p-5 border">
          <p className="text-gray-500 text-sm">In Progress</p>
          <h2 className="text-3xl font-bold mt-2">{inProgressTasks}</h2>
        </div>

        <div className="bg-white rounded-xl p-5 border">
          <p className="text-gray-500 text-sm">Completed</p>
          <h2 className="text-3xl font-bold mt-2">{completedTasks}</h2>
        </div>
      </div>

      {/* Main Grid */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Tasks Column */}

        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold">Tasks</h2>

            <button
              onClick={() => setShowTaskForm(true)}
              className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold"
            >
              + Add Task
            </button>
          </div>

          {tasks.length === 0 ? (
            <p className="text-gray-500 text-sm">No tasks yet.</p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) =>
                editingTask?._id === task._id ? (
                  <form
                    key={task._id}
                    onSubmit={saveEditedTask}
                    className="border rounded-xl p-4 bg-gray-50 space-y-3"
                  >
                    <input
                      type="text"
                      name="title"
                      value={editingTask.title}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      placeholder="Task title"
                    />

                    <textarea
                      name="description"
                      value={editingTask.description}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      placeholder="Description"
                      rows={2}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <select
                        name="priority"
                        value={editingTask.priority}
                        onChange={handleEditChange}
                        className="border rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>

                      <input
                        type="date"
                        name="dueDate"
                        value={editingTask.dueDate}
                        onChange={handleEditChange}
                        className="border rounded-lg px-3 py-2 text-sm"
                      />
                    </div>

                    <select
                      name="assignedTo"
                      value={editingTask.assignedTo}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="">Unassigned</option>
                      {project.members?.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name}
                        </option>
                      ))}
                    </select>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={updatingTask}
                        className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                      >
                        {updatingTask ? "Saving..." : "Save"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingTask(null)}
                        className="px-4 py-2 border rounded-lg text-sm font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div
                    key={task._id}
                    className="border rounded-xl p-4 flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h3 className="font-semibold">{task.title}</h3>

                        {task.description && (
                          <p className="text-gray-600 text-sm mt-1">
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                              priorityStyles[task.priority] ||
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {task.priority}
                          </span>

                          {task.assignedTo?.name && (
                            <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                              {task.assignedTo.name}
                            </span>
                          )}

                          {task.dueDate && (
                            <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                              Due {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task._id, e.target.value)
                        }
                        className="border rounded-lg px-2 py-1 text-xs"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => startEditingTask(task)}
                        className="text-sm font-semibold text-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        disabled={deletingTask === task._id}
                        className="text-sm font-semibold text-red-600 disabled:opacity-50"
                      >
                        {deletingTask === task._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Sidebar Column */}

        <div className="flex flex-col gap-6">
          {/* Members */}

          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Members</h2>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowMemberForm(true)}
                  className="text-sm font-semibold text-blue-600"
                >
                  Add
                </button>

                <button
                  onClick={() => setShowInviteModal(true)}
                  className="text-sm font-semibold text-blue-600"
                >
                  Invite
                </button>
              </div>
            </div>

            {showMemberForm && (
              <form
                onSubmit={handleAddMember}
                className="mb-4 p-3 border rounded-lg bg-gray-50 space-y-3"
              >
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select a user</option>
                  {availableUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={addingMember}
                    className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                  >
                    {addingMember ? "Adding..." : "Add Member"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowMemberForm(false)}
                    className="px-4 py-2 border rounded-lg text-sm font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {project.members?.length ? (
                project.members.map((member) => (
                  <div
                    key={member._id}
                    className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-semibold">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>

                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      disabled={removingMember === member._id}
                      className="text-xs font-semibold text-red-600 disabled:opacity-50"
                    >
                      {removingMember === member._id
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No members yet.</p>
              )}
            </div>
          </div>

          {/* Chat */}

          <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col h-96">
            <h2 className="text-lg font-bold mb-3">Team Chat</h2>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-sm">No messages yet.</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg._id} className="text-sm">
                    <span className="font-semibold">
                      {msg.sender?.name || "Someone"}:{" "}
                    </span>
                    <span className="text-gray-700">{msg.text}</span>
                  </div>
                ))
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              />

              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold"
              >
                Send
              </button>
            </div>
          </div>

          {/* Activity Feed */}

          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-lg font-bold mb-3">Recent Activity</h2>

            {loadingActivities ? (
              <p className="text-gray-500 text-sm">Loading activity...</p>
            ) : activities.length === 0 ? (
              <p className="text-gray-500 text-sm">No activity yet.</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {activities.map((activity) => (
                  <div key={activity._id} className="flex gap-3 text-sm">
                    <span>{getActivityIcon(activity.action)}</span>

                    <div>
                      <p className="text-gray-700">{activity.message}</p>
                      <p className="text-xs text-gray-400">
                        {formatActivityTime(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Task Modal */}

      {showTaskForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleCreateTask}
            className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4"
          >
            <h2 className="text-lg font-bold">New Task</h2>

            <input
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleTaskChange}
              placeholder="Task title"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />

            <textarea
              name="description"
              value={taskData.description}
              onChange={handleTaskChange}
              placeholder="Description"
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />

            <div className="grid grid-cols-2 gap-3">
              <select
                name="priority"
                value={taskData.priority}
                onChange={handleTaskChange}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <input
                type="date"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleTaskChange}
                className="border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <select
              name="assignedTo"
              value={taskData.assignedTo}
              onChange={handleTaskChange}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Unassigned</option>
              {project.members?.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creatingTask}
                className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold disabled:opacity-50"
              >
                {creatingTask ? "Creating..." : "Create Task"}
              </button>

              <button
                type="button"
                onClick={() => setShowTaskForm(false)}
                className="px-4 py-2 border rounded-lg text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Invite Member Modal */}

      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold">Invite Member</h2>

            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Email address"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />

            <div className="flex gap-3">
              <button
                onClick={inviteMember}
                disabled={inviting}
                className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold disabled:opacity-50"
              >
                {inviting ? "Sending..." : "Send Invite"}
              </button>

              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 border rounded-lg text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectWorkspace;
