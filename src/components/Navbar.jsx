import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Invalid user data");
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out successfully!");

    navigate("/", { replace: true });
  };

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/home"
            className="flex items-center gap-2"
          >
            <span className="text-3xl">💡</span>

            <span className="text-2xl font-bold text-blue-600">
              IdeaHub
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-2">

            {/* Home */}
            <Link
              to="/home"
              title="Home"
              className="w-11 h-11 flex items-center justify-center rounded-xl text-2xl hover:bg-blue-50 hover:text-blue-600 transition"
            >
              🏠
            </Link>

            {/* Explore */}
            <Link
              to="/explore"
              title="Explore Ideas"
              className="w-11 h-11 flex items-center justify-center rounded-xl text-2xl hover:bg-blue-50 hover:text-blue-600 transition"
            >
              🔍
            </Link>

            {/* Trending */}
            <Link
              to="/trending"
              title="Trending Ideas"
              className="w-11 h-11 flex items-center justify-center rounded-xl text-2xl hover:bg-orange-50 transition"
            >
              🔥
            </Link>

            {token ? (
              <>
                {/* Saved Ideas */}
                <Link
                  to="/saved"
                  title="Saved Ideas"
                  className="w-11 h-11 flex items-center justify-center rounded-xl text-2xl hover:bg-yellow-50 transition"
                >
                  🔖
                </Link>

                {/* Create Idea */}
                <Link
                  to="/create-idea"
                  title="Create Idea"
                  className="w-11 h-11 flex items-center justify-center rounded-xl text-2xl hover:bg-green-50 transition"
                >
                  ➕
                </Link>

                {/* Notifications */}
                <NotificationBell />

                {/* Profile */}
                <Link
                  to="/profile"
                  title="Profile"
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition"
                >
                  {user?.name
                    ? user.name.charAt(0).toUpperCase()
                    : "👤"}
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="w-11 h-11 flex items-center justify-center rounded-xl text-2xl hover:bg-red-50 transition"
                >
                  🚪
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <Link
                  to="/"
                  title="Login"
                  className="w-11 h-11 flex items-center justify-center rounded-xl text-2xl hover:bg-blue-50 transition"
                >
                  🔑
                </Link>

                {/* Register */}
                <Link
                  to="/register"
                  title="Register"
                  className="w-11 h-11 flex items-center justify-center rounded-xl text-2xl hover:bg-green-50 transition"
                >
                  📝
                </Link>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;