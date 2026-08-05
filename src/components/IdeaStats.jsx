function IdeaStats({ likes, comments }) {
  return (
    <div className="flex items-center justify-between mt-5 border-t border-b py-4">

      <div className="flex gap-6 text-gray-600">

        <div className="flex items-center gap-2">
          ❤️
          <span className="font-semibold">{likes}</span>
        </div>

        <div className="flex items-center gap-2">
          💬
          <span className="font-semibold">{comments}</span>
        </div>

      </div>

      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
        Active
      </span>

    </div>
  );
}

export default IdeaStats;