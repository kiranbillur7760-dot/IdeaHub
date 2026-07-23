function Features() {
  const features = [
    {
      title: "Share Ideas",
      description: "Post your innovative ideas with the community.",
      icon: "💡",
    },
    {
      title: "Collaborate",
      description: "Connect with people who share your vision.",
      icon: "🤝",
    },
    {
      title: "Grow Together",
      description: "Turn ideas into real-world projects and startups.",
      icon: "🚀",
    },
  ];

  return (
    <section className="py-20 bg-gray-100">
      <h2 className="text-4xl font-bold text-center mb-12">
        Why Choose IdeaHub?
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-xl shadow-lg hover:scale-105 transition duration-300"
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;