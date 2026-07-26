import { useEffect, useState } from "react";
import API from "../services/api";
import IdeaCard from "../components/IdeaCard";

function Explore() {
  const [ideas, setIdeas] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchIdeas();
  }, []);

  useEffect(() => {
    filterIdeas();
  }, [search, category]);

  const fetchIdeas = async () => {
    try {
      const res = await API.get("/ideas");
      setIdeas(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filterIdeas = async () => {
    try {
      const res = await API.get(
        `/ideas/search?keyword=${search}&category=${category}`
      );

      setIdeas(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">

      <h1 className="text-4xl font-bold text-center mb-8">
        🌍 Explore Ideas
      </h1>

      {/* Search + Filter */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">

        <input
          type="text"
          placeholder="🔍 Search ideas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-2 border-blue-500 rounded-lg p-3"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border-2 border-blue-500 rounded-lg p-3"
        >
          <option>All</option>
          <option>Technology</option>
          <option>Education</option>
          <option>Health</option>
          <option>Business</option>
          <option>Environment</option>
          <option>Finance</option>
          <option>AI</option>
        </select>

      </div>

      {ideas.length === 0 ? (
        <h2 className="text-center text-gray-500">
          No ideas found.
        </h2>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <IdeaCard key={idea._id} idea={idea} />
          ))}
        </div>
      )}

    </div>
  );
}

export default Explore;