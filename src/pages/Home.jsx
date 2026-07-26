import { useEffect, useState } from "react";
import API from "../services/api";

import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import IdeaCard from "../components/IdeaCard";
import Footer from "../components/Footer";

function Home() {
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const response = await API.get("/ideas");

      setIdeas(response.data);
    } catch (error) {
      console.error("Error fetching ideas:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ========================= */}
      {/* Hero Section */}
      {/* ========================= */}

      <Hero />


      {/* ========================= */}
      {/* Search */}
      {/* ========================= */}

      <section className="max-w-7xl mx-auto px-6 pt-10">
        <SearchBar />
      </section>


      {/* ========================= */}
      {/* Categories */}
      {/* ========================= */}

      <section className="max-w-7xl mx-auto px-6 pt-6">
        <CategoryFilter />
      </section>


      {/* ========================= */}
      {/* Latest Ideas */}
      {/* ========================= */}
 <section className="max-w-7xl mx-auto px-6 py-16">

  {/* Section Header */}
  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">

    <div>
      <p className="text-blue-600 font-semibold mb-2">
        DISCOVER & INSPIRE
      </p>

      <h2 className="text-4xl font-bold text-gray-800">
        Latest Ideas 🚀
      </h2>

      <p className="text-gray-500 mt-2">
        Discover what people are creating and sharing.
      </p>
    </div>

    <button
      onClick={() => window.location.href = "/explore"}
      className="self-start md:self-auto bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
    >
      View All Ideas →
    </button>

  </div>


  {/* Ideas */}
  {ideas.length > 0 ? (

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

      {ideas.map((idea) => (
        <IdeaCard
          key={idea._id}
          idea={idea}
        />
      ))}

    </div>

  ) : (

    <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">

      <div className="text-6xl mb-4">
        💡
      </div>

      <h3 className="text-2xl font-bold text-gray-700">
        No ideas yet
      </h3>

      <p className="text-gray-500 mt-2">
        Be the first person to share an idea!
      </p>

      <button
        onClick={() => window.location.href = "/create-idea"}
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        + Create First Idea
      </button>

    </div>

  )}

</section>


      {/* ========================= */}
      {/* Footer */}
      {/* ========================= */}

      <Footer />

    </div>
  );
}

export default Home;