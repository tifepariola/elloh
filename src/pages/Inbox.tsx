import ChatWindow from "@/components/ChatWindow";
import ConversationList from "@/components/ConversationList";
import Topbar from "@/components/Topbar";
import { useState } from "react";
import SvgLogo from "@/components/SvgLogo";


export default function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState<Object | null>(null);

  return (
    <div className="h-dvh flex flex-col bg-mine-shaft-900">
      <Topbar />
      <div className="flex flex-1 overflow-hidden border-6 border-mine-shaft-900 rounded-xl">
        {/* show conversation list on desktop */}
        <ConversationList onSelect={setSelectedConversation} className="hidden sm:flex" />
        {/* show chat on mobile */}
        {selectedConversation && (
          <ChatWindow conversation={selectedConversation} onBack={() => setSelectedConversation(null)} className="flex sm:hidden" />
        )}
        {/* show conversation list on mobile */}
        {!selectedConversation && <ConversationList onSelect={setSelectedConversation} className="flex sm:hidden" />}
        {/* show chat on desktop */}
        {selectedConversation ? (
          <ChatWindow conversation={selectedConversation} onBack={() => setSelectedConversation(null)} className="hidden sm:flex" />
        ) :
          <div className={`flex flex-1 flex-col bg-white justify-center items-center hidden sm:flex`}>
            <SvgLogo className="h-8 w-auto fill-mine-shaft-800" />
          </div>
        }
      </div>
    </div>
  );
}