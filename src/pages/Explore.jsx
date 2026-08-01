import { useEffect, useState } from "react";
import API from "../services/api";
import IdeaCard from "../components/IdeaCard";
import CategoryFilter from "../components/CategoryFilter";

function Explore() {
  const [ideas, setIdeas] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    filterIdeas();
  }, [search, category]);

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

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search ideas..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border-2 border-blue-500 rounded-lg p-3 w-full mb-6"
      />

      {/* Category Filter */}
      <CategoryFilter
        category={category}
        onCategoryChange={setCategory}
      />

      {/* Ideas */}
      {ideas.length === 0 ? (
        <h2 className="text-center text-gray-500 mt-8">
          No ideas found.
        </h2>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {ideas.map((idea) => (
            <IdeaCard key={idea._id} idea={idea} />
          ))}
        </div>
      )}

    </div>
  );
}

export default Explore;