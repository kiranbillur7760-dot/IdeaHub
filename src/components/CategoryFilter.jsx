const categories = [
  "All",
  "AI",
  "Technology",
  "Startup",
  "Education",
  "Health",
  "Safety",
  "Environment",
  "Business",
  "Finance",
];

function CategoryFilter({ category, onCategoryChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((item) => (
        <button
          key={item}
          onClick={() => onCategoryChange(item)}
          className={`px-4 py-2 rounded-lg ${
            category === item
              ? "bg-blue-600 text-white"
              : "bg-blue-100 hover:bg-blue-500 hover:text-white"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;