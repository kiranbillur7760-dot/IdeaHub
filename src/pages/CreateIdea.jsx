import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function CreateIdea() {
  const navigate = useNavigate();

  const [idea, setIdea] = useState({
    title: "",
    description: "",
    category: "",
  });

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

      await API.post("/ideas", idea, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("🎉 Idea Created Successfully!");

      navigate("/");
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Failed to create idea");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Create New Idea
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        <input
          type="text"
          name="title"
          placeholder="Idea Title"
          className="w-full border p-3 rounded-lg"
          value={idea.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Describe your idea..."
          rows="5"
          className="w-full border p-3 rounded-lg"
          value={idea.description}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          className="w-full border p-3 rounded-lg"
          value={idea.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Technology">Technology</option>
          <option value="Education">Education</option>
          <option value="Health">Health</option>
          <option value="Startup">Startup</option>
          <option value="Environment">Environment</option>
          <option value="AI">AI</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Publish Idea 🚀
        </button>

      </form>
    </div>
  );
}

export default CreateIdea;