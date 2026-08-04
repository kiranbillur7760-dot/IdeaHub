import { useEffect, useState } from "react";
import API from "../services/api";

import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import IdeaCard from "../components/IdeaCard";
import Footer from "../components/Footer";

function Explore() {
  const [ideas, setIdeas] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

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


  const filteredIdeas = ideas.filter((idea) => {

    const matchesSearch =
      idea.title.toLowerCase().includes(search.toLowerCase()) ||
      idea.description.toLowerCase().includes(search.toLowerCase());


    const matchesCategory =
      category === "All" ||
      idea.category === category;


    return matchesSearch && matchesCategory;
  });


  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-12">

        <h1 className="text-4xl font-bold mb-2">
          Explore Ideas 🚀
        </h1>

        <p className="text-gray-500 mb-8">
          Discover innovative ideas shared by the community.
        </p>


        <SearchBar
          search={search}
          setSearch={setSearch}
        />


        <div className="mt-6">
          <CategoryFilter
            category={category}
            onCategoryChange={setCategory}
          />
        </div>


        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">

          {filteredIdeas.length > 0 ? (

            filteredIdeas.map((idea) => (
              <IdeaCard
                key={idea._id}
                idea={idea}
              />
            ))

          ) : (

            <h2>No Ideas Found</h2>

          )}

        </div>

      </section>

      <Footer />

    </div>
  );
}

export default Explore;