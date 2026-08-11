import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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

    setMenuOpen(false);
    navigate("/", { replace: true });
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm relative z-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="min-h-20 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link
            to="/home"
            onClick={closeMenu}
            className="flex items-center gap-2 sm:gap-3 min-w-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg">
              💡
            </div>

            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800">
                IdeaHub
              </h1>

              <p className="hidden sm:block text-xs text-gray-500 whitespace-nowrap">
                Build • Collaborate • Launch
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">

            {/* Home */}
            <Link
              to="/home"
              title="Home"
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl hover:bg-blue-100 transition"
            >
              🏠
            </Link>

            {/* Explore */}
            <Link
              to="/explore"
              title="Explore"
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl hover:bg-blue-100 transition"
            >
              🔍
            </Link>

            {/* Social */}
            <Link
              to="/social"
              title="Social"
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl hover:bg-pink-100 transition"
            >
              📱
            </Link>

            {/* Trending */}
            <Link
              to="/trending"
              title="Trending"
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl hover:bg-orange-100 transition"
            >
              🔥
            </Link>

            {token && (
              <>
                {/* Saved Ideas */}
                <Link
                  to="/saved"
                  title="Saved Ideas"
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl hover:bg-yellow-100 transition"
                >
                  🔖
                </Link>

                {/* Create Idea */}
                <Link
                  to="/create-idea"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg whitespace-nowrap"
                >
                  + Create
                </Link>

                {/* Notifications */}
                <NotificationBell />

                {/* Profile */}
                <Link
                  to="/profile"
                  title="Profile"
                  className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center shadow-lg"
                >
                  {user?.name
                    ? user.name.charAt(0).toUpperCase()
                    : "👤"}
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="px-4 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition shadow whitespace-nowrap"
                >
                  Logout
                </button>
              </>
            )}

            {!token && (
              <>
                {/* Login */}
                <Link
                  to="/"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition whitespace-nowrap"
                >
                  Login
                </Link>

                {/* Register */}
                <Link
                  to="/register"
                  className="px-4 py-2.5 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition whitespace-nowrap"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex-shrink-0 w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col gap-2">

              {/* Home */}
              <Link
                to="/home"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-gray-700 font-medium"
              >
                🏠
                <span>Home</span>
              </Link>

              {/* Explore */}
              <Link
                to="/explore"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-gray-700 font-medium"
              >
                🔍
                <span>Explore</span>
              </Link>

              {/* Social */}
              <Link
                to="/social"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-pink-50 text-gray-700 font-medium"
              >
                📱
                <span>Social</span>
              </Link>

              {/* Trending */}
              <Link
                to="/trending"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 text-gray-700 font-medium"
              >
                🔥
                <span>Trending</span>
              </Link>

              {token && (
                <>
                  {/* Saved Ideas */}
                  <Link
                    to="/saved"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-yellow-50 text-gray-700 font-medium"
                  >
                    🔖
                    <span>Saved Ideas</span>
                  </Link>

                  {/* Create Idea */}
                  <Link
                    to="/create-idea"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold"
                  >
                    ➕
                    <span>Create Idea</span>
                  </Link>

                  {/* Notifications */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl">
                    <NotificationBell />
                    <span className="text-gray-700 font-medium">
                      Notifications
                    </span>
                  </div>

                  {/* Profile */}
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-gray-700 font-medium"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center">
                      {user?.name
                        ? user.name.charAt(0).toUpperCase()
                        : "👤"}
                    </div>

                    <span>Profile</span>
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600"
                  >
                    🚪
                    <span>Logout</span>
                  </button>
                </>
              )}

              {!token && (
                <>
                  {/* Login */}
                  <Link
                    to="/"
                    onClick={closeMenu}
                    className="text-center px-5 py-3 rounded-xl bg-blue-600 text-white font-medium"
                  >
                    Login
                  </Link>

                  {/* Register */}
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="text-center px-5 py-3 rounded-xl border border-blue-600 text-blue-600 font-medium"
                  >
                    Register
                  </Link>
                </>
              )}

            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;