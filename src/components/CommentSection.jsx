import { useEffect, useState } from "react";
import {
  getComments,
  addComment,
  deleteComment,
} from "../services/commentService";

function CommentSection({ ideaId, currentUserId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const loadComments = async () => {
    try {
      const res = await getComments(ideaId);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadComments();
  }, [ideaId]);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);

      await addComment(ideaId, text);

      setText("");

      await loadComments();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(ideaId, commentId);
      loadComments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="font-semibold mb-3">
        Comments ({comments.length})
      </h3>

      <div className="flex gap-2 mb-4">
        <input
          className="border rounded p-2 flex-1"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Post
        </button>
      </div>

      {comments.length === 0 && (
        <p className="text-gray-500">
          No comments yet.
        </p>
      )}

      {comments.map((comment) => (
        <div
          key={comment._id}
          className="border rounded p-3 mb-2"
        >
          <div className="flex justify-between">
            <strong>
              {comment.user?.name || "Unknown User"}
            </strong>

            {comment.user?._id === currentUserId && (
              <button
                onClick={() => handleDelete(comment._id)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            )}
          </div>

          <p>{comment.text}</p>

          <small className="text-gray-500">
            {new Date(comment.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default CommentSection;