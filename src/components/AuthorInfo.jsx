import { useNavigate } from "react-router-dom";

function AuthorInfo({ author, userId }) {
  const navigate = useNavigate();

  const firstLetter = author
    ? author.charAt(0).toUpperCase()
    : "?";

  const openPersonalChat = () => {
    if (!userId) {
      console.error("Author user ID is missing");
      return;
    }

    navigate(`/personal-chat/${userId}`);
  };

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow">
        {firstLetter}
      </div>

      {/* User Details */}
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">
          {author || "Anonymous"}
        </h4>

        <p className="text-sm text-gray-500">
          Startup Creator
        </p>
      </div>

      {/* Message Button */}
      <button
        onClick={openPersonalChat}
        className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
      >
        💬 Message
      </button>
    </div>
  );
}

export default AuthorInfo;