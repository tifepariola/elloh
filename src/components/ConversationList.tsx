import { getContact, listConversations } from "@/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Conversation } from "@/types";
import { MessageCircleMore } from "lucide-react";
import { useEffect, useState } from "react";
import { NewChatModal } from "./NewChatModal";
import PlatformLogo from "./PlatformLogo";
type ConversationListProps = {
  onSelect: (conv: Conversation) => void;
  className?: string;
};


export default function ConversationList({ onSelect, className = "" }: ConversationListProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv)
    onSelect(conv);
  }

  const getConversations = async () => {
    try {
      setIsLoading(true);
      const data = await listConversations();
      console.log('Conversations data:', data);
      const conversationsData = data.conversations || [];

      // Fetch contact details for each conversation
      const conversationsWithContacts = await Promise.all(
        conversationsData.map(async (conv: Conversation) => {
          try {
            const contactData = await getContact(conv.contactID);
            return {
              ...conv,
              contact: contactData
            };
          } catch (error) {
            console.error(`Error fetching contact for ${conv.contactID}:`, error);
            return conv;
          }
        })
      );

      setConversations(conversationsWithContacts as Conversation[]);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    console.log('getConversations')
    getConversations();
  }, []);

  return (
    <div className={`w-full md:w-[300px] bg-white ${className} border-r flex flex-col`}>
      <header className="p-4 flex justify-between">
        <h2 className="text-md font-normal">Conversations</h2>
        <Button variant={"ghost"} onClick={() => setIsModalOpen(true)} className="">
          <MessageCircleMore className="size-5" />
          <label className="sr-only">New Chat</label>
        </Button>
      </header>
      <div className="divide-y-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading conversations...
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No conversations yet
          </div>
        ) : (
          conversations.map((conv: Conversation) => (
            <div
              key={conv.id}
              className={`flex gap-3 p-4 hover:bg-accent cursor-pointer ${selectedConversation?.id === conv.id ? "bg-accent" : ""}`}
              onClick={() => handleSelectConversation(conv)}
            >
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>
                    {conv.contact?.computedDisplayName?.[0] || conv.contactID[0]}
                  </AvatarFallback>
                </Avatar>
                <PlatformLogo platform={conv.platform} className="size-3 absolute bottom-0 right-0" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm font-medium">
                  <span>{conv.contact?.computedDisplayName || conv.contactID}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {conv.platform} • {conv.status}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <NewChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </div>
    // {selectedConversation && (
    //   <ChatWindow
    //     conversation={selectedConversation}
    //     onBack={handleBack}
    //     className="block sm:hidden"
    //   />
    // )}
  )
}