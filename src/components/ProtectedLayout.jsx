
import Navbar from "./Navbar";

function ProtectedLayout({ children }) {
  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gray-50">

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="w-full min-w-0">
        {children}
      </main>

    </div>
  );
}

export default ProtectedLayout;
