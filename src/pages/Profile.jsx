import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedUser);

    fetchMyIdeas();
  }, []);

  const fetchMyIdeas = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/ideas/myideas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIdeas(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteIdea = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this idea?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/ideas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Idea deleted successfully!");
      fetchMyIdeas();

    } catch (err) {
      console.error(err);
    }
  };
  const startProject = async (ideaId) => {
  const confirmStart = window.confirm(
    "Do you want to start a project from this idea?"
  );

  if (!confirmStart) return;

  try {
    const token = localStorage.getItem("token");

    const res = await API.post(
      "/projects",
      {
        ideaId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Project created successfully!");

    // Open the project workspace
    navigate(`/projects/${res.data.project._id}`);

  } catch (err) {
    console.error(err.response?.data || err);

    alert(
      err.response?.data?.message ||
        "Failed to create project."
    );
  }
};

  const totalLikes = ideas.reduce(
    (sum, idea) => sum + (idea.likes ? idea.likes.length : 0),
    0
  );

  const totalComments = ideas.reduce(
    (sum, idea) => sum + (idea.comments || 0),
    0
  );

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8">

        <div className="flex flex-col md:flex-row items-center gap-6">

          {/* Avatar */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center text-5xl font-bold shadow-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          {/* User Details */}
          <div className="flex-1">

            <h1 className="text-4xl font-bold text-gray-800">
              {user?.name}
            </h1>

            <p className="text-gray-500 mt-2">
              📧 {user?.email}
            </p>

            <p className="mt-4 text-gray-600">
              🚀 Welcome to IdeaHub
            </p>

            <button
  onClick={() => navigate("/edit-profile")}
  className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
>
  Edit Profile
</button>

          </div>

        </div>

        <hr className="my-8" />

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl p-6 text-center shadow">

            <h2 className="text-4xl font-bold">
              {ideas.length}
            </h2>

            <p className="mt-2">💡 Total Ideas</p>

          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl p-6 text-center shadow">

            <h2 className="text-4xl font-bold">
              {totalLikes}
            </h2>

            <p className="mt-2">❤️ Total Likes</p>

          </div>

          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl p-6 text-center shadow">

            <h2 className="text-4xl font-bold">
              {totalComments}
            </h2>

            <p className="mt-2">💬 Total Comments</p>

          </div>

        </div>

      </div>

      {/* My Ideas */}
      <div className="mt-12">

        <h2 className="text-3xl font-bold mb-6">
          🚀 My Ideas
        </h2>

        {ideas.length === 0 ? (

          <div className="bg-white p-10 rounded-xl shadow text-center">

            <h3 className="text-2xl font-semibold">
              No Ideas Yet
            </h3>

            <p className="text-gray-500 mt-3">
              Start sharing your amazing ideas with the world!
            </p>

          </div>

        ) : (

          <div className="grid gap-8">

            {ideas.map((idea) => (

              <div
                key={idea._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >

                {/* Image */}
                {idea.image && (
                  <img
                    src={idea.image}
                    alt={idea.title}
                    className="w-full h-64 object-cover"
                  />
                )}

                <div className="p-6">

                  <h3 className="text-2xl font-bold">
                    {idea.title}
                  </h3>

                  <p className="mt-3 text-gray-600">
                    {idea.description}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-5">

                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full">
                      {idea.category}
                    </span>

                    <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full">
                      ❤️ {idea.likes?.length || 0}
                    </span>

                    <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full">
                      💬 {idea.comments || 0}
                    </span>

                  </div>

                  <div className="flex gap-4 mt-6 flex-wrap">

  <Link
    to={`/edit-idea/${idea._id}`}
    className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition"
  >
    ✏️ Edit
  </Link>

  <button
    onClick={() => deleteIdea(idea._id)}
    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
  >
    🗑 Delete
  </button>

  <button
    onClick={() => startProject(idea._id)}
    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
  >
    🚀 Start Project
  </button>

</div>
                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Profile;