
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = "https://ideahub-4-ybrb.onrender.com/api";

const ProjectDiscovery = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // ===========================
  // Project State
  // ===========================

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===========================
  // Client Request State
  // ===========================

  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // ===========================
  // Fetch Project
  // ===========================

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `${API_BASE}/projects/discover/${projectId}`
        );

        setProject(res.data.project);
      } catch (err) {
        console.error("Project discovery error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load this project."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  // ===========================
  // Send Client Request
  // ===========================

  const handleInterested = async () => {
    const token = localStorage.getItem("token");

    // User is not logged in
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setSendingRequest(true);

      await axios.post(
        `${API_BASE}/client-requests`,
        {
          projectId,
          message:
            "I am interested in working with your team.",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequestSent(true);

      alert(
        "Your request has been sent to the team!"
      );
    } catch (err) {
      console.error(
        "Client request error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to send request."
      );
    } finally {
      setSendingRequest(false);
    }
  };

  // ===========================
  // Loading
  // ===========================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Loading project...
        </p>
      </div>
    );
  }

  // ===========================
  // Error
  // ===========================

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border">

          <h1 className="text-2xl font-bold">
            Project unavailable
          </h1>

          <p className="text-gray-500 mt-2">
            {error}
          </p>

          <button
            onClick={() => navigate("/explore")}
            className="mt-5 px-5 py-2 bg-black text-white rounded-lg"
          >
            Back to Explore
          </button>

        </div>
      </div>
    );
  }

  // ===========================
  // Project Not Found
  // ===========================

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          Project not found.
        </p>
      </div>
    );
  }

  // ===========================
  // Main UI
  // ===========================

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* =========================== */}
        {/* Back Button */}
        {/* =========================== */}

        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm font-semibold text-gray-600 hover:text-black"
        >
          ← Back
        </button>

        {/* =========================== */}
        {/* Project Header */}
        {/* =========================== */}

        <div className="bg-white rounded-2xl border shadow-sm p-8">

          <div className="flex flex-col md:flex-row justify-between gap-6">

            <div>
              <p className="text-sm text-blue-600 font-semibold">
                PROJECT
              </p>

              <h1 className="text-4xl font-bold mt-2">
                {project.title}
              </h1>

              <p className="text-gray-600 mt-4 leading-relaxed">
                {project.description ||
                  "No description available."}
              </p>
            </div>

            {/* Status */}

            <div className="shrink-0">
              <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold capitalize">
                {project.status}
              </span>
            </div>

          </div>

          {/* =========================== */}
          {/* Progress */}
          {/* =========================== */}

          <div className="mt-8">

            <div className="flex justify-between text-sm mb-2">

              <span className="font-semibold">
                Project Progress
              </span>

              <span className="font-semibold">
                {project.progress || 0}%
              </span>

            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{
                  width: `${project.progress || 0}%`,
                }}
              />

            </div>

          </div>

        </div>

        {/* =========================== */}
        {/* Meet the Team */}
        {/* =========================== */}

        <div className="bg-white rounded-2xl border shadow-sm p-8 mt-6">

          <h2 className="text-2xl font-bold">
            Meet the Team
          </h2>

          <p className="text-gray-500 mt-1">
            People building this project
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

            {/* =========================== */}
            {/* Project Owner */}
            {/* =========================== */}

            {project.owner && (
              <div className="border rounded-xl p-5">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold">

                    {project.owner.name
                      ?.charAt(0)
                      .toUpperCase()}

                  </div>

                  <div>

                    <h3 className="font-bold">
                      {project.owner.name}
                    </h3>

                    <p className="text-sm text-blue-600">
                      Project Owner
                    </p>

                  </div>

                </div>

              </div>
            )}

            {/* =========================== */}
            {/* Team Members */}
            {/* =========================== */}

            {project.members
              ?.filter(
                (member) =>
                  member._id !==
                  project.owner?._id
              )
              .map((member) => (
                <div
                  key={member._id}
                  className="border rounded-xl p-5"
                >

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold">

                      {member.name
                        ?.charAt(0)
                        .toUpperCase()}

                    </div>

                    <div>

                      <h3 className="font-bold">
                        {member.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Team Member
                      </p>

                    </div>

                  </div>

                </div>
              ))}

          </div>

        </div>

        {/* =========================== */}
        {/* Client CTA */}
        {/* =========================== */}

        <div className="bg-black text-white rounded-2xl p-8 mt-6 text-center">

          <h2 className="text-2xl font-bold">
            Interested in this team?
          </h2>

          <p className="text-gray-300 mt-2">
            Connect with this team and discuss
            your project requirements.
          </p>

          {/* =========================== */}
          {/* Interested Button */}
          {/* =========================== */}

          <button
            onClick={handleInterested}
            disabled={
              sendingRequest || requestSent
            }
            className="mt-6 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sendingRequest
              ? "Sending..."
              : requestSent
              ? "Request Sent ✓"
              : "I'm Interested"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default ProjectDiscovery;
