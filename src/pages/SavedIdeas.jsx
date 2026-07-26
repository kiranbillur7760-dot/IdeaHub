import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function SavedIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================
  // Fetch Saved Ideas
  // ==========================
  const fetchSavedIdeas = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      const res = await API.get("/auth/saved", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIdeas(res.data);

    } catch (error) {
      console.error("Saved Ideas Error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to load saved ideas."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedIdeas();
  }, []);

  // ==========================
  // Unsave Idea
  // ==========================
  const handleUnsave = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/auth/save/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove from screen immediately
      setIdeas((prevIdeas) =>
        prevIdeas.filter((idea) => idea._id !== id)
      );

    } catch (error) {
      console.error("Unsave Error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to remove saved idea."
      );
    }
  };

  // ==========================
  // Loading
  // ==========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">
          Loading saved ideas...
        </p>
      </div>
    );
  }

  // ==========================
  // Page
  // ==========================
  return (
    <div className="max-w-7xl mx-auto p-8">

      {/* Heading */}
      <div className="text-center mb-10">

        <h1 className="text-4xl font-bold">
          🔖 Saved Ideas
        </h1>

        <p className="text-gray-500 mt-2">
          Ideas you saved for later
        </p>

      </div>


      {/* No Ideas */}
      {ideas.length === 0 ? (

        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

          <div className="text-6xl mb-4">
            🔖
          </div>

          <h2 className="text-2xl font-bold">
            No Saved Ideas
          </h2>

          <p className="text-gray-500 mt-2">
            You haven't saved any ideas yet.
          </p>

          <Link
            to="/explore"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            🌍 Explore Ideas
          </Link>

        </div>

      ) : (

        /* Ideas Grid */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {ideas.map((idea) => (

            <div
              key={idea._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-6"
            >

              {/* Category */}
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {idea.category}
              </span>


              {/* Image */}
              {idea.image && (
                <img
                  src={idea.image}
                  alt={idea.title}
                  className="w-full h-48 object-cover rounded-lg mt-4"
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


              {/* Author */}
              <p className="text-sm text-gray-500 mt-4">
                👤 {idea.author || "Anonymous"}
              </p>


              {/* Buttons */}
              <div className="flex gap-3 mt-5">

                <button
                  onClick={() => handleUnsave(idea._id)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-semibold"
                >
                  🔖 Unsave
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default SavedIdeas;