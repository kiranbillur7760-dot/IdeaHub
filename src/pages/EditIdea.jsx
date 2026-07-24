import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function EditIdea() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [idea, setIdea] = useState({
    title: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    fetchIdea();
  }, []);

  const fetchIdea = async () => {
    try {
      const res = await API.get("/ideas");

      const selectedIdea = res.data.find((item) => item._id === id);

      if (selectedIdea) {
        setIdea({
          title: selectedIdea.title,
          description: selectedIdea.description,
          category: selectedIdea.category,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setIdea({
      ...idea,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.put(`/ideas/${id}`, idea, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Idea updated successfully!");

      navigate("/profile");

    } catch (err) {
      console.error(err);
      alert("Failed to update idea.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">

      <h1 className="text-3xl font-bold mb-8 text-center">
        ✏ Edit Idea
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        <input
          type="text"
          name="title"
          value={idea.title}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        <textarea
          name="description"
          rows="5"
          value={idea.description}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        <select
          name="category"
          value={idea.category}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        >
          <option value="Technology">Technology</option>
          <option value="Education">Education</option>
          <option value="Health">Health</option>
          <option value="Startup">Startup</option>
          <option value="Environment">Environment</option>
          <option value="AI">AI</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          Save Changes
        </button>

      </form>

    </div>
  );
}

export default EditIdea;