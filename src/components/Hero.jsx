import { Link } from "react-router-dom";
import { FaRocket, FaLightbulb, FaUsers } from "react-icons/fa";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white">

      {/* Background Blur */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-24">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Side */}
          <div>

            <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur">
              🚀 Build the Future Together
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Turn Your
              <span className="text-yellow-300"> Ideas </span>
              Into Successful
              <br />
              Startups
            </h1>

            <p className="mt-6 text-lg text-blue-100 leading-8 max-w-xl">
              IdeaHub connects innovators, developers, designers,
              entrepreneurs, and investors to collaborate on
              groundbreaking startup ideas.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <Link
                to="/explore"
                className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:scale-105 transition shadow-xl"
              >
                Explore Ideas
              </Link>

              <Link
                to="/create"
                className="border-2 border-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-700 transition"
              >
                Share Your Idea
              </Link>

            </div>

          </div>

          {/* Right Side */}
          <div className="grid gap-6">

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">

              <div className="flex items-center gap-4">

                <div className="bg-yellow-400 text-black p-4 rounded-xl text-2xl">
                  <FaLightbulb />
                </div>

                <div>
                  <h3 className="font-bold text-xl">
                    1000+ Startup Ideas
                  </h3>

                  <p className="text-blue-100">
                    Discover innovative ideas from creators worldwide.
                  </p>
                </div>

              </div>

            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">

              <div className="flex items-center gap-4">

                <div className="bg-green-400 text-black p-4 rounded-xl text-2xl">
                  <FaUsers />
                </div>

                <div>
                  <h3 className="font-bold text-xl">
                    Collaborate with Teams
                  </h3>

                  <p className="text-blue-100">
                    Join projects and build startups together.
                  </p>
                </div>

              </div>

            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">

              <div className="flex items-center gap-4">

                <div className="bg-red-400 text-black p-4 rounded-xl text-2xl">
                  <FaRocket />
                </div>

                <div>
                  <h3 className="font-bold text-xl">
                    Launch Your Startup
                  </h3>

                  <p className="text-blue-100">
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