interface ConversationCardProps {
  threadId: string;
  customerName: string;
  customerEmail: string;
  lastMessage: string;
  productName: string;
  updatedAt: string;
}

export default function ConversationCard({
  threadId,
  customerName,
  customerEmail,
  lastMessage,
  productName,
  updatedAt,
}: ConversationCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition duration-300">

      <div className="p-5 space-y-4">

        <div>

          <h2 className="text-xl font-bold text-gray-900">
            {customerName}
          </h2>

          <p className="text-sm text-gray-500">
            {customerEmail}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Produkt
          </p>

          <p className="font-semibold text-gray-900">
            {productName}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500 mb-1">
            Ostatnia wiadomość
          </p>

          <p className="text-gray-700 line-clamp-3">
            {lastMessage}
          </p>

        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">

          <div>

            <p className="text-xs text-gray-400">
              Thread ID
            </p>

            <p className="text-sm font-medium text-gray-700 truncate max-w-[180px]">
              {threadId}
            </p>

          </div>

          <div className="text-right">

            <p className="text-xs text-gray-400">
              Ostatnia aktywność
            </p>

            <p className="text-sm font-medium text-gray-700">
              {updatedAt}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}