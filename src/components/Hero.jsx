import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white">

      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">

        {/* Small Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-6">
          <span>💡</span>
          <span className="text-sm font-medium">
            Where Ideas Become Reality
          </span>
        </div>


        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          Turn Ideas Into
          <span className="block text-yellow-300">
            Reality 🚀
          </span>
        </h1>


        {/* Description */}
        <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
          IdeaHub is a platform where innovators, students,
          developers and entrepreneurs can share ideas,
          discover inspiration and build the future together.
        </p>


        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">

          {/* Explore */}
          <button
            onClick={() => navigate("/explore")}
            className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 hover:shadow-xl transition duration-300"
          >
            🔍 Explore Ideas
          </button>


          {/* Create */}
          <button
            onClick={() => navigate("/create-idea")}
            className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 hover:scale-105 hover:shadow-xl transition duration-300"
          >
            💡 Share Your Idea
          </button>

        </div>


        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
            <div className="text-3xl font-bold">
              💡
            </div>
            <p className="mt-2 text-blue-100">
              Share Ideas
            </p>
          </div>


          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
            <div className="text-3xl font-bold">
              🤝
            </div>
            <p className="mt-2 text-blue-100">
              Connect & Collaborate
            </p>
          </div>


          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
            <div className="text-3xl font-bold">
              🚀
            </div>
            <p className="mt-2 text-blue-100">
              Build the Future
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;