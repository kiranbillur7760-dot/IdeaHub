import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";

function IdeaCard({ idea }) {
  // =========================
  // States
  // =========================

  const [likes, setLikes] = useState(
    Array.isArray(idea.likes)
      ? idea.likes.length
      : idea.likes || 0
  );

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  // Save state
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Idea report state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);

  // Comment report state
  const [showCommentReportModal, setShowCommentReportModal] =
    useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [commentReportReason, setCommentReportReason] = useState("");
  const [reportingComment, setReportingComment] = useState(false);

  // Work on Idea state
  const [working, setWorking] = useState(false);

  // =========================
  // Load Comments + Saved State
  // =========================

  useEffect(() => {
    fetchComments();
    checkSaved();
  }, []);

  // =========================
  // Fetch Comments
  // =========================

  const fetchComments = async () => {
    try {
      const res = await API.get(`/comments/${idea._id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Fetch Comments Error:", err);
    }
  };

  // =========================
  // Check Saved
  // =========================

  const checkSaved = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setSaved(false);
        return;
      }

      const res = await API.get("/auth/saved", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const savedIdeas = res.data || [];

      const isSaved = savedIdeas.some(
        (savedIdea) => savedIdea._id === idea._id
      );

      setSaved(isSaved);
    } catch (err) {
      console.error("Check Saved Error:", err);
    }
  };

  // =========================
  // Like Idea
  // =========================

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to like an idea.");
        return;
      }

      const res = await API.put(
        `/ideas/${idea._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLikes(res.data.likes);
    } catch (err) {
      console.error("Like Error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to like the idea."
      );
    }
  };

  // =========================
  // Save / Unsave Idea
  // =========================

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to save an idea.");
        return;
      }

      setSaving(true);

      const res = await API.put(
        `/auth/save/${idea._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSaved(res.data.saved);
    } catch (err) {
      console.error("Save Idea Error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to save the idea."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Work on Idea
  // =========================

 
  // =========================
// Work on Idea / Join Idea
// =========================

const handleWorkOnIdea = async () => {
  try {

    const token = localStorage.getItem("token");


    if (!token) {
      alert("Please login to work on an idea.");
      return;
    }


    setWorking(true);


    const res = await API.post(
      `/ideas/${idea._id}/join`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    alert(res.data.message);


  } catch (err) {

    console.error("Work On Idea Error:", err);


    alert(
      err.response?.data?.message ||
      "Failed to join idea."
    );

  } finally {

    setWorking(false);

  }
};

  // =========================
  // Add Comment
  // =========================

  const handleComment = async () => {
    if (!text.trim()) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to comment.");
        return;
      }

      await API.post(
        `/comments/${idea._id}`,
        {
          text: text.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setText("");

      fetchComments();
    } catch (err) {
      console.error("Comment Error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to add comment."
      );
    }
  };

  // =========================
  // Open Idea Report Modal
  // =========================

  const openReportModal = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to report an idea.");
      return;
    }

    setShowReportModal(true);
  };

  // =========================
  // Report Idea
  // =========================

  const handleReport = async () => {
    if (!reportReason) {
      alert("Please select a reason.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to report an idea.");
        return;
      }

      setReporting(true);

      const res = await API.post(
        `/ideas/${idea._id}/report`,
        {
          reason: reportReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      setShowReportModal(false);
      setReportReason("");
    } catch (err) {
      console.error("Report Error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to report idea."
      );
    } finally {
      setReporting(false);
    }
  };

  // =========================
  // Close Idea Report Modal
  // =========================

  const closeReportModal = () => {
    if (reporting) {
      return;
    }

    setShowReportModal(false);
    setReportReason("");
  };

  // =========================
  // Open Comment Report Modal
  // =========================

  const openCommentReportModal = (comment) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to report a comment.");
      return;
    }

    setSelectedComment(comment);
    setCommentReportReason("");
    setShowCommentReportModal(true);
  };

  // =========================
  // Report Comment
  // =========================

  const handleCommentReport = async () => {
    if (!commentReportReason) {
      alert("Please select a reason.");
      return;
    }

    if (!selectedComment) {
      alert("Comment not selected.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to report a comment.");
        return;
      }

      setReportingComment(true);

      const res = await API.post(
        `/comments/${selectedComment._id}/report`,
        {
          reason: commentReportReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      setShowCommentReportModal(false);
      setSelectedComment(null);
      setCommentReportReason("");
    } catch (err) {
      console.error("Comment Report Error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to report comment."
      );
    } finally {
      setReportingComment(false);
    }
  };

  // =========================
  // Close Comment Report Modal
  // =========================

  const closeCommentReportModal = () => {
    if (reportingComment) {
      return;
    }

    setShowCommentReportModal(false);
    setSelectedComment(null);
    setCommentReportReason("");
  };

  // =========================
  // UI
  // =========================

  return (
    <>
      {/* ========================= */}
      {/* IDEA CARD */}
      {/* ========================= */}

      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-6">

        {/* Category */}

        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
          {idea.category}
        </span>

        {/* Image */}

        {idea.image && (
          <img
            src={idea.image}
            alt={idea.title}
            className="w-full h-56 object-cover rounded-lg mt-4"
          />
        )}

        {/* Title */}

        <h2 className="text-2xl font-bold mt-4">
          {idea.title}
        </h2>

        {/* Description */}

        <p className="text-gray-600 mt-3">
          {idea.description}
        </p>

        {/* Like / Comment Stats */}

        <div className="mt-6 flex justify-between items-center">

          <div className="flex gap-5">

            <span>
              ❤️ {likes}
            </span>

            <span>
              💬 {comments.length}
            </span>

          </div>

          {/* Like + Report */}

          <div className="flex gap-3">

            <button
              onClick={handleLike}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              ❤️ Like
            </button>

            <button
              onClick={openReportModal}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              🚩 Report
            </button>

          </div>
        </div>

        {/* Author */}

        <div className="mt-5 border-t pt-4 text-sm text-gray-500">
          👤 {idea.author || "Anonymous"}
        </div>

        {/* Save Button */}

        <button
          onClick={handleSave}
          disabled={saving}
          className={`mt-4 w-full px-4 py-3 rounded-lg font-semibold transition ${
            saved
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {saving
            ? "Saving..."
            : saved
            ? "🔖 Saved"
            : "🔖 Save Idea"}
        </button>

        {/* ========================= */}
        {/* WORK ON IDEA BUTTON */}
        {/* ========================= */}

        <button
          onClick={handleWorkOnIdea}
          disabled={working}
          className="mt-3 w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
        >
          {working
            ? "Opening Workspace..."
            : "🚀 Work on this Idea"}
        </button>

        {/* ========================= */}
        {/* COMMENT BOX */}
        {/* ========================= */}

        <div className="mt-6">

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
          />

          <button
            onClick={handleComment}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Post Comment
          </button>

        </div>

        {/* ========================= */}
        {/* COMMENTS */}
        {/* ========================= */}

        <div className="mt-6">

          <h3 className="font-bold mb-3">
            Comments ({comments.length})
          </h3>

          {comments.length === 0 ? (
            <p className="text-gray-500">
              No comments yet.
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="border rounded-lg p-3 mb-3 bg-gray-50"
              >

                <div className="flex justify-between items-start">

                  <div className="flex-1">

                    <p className="font-semibold">
                      👤 {comment.author}
                    </p>

                    <p className="text-gray-700 mt-1">
                      {comment.text}
                    </p>

                  </div>

                  {/* Report Comment */}

                  <button
                    onClick={() =>
                      openCommentReportModal(comment)
                    }
                    className="ml-3 text-gray-500 hover:text-red-600 text-lg"
                    title="Report comment"
                  >
                    🚩
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

      </div>

      {/* ========================= */}
      {/* IDEA REPORT MODAL */}
      {/* ========================= */}

      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-2xl font-bold">
                🚩 Report Idea
              </h2>

              <button
                onClick={closeReportModal}
                disabled={reporting}
                className="text-gray-500 hover:text-gray-800 text-2xl disabled:opacity-50"
              >
                ×
              </button>

            </div>

            <p className="text-gray-600 mb-5">
              Why are you reporting this idea?
            </p>

            <div className="space-y-3">

              {[
                "Spam",
                "Inappropriate content",
                "Misinformation",
                "Copyright violation",
                "Harassment",
                "Other",
              ].map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition ${
                    reportReason === reason
                      ? "border-red-500 bg-red-50"
                      : "hover:bg-gray-50"
                  }`}
                >

                  <input
                    type="radio"
                    name={`reportReason-${idea._id}`}
                    value={reason}
                    checked={reportReason === reason}
                    onChange={(e) =>
                      setReportReason(e.target.value)
                    }
                    className="w-4 h-4"
                  />

                  <span>
                    {reason}
                  </span>

                </label>
              ))}

            </div>

            <div className="flex gap-3 mt-6">

              <button
                onClick={closeReportModal}
                disabled={reporting}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleReport}
                disabled={reporting || !reportReason}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 disabled:bg-gray-400"
              >
                {reporting
                  ? "Reporting..."
                  : "🚩 Submit Report"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ========================= */}
      {/* COMMENT REPORT MODAL */}
      {/* ========================= */}

      {showCommentReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-2xl font-bold">
                🚩 Report Comment
              </h2>

              <button
                onClick={closeCommentReportModal}
                disabled={reportingComment}
                className="text-gray-500 hover:text-gray-800 text-2xl disabled:opacity-50"
              >
                ×
              </button>

            </div>

            <p className="text-gray-600 mb-5">
              Why are you reporting this comment?
            </p>

            <div className="space-y-3">

              {[
                "Spam",
                "Harassment",
                "Hate speech",
                "Inappropriate content",
                "Misinformation",
                "Other",
              ].map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition ${
                    commentReportReason === reason
                      ? "border-red-500 bg-red-50"
                      : "hover:bg-gray-50"
                  }`}
                >

                  <input
                    type="radio"
                    name="commentReportReason"
                    value={reason}
                    checked={
                      commentReportReason === reason
                    }
                    onChange={(e) =>
                      setCommentReportReason(
                        e.target.value
                      )
                    }
                    className="w-4 h-4"
                  />

                  <span>
                    {reason}
                  </span>

                </label>
              ))}

            </div>

            <div className="flex gap-3 mt-6">

              <button
                onClick={closeCommentReportModal}
                disabled={reportingComment}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleCommentReport}
                disabled={
                  reportingComment ||
                  !commentReportReason
                }
                className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 disabled:bg-gray-400"
              >
                {reportingComment
                  ? "Reporting..."
                  : "🚩 Submit Report"}
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default IdeaCard;