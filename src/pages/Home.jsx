
import { useEffect, useState } from "react";
import API from "../services/api";

import Hero from "../components/Hero";
import DashboardStats from "../components/DashboardStats";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import IdeaCard from "../components/IdeaCard";
import Footer from "../components/Footer";

function Home() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const response = await API.get("/ideas");
      setIdeas(response.data);
    } catch (error) {
      console.error("Error fetching ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <Hero />

      {/* Dashboard Statistics */}
      <DashboardStats />

      {/* Search */}
      <section className="max-w-7xl mx-auto px-6 pt-10">
        <SearchBar />
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 pt-6">
        <CategoryFilter />
      </section>

      {/* Latest Ideas */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold mb-3">
              🚀 DISCOVER STARTUPS
            </span>

            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              Latest Ideas
            </h2>

            <p className="text-gray-600 mt-3 max-w-2xl">
              Explore innovative ideas shared by entrepreneurs,
              developers, designers, and creators from around the world.
              Collaborate, build projects, and transform ideas into reality.
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition duration-300 shadow-lg hover:shadow-xl">
              Explore All Ideas →
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-600"></div>
          </div>
        ) : ideas.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideas.map((idea) => (
              <IdeaCard
                key={idea._id}
                idea={idea}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-16 text-center">
            <div className="text-7xl mb-6">
              💡
            </div>

            <h3 className="text-3xl font-bold text-gray-800">
              No Ideas Yet
            </h3>

            <p className="text-gray-500 mt-4 text-lg">
              Be the first innovator to share an amazing startup idea.
            </p>

            <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition">
              Share Your First Idea
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Home;

