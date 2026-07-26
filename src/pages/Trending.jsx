import { useEffect, useState } from "react";
import API from "../services/api";
import IdeaCard from "../components/IdeaCard";

function Trending() {
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    fetchTrendingIdeas();
  }, []);

  const fetchTrendingIdeas = async () => {
    try {
      const res = await API.get("/ideas/trending");
      setIdeas(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        🔥 Trending Ideas
      </h1>

      {ideas.length === 0 ? (
        <p className="text-center text-gray-500">
          No trending ideas yet.
        </p>
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

export default Trending;