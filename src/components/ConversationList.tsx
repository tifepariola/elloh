import { Button } from "@/components/ui/button";
import { useConversations } from "@/hooks/useConversations";
import type { Conversation as ConversationType } from "@/types";
import { MessageCircle, MessageCircleMore } from "lucide-react";
import { useEffect, useState } from "react";
import Conversation from "./Conversation";
import { NewChatModal } from "./NewChatModal";
import UserAvatar from "./UserAvatar";

type ConversationListProps = {
  onSelect: (conv: ConversationType) => void;
  selectedConversation: ConversationType | null;
  className?: string;
};

export default function ConversationList({ onSelect, selectedConversation, className = "" }: ConversationListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { conversations, getConversations, isLoading } = useConversations();

  useEffect(() => {
    getConversations(true);
    const interval = setInterval(getConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-full md:w-[320px] border-r flex flex-col ${className}`}>
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b h-18">
        <h2 className="text-lg font-semibold">Conversations</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(true)} aria-label="New Chat">
          <MessageCircleMore className="size-5" />
        </Button>
      </header>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mb-3"></div>
            Loading conversations...
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <MessageCircle className="h-10 w-10 mb-3 text-gray-400" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs text-gray-400">Start a new one by clicking the button above</p>
          </div>
        ) : (
          <div className="divide-y">
            {conversations.map((conv: ConversationType) => (
              <div
                key={conv.id}
                role="button"
                aria-selected={selectedConversation?.id === conv.id}
                className={`flex gap-3 p-4 cursor-pointer transition-colors ${selectedConversation?.id === conv.id ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                onClick={() => onSelect(conv)}
              >
                {/* Avatar */}
                <UserAvatar name={conv.contact?.computedDisplayName || conv.contactID || ""} platform={conv.platform} className="w-12 h-12" />

                {/* Conversation Info */}
                <Conversation conv={conv} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      <NewChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}


