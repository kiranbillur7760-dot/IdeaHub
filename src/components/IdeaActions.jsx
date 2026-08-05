function IdeaActions({
  likes,
  saved,
  saving,
  working,
  handleLike,
  handleSave,
  handleWorkOnIdea,
  openReportModal,
}) {
  return (
    <>
      <div className="flex gap-3 mt-5">

        <button
          onClick={handleLike}
          className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
        >
          ❤️ Like ({likes})
        </button>

        <button
          onClick={openReportModal}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
        >
          🚩 Report
        </button>

      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className={`mt-3 w-full py-3 rounded-lg font-semibold transition ${
          saved
            ? "bg-yellow-500 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {saving
          ? "Saving..."
          : saved
          ? "🔖 Saved"
          : "🔖 Save Idea"}
      </button>

      <button
        onClick={handleWorkOnIdea}
        disabled={working}
        className="mt-3 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
      >
        {working
          ? "Opening Workspace..."
          : "🚀 Work on this Idea"}
      </button>
    </>
  );
}

export default IdeaActions;