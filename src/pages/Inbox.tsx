import ChatWindow from "@/components/ChatWindow";
import ConversationList from "@/components/ConversationList";
import Topbar from "@/components/Topbar";
import { useState } from "react";

type Message = {
  id: number;
  text: string;
  isCurrentUser: boolean;
  sender: string;
};

type Conversation = {
  sender: string;
  messages: Message[];
};

export default function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  return (
    <div className="h-dvh flex flex-col bg-mine-shaft-900">
      <Topbar />
      <div className="flex flex-1 overflow-hidden border-6 border-mine-shaft-900 rounded-xl">
        {/* show conversation list on desktop */}
        <ConversationList onSelect={setSelectedConversation} className="hidden sm:block" />
        {/* show chat on mobile */}
        {selectedConversation && (
          <ChatWindow conversation={selectedConversation} onBack={() => setSelectedConversation(null)} className="flex sm:hidden" />
        )}
        {/* show conversation list on mobile */}
        {!selectedConversation && <ConversationList onSelect={setSelectedConversation} className="block sm:hidden" />}
        {/* show chat on desktop */}
        {selectedConversation && (
          <ChatWindow conversation={selectedConversation} onBack={() => setSelectedConversation(null)} className="hidden sm:flex" />
        )}
      </div>
    </div>
  );
}