import { getContact, listConversations } from "@/api";
import { Button } from "@/components/ui/button";
import { Conversation, Event } from "@/types";
import { ImageIcon, MessageCircle, MessageCircleMore } from "lucide-react";
import { useEffect, useState } from "react";
import { NewChatModal } from "./NewChatModal";
import { StatusIcon } from "./StatusIcon";
import UserAvatar from "./UserAvatar";

type ConversationListProps = {
  onSelect: (conv: Conversation) => void;
  selectedConversation: Conversation | null;
  className?: string;
};

export default function ConversationList({ onSelect, selectedConversation, className = "" }: ConversationListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);


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
                onClick={() => onSelect(conv)}
              >
                {/* Avatar */}
                <UserAvatar name={conv.contact?.computedDisplayName || conv.contactID || ""} platform={conv.platform} className="w-12 h-12" />

                {/* Conversation Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 truncate">
                      {conv.contact?.computedDisplayName || conv.contactID}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {_buildLastEvent(conv.lastEvent)}
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

function _buildLastEvent(event: Event | undefined) {
  if (!event) return null;
  switch (event.message?.body.type) {
    case "text":
      if (event.actorType === "agent") {
        return <div className="flex flex-row items-center gap-1 text-gray-500">
          <StatusIcon status={event.message?.status || "sending"} className="flex-shrink-0" />
          <span className="truncate">{event.message?.body.text}</span>
        </div>;
      }
      return event.message?.body.text;
    case "image":
      if (event.actorType === "agent") {
        return <div className="flex flex-row items-center gap-1 text-gray-500">
          <StatusIcon status={event.message?.status || "sending"} className="flex-shrink-0" />
          <ImageIcon className="size-4 text-gray-500 flex-shrink-0" />
          <span className="truncate">{event.message?.body.image.text || "Photo"}</span>
        </div>;
      }
      return <div className="flex flex-row items-center gap-1 text-gray-500">
        <ImageIcon className="size-4 text-gray-500 flex-shrink-0" />
        <span className="truncate">{event.message?.body.image.text || "Photo"}</span>
      </div>;
    default:
      return "Unknown";
  }
}
