import StatCard from "./StatCard";


interface Stat {
  title: string;
  value: number | string;
  description?: string;
}


interface StatsGridProps {
  stats: Stat[];
}


export default function StatsGrid({ stats }: StatsGridProps) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          description={stat.description}
        />
      ))}

    </div>
  );
}