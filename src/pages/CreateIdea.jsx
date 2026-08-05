import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function CreateIdea() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Technology");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    await API.post(
      "/ideas",
      {
        title,
        description,
        category,
        image: "",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("🎉 Idea created successfully!");
    navigate("/explore");

  } catch (err) {
    console.error(err.response?.data || err);
    alert(err.response?.data?.message || "Failed to create idea.");
  }
};

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Create New Idea
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        <input
          type="text"
          placeholder="Idea Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg p-3"
          required
        />

        <textarea
          placeholder="Describe your idea..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg p-3"
          rows="5"
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          <option>Technology</option>
          <option>Education</option>
          <option>Health</option>
          <option>Business</option>
          <option>Environment</option>
          <option>Finance</option>
          <option>AI</option>
        </select>

        

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Post Idea
        </button>

      </form>
    </div>
  );
}

export default CreateIdea;