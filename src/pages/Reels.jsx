import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Reels() {
  const navigate = useNavigate();

  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);

  const [likedReels, setLikedReels] = useState([]);

  const videoRefs = useRef([]);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const token = localStorage.getItem("token");

  const API = axios.create({
    baseURL: "https://ideahub-4-ybrb.onrender.com/api",
  });

  // =========================
  // Fetch Reels
  // =========================
  const fetchReels = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const videoPosts = response.data.filter(
        (post) =>
          post.video &&
          post.video.trim() !== ""
      );

      setReels(videoPosts);
    } catch (error) {
      console.error("FETCH REELS ERROR:", error);
      setError("Unable to load reels.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Initial Load
  // =========================
  useEffect(() => {
    if (token) {
      fetchReels();
    }
  }, []);

  // =========================
  // Play Active Video
  // =========================
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === activeIndex) {
        video.currentTime = 0;

        video.play().catch(() => {
          console.log(
            "Autoplay waiting for user interaction"
          );
        });
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex, reels]);

  // =========================
  // Like Reel
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

      const response = await API.get("/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const videoPosts = response.data.filter(
        (post) =>
          post.video &&
          post.video.trim() !== ""
      );

      setReels(videoPosts);

      const currentUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      if (currentUser?._id) {
        const updatedLiked = videoPosts
          .filter((post) =>
            post.likes?.some(
              (id) =>
                id.toString() ===
                currentUser._id.toString()
            )
          )
          .map((post) => post._id);

        setLikedReels(updatedLiked);
      }
    } catch (error) {
      console.error("LIKE REEL ERROR:", error);
    }
  };

  // =========================
  // Toggle Mute
  // =========================
  const toggleMute = () => {
    setMuted((previous) => !previous);
  };

  // =========================
  // Touch Start
  // =========================
  const handleTouchStart = (event) => {
    touchStartY.current =
      event.touches[0].clientY;
  };

  // =========================
  // Touch End
  // =========================
  const handleTouchEnd = (event) => {
    touchEndY.current =
      event.changedTouches[0].clientY;

    const distance =
      touchStartY.current -
      touchEndY.current;

    if (distance > 70) {
      goToNextReel();
    }

    if (distance < -70) {
      goToPreviousReel();
    }
  };

  // =========================
  // Next Reel
  // =========================
  const goToNextReel = () => {
    if (reels.length === 0) return;

    setActiveIndex((current) => {
      if (current < reels.length - 1) {
        return current + 1;
      }

      return current;
    });
  };

  // =========================
  // Previous Reel
  // =========================
  const goToPreviousReel = () => {
    if (reels.length === 0) return;

    setActiveIndex((current) => {
      if (current > 0) {
        return current - 1;
      }

      return current;
    });
  };

  // =========================
  // Back Button
  // =========================
  const handleBack = () => {
    navigate(-1);
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">
            🎬
          </div>

          <p className="text-lg">
            Loading reels...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // Error
  // =========================
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-5xl mb-4">
            😕
          </div>

          <p className="text-lg mb-5">
            {error}
          </p>

          <button
            onClick={fetchReels}
            className="px-5 py-3 rounded-xl bg-blue-600 font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // No Reels
  // =========================
  if (reels.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-5">
            🎥
          </div>

          <h2 className="text-2xl font-bold">
            No reels yet
          </h2>

          <p className="text-gray-400 mt-2">
            Upload a video on IdeaHub Social
            to create the first reel.
          </p>

          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mt-6 px-5 py-3 bg-white text-black rounded-xl font-semibold"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black text-white overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      {/* =========================
          Top Header
      ========================= */}
      <div className="absolute top-0 left-0 right-0 z-50 px-5 py-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">

        <div className="flex items-center gap-3">

          {/* BACK BUTTON */}
          <button
            onClick={handleBack}
            className="w-11 h-11 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-2xl hover:bg-black/80 active:scale-95 transition"
            aria-label="Go back"
          >
            ←
          </button>

          <h1 className="text-2xl font-bold">
            IdeaHub Reels
          </h1>

        </div>

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="w-11 h-11 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-xl"
        >
          {muted ? "🔇" : "🔊"}
        </button>

      </div>

      {/* =========================
          Reel Counter
      ========================= */}
      <div className="absolute top-20 right-4 z-30 bg-black/50 px-3 py-1 rounded-full text-xs">
        {activeIndex + 1} / {reels.length}
      </div>

      {/* =========================
          Reel Feed
      ========================= */}
      <div className="w-full h-full">

        {reels.map((reel, index) => {

          const authorName =
            reel.author?.name ||
            "IdeaHub User";

          const currentUser = JSON.parse(
            localStorage.getItem("user") || "null"
          );

          const liked =
            reel.likes?.some(
              (id) =>
                currentUser?._id &&
                id?.toString() ===
                  currentUser._id.toString()
            );

          return (
            <div
              key={reel._id}
              className={`absolute inset-0 transition-opacity duration-300 ${
                index === activeIndex
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >

              {/* Video */}
              <video
                ref={(element) => {
                  videoRefs.current[index] =
                    element;
                }}
                src={reel.video}
                muted={muted}
                playsInline
                loop
                preload="metadata"
                className="w-full h-full object-cover"
                onClick={toggleMute}
              />

              {/* Dark Gradient */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              {/* =========================
                  Right Actions
              ========================= */}
              <div className="absolute right-4 bottom-28 z-20 flex flex-col items-center gap-5">

                {/* Like */}
                <button
                  onClick={() =>
                    handleLike(reel._id)
                  }
                  className="flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-2xl">
                    {liked ? "❤️" : "🤍"}
                  </div>

                  <span className="text-xs mt-1 font-semibold">
                    {reel.likes?.length || 0}
                  </span>
                </button>

                {/* Comment */}
                <button
                  onClick={() => {
                    const comment =
                      prompt("Write a comment:");

                    if (
                      comment &&
                      comment.trim()
                    ) {
                      API.post(
                        `/posts/${reel._id}/comment`,
                        {
                          text: comment.trim(),
                        },
                        {
                          headers: {
                            Authorization:
                              `Bearer ${token}`,
                          },
                        }
                      )
                        .then(() => {
                          fetchReels();
                        })
                        .catch((error) => {
                          console.error(
                            "COMMENT ERROR:",
                            error
                          );
                        });
                    }
                  }}
                  className="flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-2xl">
                    💬
                  </div>

                  <span className="text-xs mt-1 font-semibold">
                    {reel.comments?.length || 0}
                  </span>
                </button>

                {/* Share */}
                <button
                  onClick={async () => {
                    try {
                      if (navigator.share) {
                        await navigator.share({
                          title: "IdeaHub Reel",
                          text: "Check out this reel on IdeaHub!",
                          url: reel.video,
                        });
                      } else {
                        await navigator.clipboard.writeText(
                          reel.video
                        );

                        alert(
                          "Reel link copied!"
                        );
                      }
                    } catch (error) {
                      console.log(
                        "Share cancelled"
                      );
                    }
                  }}
                  className="flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-2xl">
                    🔗
                  </div>

                  <span className="text-xs mt-1 font-semibold">
                    Share
                  </span>
                </button>

              </div>

              {/* =========================
                  Bottom User Information
              ========================= */}
              <div className="absolute bottom-8 left-5 right-20 z-20">

                <div className="flex items-center gap-3 mb-3">

                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg">
                    {authorName
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  {/* Name */}
                  <div>
                    <h3 className="font-bold">
                      {authorName}
                    </h3>

                    <p className="text-xs text-gray-300">
                      {new Date(
                        reel.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                </div>

                {/* Caption */}
                {reel.text && (
                  <p className="text-sm leading-6 line-clamp-3">
                    {reel.text}
                  </p>
                )}

              </div>

            </div>
          );
        })}

      </div>

      {/* =========================
          Swipe Instructions
      ========================= */}
      {activeIndex === 0 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 text-xs text-gray-300 animate-pulse">
          ↑ Swipe up for next reel
        </div>
      )}

    </div>
  );
}

export default Reels;