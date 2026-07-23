function IdeaCard({ idea }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-6">

      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
        {idea.category}
      </span>

      <h2 className="text-2xl font-bold mt-4">
        {idea.title}
      </h2>

      <p className="text-gray-600 mt-3">
        {idea.description}
      </p>

      <div className="mt-6 flex justify-between text-gray-500">
        <span>❤️ {idea.likes}</span>

        <span>💬 {idea.comments}</span>
      </div>

      <div className="mt-5 border-t pt-4 text-sm text-gray-500">
        👤 {idea.author || "Anonymous"}
      </div>

    </div>
  );
}

export default IdeaCard;