import { useEffect, useState } from "react";
import API from "../services/api";

function Profile() {
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

    alert("Idea deleted!");

    fetchMyIdeas();

  } catch (err) {
    console.error(err);
  }
};

  const totalLikes = ideas.reduce((sum, idea) => sum + (idea.likes || 0), 0);
  const totalComments = ideas.reduce((sum, idea) => sum + (idea.comments || 0), 0);

  return (
    <div className="max-w-6xl mx-auto p-10">

      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-xl p-8">

        <div className="flex items-center gap-6">

          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-4xl font-bold">
              {user?.name}
            </h1>

            <p className="text-gray-600">
              {user?.email}
            </p>
          </div>

        </div>

        <hr className="my-8" />

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-blue-100 rounded-lg p-6 text-center">
            <h2 className="text-3xl font-bold">
              {ideas.length}
            </h2>
            <p>Total Ideas</p>
          </div>

          <div className="bg-green-100 rounded-lg p-6 text-center">
            <h2 className="text-3xl font-bold">
              {totalLikes}
            </h2>
            <p>Total Likes</p>
          </div>

          <div className="bg-yellow-100 rounded-lg p-6 text-center">
            <h2 className="text-3xl font-bold">
              {totalComments}
            </h2>
            <p>Total Comments</p>
          </div>

        </div>

      </div>

      {/* My Ideas */}
      <div className="mt-10">

        <h2 className="text-3xl font-bold mb-6">
          🚀 My Ideas
        </h2>

        {ideas.length === 0 ? (
          <p>You haven't posted any ideas yet.</p>
        ) : (
          <div className="grid gap-6">

            {ideas.map((idea) => (
              <div
                key={idea._id}
                className="bg-white shadow rounded-lg p-6"
              >
                <h3 className="text-2xl font-bold">
                  {idea.title}
                </h3>

                <p className="mt-2 text-gray-600">
                  {idea.description}
                </p>

                <div className="mt-4 flex justify-between items-center">

                  <span className="bg-blue-600 text-white px-3 py-1 rounded">
                    {idea.category}
                  </span>

                  <div className="flex gap-3">

                    <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                      Edit
                    </button>

                    <button
  onClick={() => deleteIdea(idea._id)}
  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
>
  Delete
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