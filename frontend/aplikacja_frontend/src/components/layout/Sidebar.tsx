export default function Sidebar() {
  return (
    <aside className="w-72 bg-[#111827] border-r border-gray-800 flex flex-col">

      <div className="h-20 flex items-center px-8 border-b border-gray-800">

        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xl">
          🚁
        </div>

        <div className="ml-4">
          <h1 className="font-bold text-lg">
            AI DJI Store
          </h1>

          <p className="text-xs text-gray-400">
            Admin Dashboard
          </p>
        </div>

      </div>

      <nav className="flex-1 px-4 py-6">

        <button className="w-full text-left px-4 py-3 rounded-xl bg-blue-600 mb-2">
          Dashboard
        </button>

        <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-800 mb-2">
          Orders
        </button>

        <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-800 mb-2">
          Products
        </button>

        <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-800 mb-2">
          Conversations
        </button>

        <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-800 mb-2">
          Analytics
        </button>

        <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-800">
          Settings
        </button>

      </nav>

    </aside>
  );
}