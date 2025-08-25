import { getContact, listConversations } from "@/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Conversation } from "@/types";
import { MessageCircle, MessageCircleMore } from "lucide-react";
import { useEffect, useState } from "react";
import { NewChatModal } from "./NewChatModal";
import PlatformLogo from "./PlatformLogo";

type ConversationListProps = {
  onSelect: (conv: Conversation) => void;
  className?: string;
};

export default function ConversationList({ onSelect, className = "" }: ConversationListProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    onSelect(conv);
  };

  const getConversations = async () => {
    try {
      setIsLoading(true);
      const data = await listConversations();
      const conversationsData = data.conversations || [];

      const conversationsWithContacts = await Promise.all(
        conversationsData.map(async (conv: Conversation) => {
          try {
            const contactData = await getContact(conv.contactID);
            return { ...conv, contact: contactData };
          } catch {
            return conv;
          }
        })
      );

      setConversations(conversationsWithContacts as Conversation[]);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getConversations();
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
            {conversations.map((conv: Conversation) => (
              <div
                key={conv.id}
                role="button"
                aria-selected={selectedConversation?.id === conv.id}
                className={`flex gap-3 p-4 cursor-pointer transition-colors ${selectedConversation?.id === conv.id ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                onClick={() => handleSelectConversation(conv)}
              >
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>
                      {conv.contact?.computedDisplayName?.substring(0, 2).toUpperCase() || conv.contactID?.substring(0, 2).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <PlatformLogo platform={conv.platform} className="size-4 absolute bottom-0 right-0" />
                </div>

                {/* Conversation Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-900 truncate">
                      {conv.contact?.computedDisplayName || conv.contactID}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {
                      conv.lastMessage ? conv.lastMessage.body.text :
                        `${conv.platform} • ${conv.status}`}
                  </div>
                </div>
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