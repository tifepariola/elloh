import ChatWindow from "@/components/ChatWindow";
import ConversationList from "@/components/ConversationList";
import SvgLogo from "@/components/SvgLogo";
import Topbar from "@/components/Topbar";
import { useState } from "react";

export default function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);

  return (
    <div className="h-dvh flex flex-col bg-mine-shaft-900">
      <Topbar />
      <div className="flex flex-1 overflow-hidden border-6 border-mine-shaft-900 rounded-xl">
        
        {/* Conversation List (desktop always visible, mobile hidden when chat is open) */}
        <ConversationList
          onSelect={setSelectedConversation}
          className={`${selectedConversation ? "hidden" : "flex"} sm:flex w-full sm:w-[300px]`}
        />

        {/* Single ChatWindow instance */}
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            onBack={() => setSelectedConversation(null)}
            className="flex flex-1"
          />
        ) : (
          <div className="hidden sm:flex flex-1 bg-white justify-center items-center">
            <SvgLogo className="h-8 w-auto fill-mine-shaft-800" />
          </div>
        )}
      </div>
    </div>
  );
}