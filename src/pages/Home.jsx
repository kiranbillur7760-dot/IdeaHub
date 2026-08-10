
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
    <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden">

      {/* ==================== HERO ==================== */}
      <section className="w-full">
        <Hero />
      </section>

      {/* ==================== DASHBOARD STATS ==================== */}
      <section className="w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardStats />
        </div>
      </section>

      {/* ==================== SEARCH ==================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <SearchBar />
      </section>

      {/* ==================== CATEGORIES ==================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <CategoryFilter />
      </section>

      {/* ==================== LATEST IDEAS ==================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8 sm:mb-10">

          {/* Heading */}
          <div className="w-full max-w-3xl">

            <span className="inline-block bg-blue-100 text-blue-700 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-3">
              🚀 DISCOVER STARTUPS
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Latest Ideas
            </h2>

            <p className="text-gray-600 mt-3 text-sm sm:text-base leading-relaxed">
              Explore innovative ideas shared by entrepreneurs,
              developers, designers, and creators from around the world.
              Collaborate, build projects, and transform ideas into reality.
            </p>

          </div>

          {/* Explore Button */}
          <div className="w-full lg:w-auto">
            <button
              type="button"
              className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-3 rounded-xl font-semibold transition duration-300 shadow-lg hover:shadow-xl"
            >
              Explore All Ideas →
            </button>
          </div>

        </div>

        {/* ==================== LOADING ==================== */}
        {loading && (
          <div className="flex justify-center items-center py-16 sm:py-24">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 border-b-4 border-blue-600"></div>
          </div>
        )}

        {/* ==================== IDEAS ==================== */}
        {!loading && ideas.length > 0 && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {ideas.map((idea) => (
              <div key={idea._id} className="w-full min-w-0">
                <IdeaCard idea={idea} />
              </div>
            ))}
          </div>
        )}

        {/* ==================== NO IDEAS ==================== */}
        {!loading && ideas.length === 0 && (
          <div className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-8 sm:p-12 lg:p-16 text-center">

            <div className="text-5xl sm:text-7xl mb-5 sm:mb-6">
              💡
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
              No Ideas Yet
            </h3>

            <p className="text-gray-500 mt-3 sm:mt-4 text-sm sm:text-lg leading-relaxed max-w-xl mx-auto">
              Be the first innovator to share an amazing startup idea.
            </p>

            <button
              type="button"
              className="mt-6 sm:mt-8 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold transition"
            >
              Share Your First Idea
            </button>

          </div>
        )}

      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="w-full">
        <Footer />
      </footer>

    </div>
  );
}

export default Home;
