import StatCard from "./StatCard";


export default function StatsGrid() {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      <StatCard
        title="Zamówienia"
        value={0}
        description="Wszystkie zamówienia"
      />


      <StatCard
        title="Produkty"
        value={0}
        description="Produkty w magazynie"
      />


      <StatCard
        title="Klienci"
        value={0}
        description="Obsłużeni klienci"
      />


      <StatCard
        title="Rozmowy AI"
        value={0}
        description="Automatyczne odpowiedzi"
      />

    </div>
  );
}