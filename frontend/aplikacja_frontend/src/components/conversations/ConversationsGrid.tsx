import ConversationCard from "./ConversationCard";

interface Conversation {
  threadId: string;
  customerName: string;
  customerEmail: string;
  lastMessage: string;
  productName: string;
  updatedAt: string;
}

interface ConversationsGridProps {
  conversations: Conversation[];
}

export default function ConversationsGrid({
  conversations,
}: ConversationsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

      {conversations.map((conversation) => (
        <ConversationCard
          key={conversation.threadId}
          threadId={conversation.threadId}
          customerName={conversation.customerName}
          customerEmail={conversation.customerEmail}
          lastMessage={conversation.lastMessage}
          productName={conversation.productName}
          updatedAt={conversation.updatedAt}
        />
      ))}

    </div>
  );
}