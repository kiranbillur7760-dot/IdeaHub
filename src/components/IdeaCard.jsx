import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import IdeaStats from "./IdeaStats";
import AuthorInfo from "./AuthorInfo";
import IdeaActions from "./IdeaActions";
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

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showReportModal, setShowReportModal] =
    useState(false);

  const [reportReason, setReportReason] =
    useState("");

  const [reporting, setReporting] =
    useState(false);

  const [showCommentReportModal, setShowCommentReportModal] =
    useState(false);

  const [selectedComment, setSelectedComment] =
    useState(null);

  const [commentReportReason, setCommentReportReason] =
    useState("");

  const [reportingComment, setReportingComment] =
    useState(false);

  const [working, setWorking] =
    useState(false);

  // =========================
  // Load
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
      const res = await API.get(
        `/ideas/${idea._id}/comments`
      );

      setComments(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // Check Saved
  // =========================

  const checkSaved = async () => {
    try {

      const token =
        localStorage.getItem("token");

      if (!token) {
        return;
      }

      const res =
        await API.get("/auth/saved", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      setSaved(
        res.data.some(
          (savedIdea) =>
            savedIdea._id === idea._id
        )
      );

    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // Like
  // =========================

  const handleLike = async () => {

    try {

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Login first");
        return;
      }

      const res =
        await API.put(
          `/ideas/${idea._id}/like`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setLikes(res.data.likes);

    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // Save
  // =========================

  const handleSave = async () => {

    try {

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Login first");
        return;
      }

      setSaving(true);

      const res =
        await API.put(
          `/auth/save/${idea._id}`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setSaved(res.data.saved);

    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Work On Idea
  // =========================

 
const navigate = useNavigate();

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

    console.log("JOIN RESPONSE:", res.data);
console.log("PROJECT ID:", res.data.projectId);

alert(JSON.stringify(res.data));

if (!res.data.projectId) {
  alert("projectId not received from backend!");
  return;
}

navigate(`/projects/${res.data.projectId}`);

  } catch (err) {
    console.error("JOIN ERROR:", err);

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

    if (!text.trim()) return;

    try {

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Login first");
        return;
      }

      await API.post(
        `/ideas/${idea._id}/comments`,
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
      console.error(err);
    }
  };

  // =========================
  // Report Idea
  // =========================

  const openReportModal = () => {
    setShowReportModal(true);
  };

  const closeReportModal = () => {
    setShowReportModal(false);
    setReportReason("");
  };

  const handleReport = async () => {

    if (!reportReason) return;

    try {

      const token =
        localStorage.getItem("token");

      await API.post(
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

      alert("Idea reported.");

      closeReportModal();

    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // Report Comment
  // =========================

  const openCommentReportModal =
    (comment) => {

      setSelectedComment(comment);

      setShowCommentReportModal(true);
    };

  const closeCommentReportModal =
    () => {

      setSelectedComment(null);

      setCommentReportReason("");

      setShowCommentReportModal(false);
    };

  const handleCommentReport =
    async () => {

      if (!selectedComment) return;

      try {

        const token =
          localStorage.getItem("token");

        await API.post(
          `/comments/${selectedComment._id}/report`,
          {
            reason: commentReportReason,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        alert("Comment reported.");

        closeCommentReportModal();

      } catch (err) {
        console.error(err);
      }
    };

  // =========================
  // UI
  // =========================

  return (

    <>

      <div className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 p-6">

        <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold">
          {idea.category}
        </span>

        {idea.image && (
          <img
            src={idea.image}
            alt={idea.title}
            className="w-full h-60 object-cover rounded-xl mt-4"
          />
        )}

        <h2 className="text-2xl font-bold mt-5">
          {idea.title}
        </h2>

        <p className="text-gray-600 mt-3 leading-7">
          {idea.description}
        </p>

        <IdeaStats
          likes={likes}
          comments={comments.length}
        />

        <AuthorInfo
          author={idea.author}
        />

        <IdeaActions
          likes={likes}
          saved={saved}
          saving={saving}
          working={working}
          handleLike={handleLike}
          handleSave={handleSave}
          handleWorkOnIdea={handleWorkOnIdea}
          openReportModal={openReportModal}
        />

        <div className="mt-6">

          <textarea
            value={text}
            onChange={(e) =>
              setText(e.target.value)
            }
            placeholder="Write a comment..."
            className="w-full border rounded-lg p-3"
            rows={2}
          />

          <button
            onClick={handleComment}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg"
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

                <div className="flex justify-between">

                  <div>

                    <p className="font-semibold">
                      👤 {comment.author}
                    </p>

                    <p className="text-gray-700 mt-1">
                      {comment.text}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      openCommentReportModal(comment)
                    }
                    className="text-red-500"
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
      {/* REPORT IDEA MODAL */}
      {/* ========================= */}

      {showReportModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white p-6 rounded-2xl w-96">

            <h2 className="text-xl font-bold mb-4">
              Report Idea
            </h2>

            <select
              className="w-full border p-2 rounded-lg"
              value={reportReason}
              onChange={(e) =>
                setReportReason(e.target.value)
              }
            >

              <option value="">
                Select reason
              </option>

              <option>
                Spam
              </option>

              <option>
                Harassment
              </option>

              <option>
                Inappropriate Content
              </option>

              <option>
                Copyright
              </option>

            </select>

            <div className="flex gap-3 mt-5">

              <button
                onClick={closeReportModal}
                className="flex-1 bg-gray-300 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleReport}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg"
              >
                Report
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ========================= */}
      {/* REPORT COMMENT MODAL */}
      {/* ========================= */}

      {showCommentReportModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white p-6 rounded-2xl w-96">

            <h2 className="text-xl font-bold mb-4">
              Report Comment
            </h2>

            <select
              className="w-full border p-2 rounded-lg"
              value={commentReportReason}
              onChange={(e) =>
                setCommentReportReason(
                  e.target.value
                )
              }
            >

              <option value="">
                Select reason
              </option>

              <option>
                Spam
              </option>

              <option>
                Harassment
              </option>

              <option>
                Hate Speech
              </option>

              <option>
                Other
              </option>

            </select>

            <div className="flex gap-3 mt-5">

              <button
                onClick={closeCommentReportModal}
                className="flex-1 bg-gray-300 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleCommentReport}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg"
              >
                Report
              </button>

            </div>

          </div>

        </div>

      )}

    </>

  );
}

export default IdeaCard;