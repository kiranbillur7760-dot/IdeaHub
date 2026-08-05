function AuthorInfo({ author }) {
  const firstLetter = author
    ? author.charAt(0).toUpperCase()
    : "?";

  return (
    <div className="flex items-center gap-3 mt-5">

      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow">
        {firstLetter}
      </div>

      <div>

        <h4 className="font-semibold text-gray-800">
          {author || "Anonymous"}
        </h4>

        <p className="text-sm text-gray-500">
          Startup Creator
        </p>

      </div>

    </div>
  );
}

export default AuthorInfo;