interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
}


export default function StatCard({
  title,
  value,
  description,
}: StatCardProps) {

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">

      <p className="text-sm text-gray-500">
        {title}
      </p>


      <h2 className="text-3xl font-bold mt-3 text-gray-900">
        {value}
      </h2>


      {description && (
        <p className="text-sm text-gray-400 mt-2">
          {description}
        </p>
      )}

    </div>
  );
}