
import { useNavigate } from "react-router-dom";

function ClientDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">
            IdeaHub
          </h1>
          <p className="text-sm text-gray-500">
            Client Dashboard
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Welcome */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome, {user?.name || "Client"} 👋
          </h2>

          <p className="text-gray-600 mt-2">
            Discover talented teams and find the right project
            for your business.
          </p>
        </section>

        {/* Action Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Discover Projects */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-4xl mb-4">🔍</div>

            <h3 className="text-xl font-semibold mb-2">
              Discover Projects
            </h3>

            <p className="text-gray-600 mb-5">
              Explore innovative projects created by IdeaHub teams.
            </p>

            <button
              onClick={() => navigate("/explore")}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Explore Projects
            </button>
          </div>

          {/* Find Teams */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-4xl mb-4">👥</div>

            <h3 className="text-xl font-semibold mb-2">
              Find Teams
            </h3>

            <p className="text-gray-600 mb-5">
              Find skilled teams that can turn your requirements
              into real products.
            </p>

            <button
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Find Teams
            </button>
          </div>

          {/* My Projects */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-4xl mb-4">📁</div>

            <h3 className="text-xl font-semibold mb-2">
              My Projects
            </h3>

            <p className="text-gray-600 mb-5">
              Track projects you have hired teams to work on.
            </p>

            <button
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
            >
              My Projects
            </button>
          </div>

        </section>

        {/* Future Features */}
        <section className="mt-10 bg-white rounded-xl shadow p-8">

          <h3 className="text-2xl font-bold mb-4">
            🚀 Coming Soon
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="border rounded-lg p-4">
              💬 <strong>Chat with Teams</strong>
              <p className="text-gray-500 text-sm mt-1">
                Communicate directly with project teams.
              </p>
            </div>

            <div className="border rounded-lg p-4">
              📊 <strong>Project Tracking</strong>
              <p className="text-gray-500 text-sm mt-1">
                Track milestones and project progress.
              </p>
            </div>

            <div className="border rounded-lg p-4">
              💰 <strong>Payments</strong>
              <p className="text-gray-500 text-sm mt-1">
                Secure payments for completed work.
              </p>
            </div>

            <div className="border rounded-lg p-4">
              ⭐ <strong>Reviews</strong>
              <p className="text-gray-500 text-sm mt-1">
                Review teams after project completion.
              </p>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default ClientDashboard;
