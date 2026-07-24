interface Message {
  role: string;
  content: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

interface ConversationCardProps {
  threadId: string;
  email: string;
  currentProduct: string;
  messages: Message[];
}

export default function ConversationCard({
  threadId,
  email,
  currentProduct,
  messages,
}: ConversationCardProps) {
  const lastMessage = messages[messages.length - 1];

  const lastMessageDate = lastMessage
    ? new Date(lastMessage.createdAt._seconds * 1000)
    : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition p-5">

      <div className="flex items-center justify-between mb-4">

        <h2 className="text-lg font-bold text-gray-900">
          {email}
        </h2>

        <span className="text-xs text-gray-500">
          {threadId.slice(0, 8)}...
        </span>

      </div>

      <div className="space-y-3 text-sm">

        <div>
          <p className="text-gray-500">
            Aktualny produkt
          </p>

          <p className="font-semibold">
            {currentProduct || "Brak"}
          </p>
        </div>

        <div>
          <p className="text-gray-500">
            Ostatnia wiadomość
          </p>

          <p className="line-clamp-4 text-gray-800">
            {lastMessage?.content || "Brak wiadomości"}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">

          <span className="text-gray-500">
            Liczba wiadomości
          </span>

          <span className="font-semibold">
            {messages.length}
          </span>

        </div>

        {lastMessageDate && (
          <div className="text-xs text-gray-400">
            {lastMessageDate.toLocaleString("pl-PL")}
          </div>
        )}

      </div>

    </div>
  );
}