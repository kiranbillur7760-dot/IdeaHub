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
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-md">

      <div className="max-w-7xl mx-auto px-6">

        <div className="h-20 flex justify-between items-center">

          {/* Logo */}

          <Link
            to="/home"
            className="flex items-center gap-3 group"
          >

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition">
              💡
            </div>

            <div>

              <h1 className="text-2xl font-extrabold text-gray-800">
                IdeaHub
              </h1>

              <p className="text-xs text-gray-500">
                Build • Collaborate • Launch
              </p>

            </div>

          </Link>

          {/* Navigation */}

          <div className="flex items-center gap-3">

            <Link
              to="/home"
              title="Home"
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl hover:bg-blue-100 transition"
            >
              🏠
            </Link>

            <Link
              to="/explore"
              title="Explore"
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl hover:bg-blue-100 transition"
            >
              🔍
            </Link>

            <Link
              to="/trending"
              title="Trending"
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl hover:bg-orange-100 transition"
            >
              🔥
            </Link>

            {token ? (
              <>

                <Link
                  to="/saved"
                  title="Saved Ideas"
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl hover:bg-yellow-100 transition"
                >
                  🔖
                </Link>

                <Link
                  to="/create-idea"
                  title="Create Idea"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:scale-105 transition shadow-lg"
                >
                  + Create
                </Link>

                <NotificationBell />

                <Link
                  to="/profile"
                  title="Profile"
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center shadow-lg hover:scale-105 transition"
                >
                  {user?.name
                    ? user.name.charAt(0).toUpperCase()
                    : "👤"}
                </Link>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition shadow"
                >
                  Logout
                </button>

              </>
            ) : (
              <>

                <Link
                  to="/"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-5 py-2 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                >
                  Register
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