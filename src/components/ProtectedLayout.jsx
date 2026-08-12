import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function ProtectedLayout({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (event) => {
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
    };

    const handleTouchEnd = (event) => {
      const endX = event.changedTouches[0].clientX;
      const endY = event.changedTouches[0].clientY;

      const distanceX = endX - startX;
      const distanceY = endY - startY;

      // Swipe from LEFT → RIGHT
      if (
        distanceX > 100 &&
        Math.abs(distanceX) > Math.abs(distanceY)
      ) {
        navigate(-1);
      }
    };

    document.addEventListener(
      "touchstart",
      handleTouchStart,
      { passive: true }
    );

    document.addEventListener(
      "touchend",
      handleTouchEnd,
      { passive: true }
    );

    return () => {
      document.removeEventListener(
        "touchstart",
        handleTouchStart
      );

      document.removeEventListener(
        "touchend",
        handleTouchEnd
      );
    };
  }, [navigate]);

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