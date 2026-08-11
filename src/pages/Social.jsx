import { useEffect, useState } from "react";
import axios from "axios";

function Social() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState([]);

  const token = localStorage.getItem("token");

  const API = axios.create({
    baseURL: "https://ideahub-4-ybrb.onrender.com/api",
  });

  // =========================
  // Get Logged-in User
  // =========================

  const fetchCurrentUser = async () => {
    try {
      const response = await API.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
      setFollowing(response.data.following || []);

      // Keep localStorage updated
      localStorage.setItem(
        "user",
        JSON.stringify(response.data)
      );
    } catch (error) {
      console.error("FETCH USER ERROR:", error);
    }
  };

  // =========================
  // Get Posts
  // =========================

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(response.data);
    } catch (error) {
      console.error("FETCH POSTS ERROR:", error);
      setError("Unable to load posts.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Initial Load
  // =========================

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
      fetchPosts();
    }
  }, []);

  // =========================
  // Check Following
  // =========================

  const isFollowing = (userId) => {
    return following.some(
      (id) =>
        id?.toString() === userId?.toString()
    );
  };

  // =========================
  // Follow User
  // =========================

  const handleFollow = async (userId) => {
    try {
      setError("");

      await API.put(
        `/users/${userId}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state immediately
      setFollowing((prev) => [
        ...prev,
        userId,
      ]);

      await fetchCurrentUser();
    } catch (error) {
      console.error("FOLLOW ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to follow user."
      );
    }
  };

  // =========================
  // Unfollow User
  // =========================

  const handleUnfollow = async (userId) => {
    try {
      setError("");

      await API.put(
        `/users/${userId}/unfollow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove from local state
      setFollowing((prev) =>
        prev.filter(
          (id) =>
            id?.toString() !==
            userId?.toString()
        )
      );

      await fetchCurrentUser();
    } catch (error) {
      console.error("UNFOLLOW ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to unfollow user."
      );
    }
  };

  // =========================
  // Select Image
  // =========================

  const handleImageSelect = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image.");
      return;
    }

    setSelectedVideo(null);
    setVideoPreview("");

    setSelectedImage(file);
    setImagePreview(
      URL.createObjectURL(file)
    );

    setError("");
  };

  // =========================
  // Select Video
  // =========================

  const handleVideoSelect = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please select a video.");
      return;
    }

    setSelectedImage(null);
    setImagePreview("");

    setSelectedVideo(file);
    setVideoPreview(
      URL.createObjectURL(file)
    );

    setError("");
  };

  // =========================
  // Remove Media
  // =========================

  const removeMedia = () => {
    setSelectedImage(null);
    setImagePreview("");

    setSelectedVideo(null);
    setVideoPreview("");
  };

  // =========================
  // Create Post
  // =========================

  const handleCreatePost = async () => {
    if (
      !text.trim() &&
      !selectedImage &&
      !selectedVideo
    ) {
      setError(
        "Write something or select a photo/video."
      );
      return;
    }

    try {
      setPosting(true);
      setError("");

      let imageUrl = "";
      let videoUrl = "";

      // Upload image
      if (selectedImage) {
        setUploading(true);

        const formData = new FormData();

        formData.append(
          "image",
          selectedImage
        );

        const uploadResponse =
          await API.post(
            "/upload",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        imageUrl =
          uploadResponse.data.mediaUrl;

        setUploading(false);
      }

      // Upload video
      if (selectedVideo) {
        setUploading(true);

        const formData = new FormData();

        formData.append(
          "image",
          selectedVideo
        );

        const uploadResponse =
          await API.post(
            "/upload",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        videoUrl =
          uploadResponse.data.mediaUrl;

        setUploading(false);
      }

      // Create post
      await API.post(
        "/posts",
        {
          text: text.trim(),
          image: imageUrl,
          video: videoUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset
      setText("");

      setSelectedImage(null);
      setImagePreview("");

      setSelectedVideo(null);
      setVideoPreview("");

      await fetchPosts();
    } catch (error) {
      console.error(
        "CREATE POST ERROR:",
        error
      );

      setUploading(false);

      setError(
        error.response?.data?.message ||
          "Unable to create post."
      );
    } finally {
      setPosting(false);
    }
  };

  // =========================
  // Like / Unlike
  // =========================

  const handleLike = async (postId) => {
    try {
      await API.post(
        `/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchPosts();
    } catch (error) {
      console.error("LIKE ERROR:", error);

      setError(
        "Unable to like the post."
      );
    }
  };

  // =========================
  // Comment
  // =========================

  const handleComment = async (postId) => {
    const comment = prompt(
      "Write a comment:"
    );

    if (
      !comment ||
      !comment.trim()
    ) {
      return;
    }

    try {
      await API.post(
        `/posts/${postId}/comment`,
        {
          text: comment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchPosts();
    } catch (error) {
      console.error(
        "COMMENT ERROR:",
        error
      );

      setError(
        "Unable to add comment."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-2xl mx-auto">

        {/* ========================= */}
        {/* Header */}
        {/* ========================= */}

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            IdeaHub Social 📱
          </h1>

          <p className="text-gray-500 mt-1">
            Share, connect and discover.
          </p>
        </div>

        {/* ========================= */}
        {/* Error */}
        {/* ========================= */}

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* ========================= */}
        {/* Create Post */}
        {/* ========================= */}

        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">

          <div className="flex gap-3">

            <div className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center flex-shrink-0">
              {user?.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "👤"}
            </div>

            <textarea
              value={text}
              onChange={(e) =>
                setText(e.target.value)
              }
              placeholder="What's on your mind?"
              rows="3"
              maxLength={2000}
              className="flex-1 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />

          </div>

          {/* Image Preview */}

          {imagePreview && (
            <div className="relative mt-4">

              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-96 object-cover rounded-xl"
              />

              <button
                onClick={removeMedia}
                className="absolute top-2 right-2 w-9 h-9 rounded-full bg-black/70 text-white"
              >
                ✕
              </button>

            </div>
          )}

          {/* Video Preview */}

          {videoPreview && (
            <div className="relative mt-4">

              <video
                src={videoPreview}
                controls
                className="w-full max-h-96 rounded-xl"
              />

              <button
                onClick={removeMedia}
                className="absolute top-2 right-2 w-9 h-9 rounded-full bg-black/70 text-white"
              >
                ✕
              </button>

            </div>
          )}

          {/* Controls */}

          <div className="flex justify-between items-center mt-4">

            <div className="flex gap-4">

              <label
                htmlFor="social-image"
                className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
              >
                📸 Photo
              </label>

              <input
                id="social-image"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              <label
                htmlFor="social-video"
                className="cursor-pointer text-purple-600 hover:text-purple-800 font-medium"
              >
                🎥 Video
              </label>

              <input
                id="social-video"
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                className="hidden"
              />

            </div>

            <div className="flex items-center gap-3">

              <span className="text-xs text-gray-400">
                {text.length}/2000
              </span>

              <button
                onClick={handleCreatePost}
                disabled={
                  posting ||
                  uploading
                }
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-xl font-semibold disabled:opacity-50"
              >
                {uploading
                  ? "Uploading..."
                  : posting
                  ? "Posting..."
                  : "Post"}
              </button>

            </div>

          </div>
        </div>

        {/* ========================= */}
        {/* Loading */}
        {/* ========================= */}

        {loading && (
          <div className="text-center py-10 text-gray-500">
            Loading posts...
          </div>
        )}

        {/* ========================= */}
        {/* Empty Feed */}
        {/* ========================= */}

        {!loading &&
          posts.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-10 text-center">

              <div className="text-5xl mb-4">
                🌱
              </div>

              <h2 className="text-xl font-bold text-gray-800">
                No posts yet
              </h2>

              <p className="text-gray-500 mt-2">
                Be the first person to share something!
              </p>

            </div>
          )}

        {/* ========================= */}
        {/* Posts */}
        {/* ========================= */}

        {!loading &&
          posts.map((post) => {

            const authorId =
              post.author?._id;

            const isOwnPost =
              user?._id?.toString() ===
              authorId?.toString();

            const liked =
              post.likes?.some(
                (id) =>
                  id?.toString() ===
                  user?._id?.toString()
              );

            return (
              <div
                key={post._id}
                className="bg-white rounded-2xl shadow-sm p-5 mb-5"
              >

                {/* Author */}

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center">
                      {post.author?.name
                        ? post.author.name
                            .charAt(0)
                            .toUpperCase()
                        : "👤"}
                    </div>

                    <div>

                      <h3 className="font-semibold text-gray-800">
                        {post.author?.name ||
                          "IdeaHub User"}
                      </h3>

                      <p className="text-xs text-gray-400">
                        {new Date(
                          post.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>

                  </div>

                  {/* Follow Button */}

                  {!isOwnPost &&
                    authorId && (
                      isFollowing(
                        authorId
                      ) ? (
                        <button
                          onClick={() =>
                            handleUnfollow(
                              authorId
                            )
                          }
                          className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
                        >
                          ✓ Following
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleFollow(
                              authorId
                            )
                          }
                          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                        >
                          Follow
                        </button>
                      )
                    )}

                </div>

                {/* Text */}

                {post.text && (
                  <p className="mt-4 text-gray-700 whitespace-pre-wrap">
                    {post.text}
                  </p>
                )}

                {/* Image */}

                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full max-h-[500px] object-cover rounded-xl mt-4"
                  />
                )}

                {/* Video */}

                {post.video && (
                  <video
                    src={post.video}
                    controls
                    playsInline
                    className="w-full max-h-[600px] rounded-xl mt-4"
                  />
                )}

                {/* Actions */}

                <div className="flex items-center gap-6 mt-5 pt-4 border-t border-gray-100">

                  <button
                    onClick={() =>
                      handleLike(
                        post._id
                      )
                    }
                    className={`font-medium transition ${
                      liked
                        ? "text-red-500"
                        : "text-gray-600 hover:text-red-500"
                    }`}
                  >
                    {liked
                      ? "❤️"
                      : "🤍"}{" "}
                    {post.likes?.length ||
                      0}
                  </button>

                  <button
                    onClick={() =>
                      handleComment(
                        post._id
                      )
                    }
                    className="text-gray-600 hover:text-blue-600 font-medium"
                  >
                    💬{" "}
                    {post.comments?.length ||
                      0}
                  </button>

                  <button className="text-gray-600 hover:text-green-600 font-medium">
                    🔗 Share
                  </button>

                </div>

                {/* Comments */}

                {post.comments?.length >
                  0 && (
                  <div className="mt-4 space-y-2">

                    {post.comments.map(
                      (
                        comment,
                        index
                      ) => (
                        <div
                          key={
                            comment._id ||
                            index
                          }
                          className="bg-gray-50 rounded-xl px-4 py-3"
                        >

                          <p className="font-semibold text-sm">
                            {comment.user?.name ||
                              "User"}
                          </p>

                          <p className="text-sm text-gray-600">
                            {comment.text}
                          </p>

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>
            );
          })}

      </div>
    </div>
  );
}

export default Social;