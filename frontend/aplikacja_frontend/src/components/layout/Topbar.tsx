export default function Topbar() {
  return (
    <header className="h-20 border-b border-gray-800 bg-[#111827] flex items-center justify-between px-8">

      <div>

        <h2 className="text-2xl font-bold">
          Dashboard
        </h2>

        <p className="text-gray-400 text-sm">
          Zarządzanie AI sklepem z dronami DJI
        </p>

      </div>

      <div className="flex items-center gap-4">

        <button className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700">
          🔔
        </button>

        <button className="w-10 h-10 rounded-full bg-blue-600">
          A
        </button>

      </div>

    </header>
  );
}