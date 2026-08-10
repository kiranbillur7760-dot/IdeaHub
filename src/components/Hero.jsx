
import { Link } from "react-router-dom";
import { FaRocket, FaLightbulb, FaUsers } from "react-icons/fa";

function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-purple-700 text-white">

      {/* Background Blur */}
      <div className="absolute -top-20 -left-20 w-48 h-48 sm:w-72 sm:h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="absolute -bottom-20 -right-20 w-64 h-64 sm:w-96 sm:h-96 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ================= LEFT SIDE ================= */}
          <div className="w-full min-w-0">

            <span className="inline-block bg-white/20 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-5 sm:mb-6 backdrop-blur">
              🚀 Build the Future Together
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight break-words">
              Turn Your
              <span className="text-yellow-300"> Ideas </span>
              Into Successful
              <br className="hidden sm:block" />
              Startups
            </h1>

            <p className="mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg text-blue-100 leading-7 sm:leading-8 max-w-xl">
              IdeaHub connects innovators, developers, designers,
              entrepreneurs, and investors to collaborate on
              groundbreaking startup ideas.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-7 sm:mt-10">

              <Link
                to="/explore"
                className="w-full sm:w-auto text-center bg-white text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:scale-105 transition shadow-xl"
              >
                Explore Ideas
              </Link>

              <Link
                to="/create-idea"
                className="w-full sm:w-auto text-center border-2 border-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-white hover:text-blue-700 transition"
              >
                Share Your Idea
              </Link>

            </div>

          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="w-full min-w-0 grid gap-4 sm:gap-6">

            {/* Startup Ideas */}
            <div className="w-full bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl">

              <div className="flex items-start gap-3 sm:gap-4">

                <div className="flex-shrink-0 bg-yellow-400 text-black p-3 sm:p-4 rounded-xl text-xl sm:text-2xl">
                  <FaLightbulb />
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-lg sm:text-xl">
                    1000+ Startup Ideas
                  </h3>

                  <p className="text-blue-100 text-sm sm:text-base mt-1">
                    Discover innovative ideas from creators worldwide.
                  </p>
                </div>

              </div>

            </div>

            {/* Collaborate */}
            <div className="w-full bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl">

              <div className="flex items-start gap-3 sm:gap-4">

                <div className="flex-shrink-0 bg-green-400 text-black p-3 sm:p-4 rounded-xl text-xl sm:text-2xl">
                  <FaUsers />
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-lg sm:text-xl">
                    Collaborate with Teams
                  </h3>

                  <p className="text-blue-100 text-sm sm:text-base mt-1">
                    Join projects and build startups together.
                  </p>
                </div>

              </div>

            </div>

            {/* Launch */}
            <div className="w-full bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl">

              <div className="flex items-start gap-3 sm:gap-4">

                <div className="flex-shrink-0 bg-red-400 text-black p-3 sm:p-4 rounded-xl text-xl sm:text-2xl">
                  <FaRocket />
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-lg sm:text-xl">
                    Launch Your Startup
                  </h3>

                  <p className="text-blue-100 text-sm sm:text-base mt-1">
                    Transform ideas into successful businesses.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;
