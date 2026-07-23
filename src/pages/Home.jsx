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
    console.log("Fetching...");

    const response = await fetch("http://localhost:5000/api/ideas");

    console.log("Status:", response.status);

    const data = await response.json();

    console.log("Data:", data);

    setIdeas(data);
  } catch (error) {
    console.error("Error:", error);
  }
};
  return (
    <>
      <Hero />

      <SearchBar />

      <CategoryFilter />

      <section className="max-w-7xl mx-auto px-6 py-16">

        <h2 className="text-4xl font-bold mb-10">
          Latest Ideas 🚀
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {ideas.length > 0 ? (
            ideas.map((idea) => (
              <IdeaCard key={idea._id} idea={idea} />
            ))
          ) : (
            <p>No ideas found.</p>
          )}

        </div>

      </section>

      <Footer />
    </>
  );
}

export default Home;