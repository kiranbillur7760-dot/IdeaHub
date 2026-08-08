
import Navbar from "./Navbar";

function ProtectedLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        {children}
      </main>
    </div>
  );
}

export default ProtectedLayout;

