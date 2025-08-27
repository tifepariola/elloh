import ChatWindow from "@/components/ChatWindow";
import ConversationList from "@/components/ConversationList";
import SvgLogo from "@/components/SvgLogo";
import { AgentProvider } from "@/providers/AgentProvider";
import { useState } from "react";

export default function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);

  return (
    <AgentProvider> 
    <div className="flex h-full">
       {/* Conversation List (desktop always visible, mobile hidden when chat is open) */}
      <ConversationList
        onSelect={setSelectedConversation}
        selectedConversation={selectedConversation}
        className={`${selectedConversation ? "hidden md:flex" : "flex"}`}
      />

      {/* Single ChatWindow instance */}
      {selectedConversation ? (
        <ChatWindow
          conversation={selectedConversation}
          onBack={() => setSelectedConversation(null)}
          className="flex flex-1"
        />
      ) : (
        <div className="hidden md:flex flex-1 bg-white justify-center items-center">
          <SvgLogo className="h-8 w-auto fill-mine-shaft-800" />
        </div>
      )}
    </div>
    </AgentProvider>
  );
}