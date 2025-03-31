import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircleMore } from "lucide-react";
import { useEffect, useState } from "react"
import { NewChatModal } from "./NewChatModal";
import { Button } from "@/components/ui/button";
import { listConversations } from "@/api";

type ConversationListProps = {
  onSelect: (conv: Object) => void;
  className?: string;
};


export default function ConversationList({ onSelect, className = "" }: ConversationListProps) {
  const [selectedConversation, setSelectedConversation] = useState<Object | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conversations, setConversations] = useState([]);

  const handleSelectConversation = (conv: Object) => {
    setSelectedConversation(conv)
    onSelect(conv);
  }


  useEffect(() => {
    const getConversations = async () => {
      const data = await listConversations();
      console.log(data.conversations)
      setConversations(data.conversations);
    };
    getConversations();
  }, []);

  return (
    <div className={`w-full md:w-[300px] bg-white ${className} border-r flex flex-col ${selectedConversation ? 'hidden' : 'block'}`}>
      <header className="p-4 flex justify-between">
        <h2 className="text-md font-normal">Conversations</h2>
        <Button variant={"ghost"} onClick={() => setIsModalOpen(true)} className="">
          <MessageCircleMore className="size-5" />
          <label className="sr-only">New Chat</label>
        </Button>
      </header>
      <div className="divide-y-1 overflow-y-auto">
        {conversations.map((conv, idx) => (
          <div
            key={idx}
            className="flex gap-3 p-4 hover:bg-accent cursor-pointer"
            onClick={() => handleSelectConversation(conv)}
          >
            <Avatar className="w-10 h-10">
              <AvatarFallback>{conv.contactID[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between text-sm font-medium">
                <span>{conv.contactID}</span>
              </div>
              {/* <div className="text-sm text-muted-foreground">{conv.messages[conv.messages.length - 1]?.text}</div> */}
            </div>
          </div>
        ))}
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