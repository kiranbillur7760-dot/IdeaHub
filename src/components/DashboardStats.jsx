import StatsCard from "./StatsCard";

function DashboardStats() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatsCard
          title="Ideas"
          value="12"
          icon="💡"
          color="bg-blue-100"
        />

        <StatsCard
          title="Projects"
          value="3"
          icon="📁"
          color="bg-green-100"
        />

        <StatsCard
          title="Likes"
          value="45"
          icon="❤️"
          color="bg-red-100"
        />

        <StatsCard
          title="Comments"
          value="18"
          icon="💬"
          color="bg-yellow-100"
        />
      </div>
    </section>
  );
}

export default DashboardStats;