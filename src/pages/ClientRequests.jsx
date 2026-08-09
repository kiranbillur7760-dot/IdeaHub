
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE =
  "https://ideahub-4-ybrb.onrender.com/api";

function ClientRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const token = localStorage.getItem("token");

  // ==========================================
  // FETCH CLIENT REQUESTS
  // ==========================================

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${API_BASE}/client-requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests(response.data.requests || []);
    } catch (err) {
      console.error(
        "Fetch client requests error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load client requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ==========================================
  // ACCEPT REQUEST
  // ==========================================

  const handleAccept = async (requestId) => {
    try {
      setProcessingId(requestId);

      await axios.patch(
        `${API_BASE}/client-requests/${requestId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests((previousRequests) =>
        previousRequests.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status: "accepted",
              }
            : request
        )
      );

      alert("Client request accepted!");
    } catch (err) {
      console.error(
        "Accept request error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to accept request."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================================
  // REJECT REQUEST
  // ==========================================

  const handleReject = async (requestId) => {
    try {
      setProcessingId(requestId);

      await axios.patch(
        `${API_BASE}/client-requests/${requestId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests((previousRequests) =>
        previousRequests.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status: "rejected",
              }
            : request
        )
      );

      alert("Client request rejected.");
    } catch (err) {
      console.error(
        "Reject request error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to reject request."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">
          Loading client requests...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() =>
              navigate("/client-dashboard")
            }
            className="mb-6 text-gray-600 hover:text-black"
          >
            ← Back to Dashboard
          </button>

          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600">
              Something went wrong
            </h1>

            <p className="text-gray-600 mt-2">
              {error}
            </p>

            <button
              onClick={fetchRequests}
              className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <header className="bg-white border-b px-6 py-5">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() =>
              navigate("/client-dashboard")
            }
            className="text-sm text-gray-500 hover:text-black mb-3"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold text-gray-800">
            Client Requests
          </h1>

          <p className="text-gray-500 mt-1">
            Manage clients interested in your projects.
          </p>
        </div>
      </header>

      {/* Content */}

      <main className="max-w-5xl mx-auto px-6 py-8">
        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl border shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">
              📩
            </div>

            <h2 className="text-2xl font-bold">
              No client requests yet
            </h2>

            <p className="text-gray-500 mt-2">
              When clients show interest in your
              projects, their requests will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {requests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-2xl border shadow-sm p-6"
              >
                {/* Top */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                      {request.client?.name
                        ?.charAt(0)
                        .toUpperCase() || "C"}
                    </div>

                    <div>
                      <h2 className="font-bold text-lg">
                        {request.client?.name ||
                          "Unknown Client"}
                      </h2>

                      <p className="text-sm text-gray-500">
                        {request.client?.email ||
                          "No email available"}
                      </p>
                    </div>
                  </div>

                  {/* Status */}

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                      request.status ===
                      "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : request.status ===
                          "accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>

                {/* Project */}

                <div className="mt-5 border rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Project
                  </p>

                  <h3 className="text-lg font-bold mt-1">
                    {request.project?.title ||
                      "Unknown Project"}
                  </h3>

                  {request.project
                    ?.description && (
                    <p className="text-gray-600 text-sm mt-2">
                      {request.project.description}
                    </p>
                  )}
                </div>

                {/* Message */}

                {request.message && (
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-gray-700">
                      Client Message
                    </p>

                    <p className="mt-2 bg-gray-50 rounded-xl p-4 text-gray-600">
                      "{request.message}"
                    </p>
                  </div>
                )}

                {/* Actions */}

                {request.status ===
                  "pending" && (
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      onClick={() =>
                        handleAccept(
                          request._id
                        )
                      }
                      disabled={
                        processingId ===
                        request._id
                      }
                      className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60"
                    >
                      {processingId ===
                      request._id
                        ? "Processing..."
                        : "✓ Accept Client"}
                    </button>

                    <button
                      onClick={() =>
                        handleReject(
                          request._id
                        )
                      }
                      disabled={
                        processingId ===
                        request._id
                      }
                      className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 disabled:opacity-60"
                    >
                      {processingId ===
                      request._id
                        ? "Processing..."
                        : "✕ Reject"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ClientRequests;
