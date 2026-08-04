function SearchBar({ search, setSearch }) {
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Search ideas..."
        className="w-full p-4 rounded-xl border shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default SearchBar;