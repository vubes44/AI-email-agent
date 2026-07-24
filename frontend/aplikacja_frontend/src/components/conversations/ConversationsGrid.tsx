import ConversationCard from "./ConversationCard";

interface Message {
  role: string;
  content: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

interface Conversation {
  threadId: string;
  email: string;
  currentProduct: string;
  messages: Message[];
}

interface ConversationsGridProps {
  conversations: Conversation[];
}

export default function ConversationsGrid({
  conversations,
}: ConversationsGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {conversations.map((conversation) => (
        <ConversationCard
          key={conversation.threadId}
          threadId={conversation.threadId}
          email={conversation.email}
          currentProduct={conversation.currentProduct}
          messages={conversation.messages}
        />
      ))}
    </div>
  );
}