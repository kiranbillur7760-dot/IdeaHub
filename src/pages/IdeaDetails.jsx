import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function IdeaDetails() {
  const { id } = useParams();

  const [idea, setIdea] = useState(null);

  useEffect(() => {
    fetchIdea();
  }, [id]);

  const fetchIdea = async () => {
    try {
      const res = await API.get(`/ideas/${id}`);
      setIdea(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!idea) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">

        {idea.image && (
          <img
            src={idea.image}
            alt={idea.title}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
        )}

        <h1 className="text-4xl font-bold mb-4">
          {idea.title}
        </h1>

        <p className="text-blue-600 font-semibold mb-4">
          {idea.category}
        </p>

        <p className="text-gray-700 leading-8">
          {idea.description}
        </p>

        {/* Project Info */}
        <div className="mt-8 border-t pt-6 space-y-2">

          <p>
            <strong>Author:</strong>{" "}
            {idea.author || "Unknown"}
          </p>

          <p>
            <strong>Likes:</strong>{" "}
            {idea.likes?.length || 0}
          </p>

          <p>
            <strong>Comments:</strong>{" "}
            {idea.comments?.length || 0}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {idea.executionStatus}
          </p>

        </div>

        {/* ================= TEAM ================= */}

        <div className="mt-10 border-t pt-6">

          <h2 className="text-2xl font-bold mb-5">
            👥 Team
          </h2>

          {idea.team && idea.team.length > 0 ? (
            <div className="space-y-4">

              {idea.team.map((member) => (
                <div
                  key={member.user?._id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border"
                >

                  <div className="flex items-center gap-4">

                    <img
                      src={
                        member.user?.profilePicture ||
                        "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(member.user?.name || "User")
                      }
                      alt={member.user?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />

                    <div>

                      <h3 className="font-semibold text-lg">
                        {member.role === "Founder" ? "👑 " : "👤 "}
                        {member.user?.name || "Unknown User"}
                      </h3>

                      <p className="text-gray-500">
                        {member.role}
                      </p>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          ) : (
            <p className="text-gray-500">
              No team members yet.
            </p>
          )}

        </div>

        {/* ======================================== */}

        <div className="flex gap-4 mt-10">

          <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600">
            ❤️ Like
          </button>

          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            💬 Comment
          </button>

          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            🤝 Join Project
          </button>

        </div>

      </div>

      <Footer />
    </div>
  );
}

export default IdeaDetails;