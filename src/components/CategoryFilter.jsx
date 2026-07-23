const categories = [
  "All",
  "AI",
  "Technology",
  "Startup",
  "Education",
  "Health",
  "Safety",
  "Environment",
];

function CategoryFilter() {
  return (
    <div className="max-w-7xl mx-auto mt-8 flex flex-wrap justify-center gap-4">
      {categories.map((category) => (
        <button
          key={category}
          className="bg-blue-100 hover:bg-blue-600 hover:text-white px-5 py-2 rounded-full transition"
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;