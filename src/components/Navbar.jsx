import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out successfully!");

    navigate("/login");

    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link to="/">
          <h1 className="text-3xl font-bold text-blue-600">
            IdeaHub
          </h1>
        </Link>

        <ul className="flex gap-8 items-center font-medium">

          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/explore">Explore</Link>
          </li>

          {token ? (
            <>
              <li>
                <Link to="/create-idea">Create Idea</Link>
              </li>

              <li>
                <Link to="/profile">
                  {user?.name || "Profile"}
                </Link>
              </li>

              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}

        </ul>

      </div>
    </nav>
  );
}

export default Navbar;