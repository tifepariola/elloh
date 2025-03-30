import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircleMore } from "lucide-react";
import { useState } from "react"
import { NewChatModal } from "./NewChatModal";
import { Button } from "@/components/ui/button";

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
type ConversationListProps = {
  onSelect: (conv: Conversation) => void;
  className?: string;
};

const conversations: Conversation[] = [
  {
    sender: "Blessing Pariola",
    messages: [
      {
        id: 1,
        text: "Hi, I have a question about..",
        isCurrentUser: false,
        sender: "Blessing Pariola"
      },
      {
        id: 2,
        text: "Sure, how can I help?",
        isCurrentUser: true,
        sender: "Support"
      },
      {
        id: 2,
        text: "Sure, how can I help?",
        isCurrentUser: true,
        sender: "Support"
      }
    ]
  },
  {
    sender: "Lolade Pariolass",
    messages: [
      {
        id: 1,
        text: "Hey, I love youssr product..",
        isCurrentUser: false,
        sender: "Lolade Pariola"
      }
    ]
  },
  {
    sender: "Lolade Pariola",
    messages: [
      {
        id: 1,
        text: "Hey, I love your product..",
        isCurrentUser: false,
        sender: "Lolade Pariola"
      }
    ]
  },
  {
    sender: "Lolade Pariola",
    messages: [
      {
        id: 1,
        text: "Hey, I love your product..",
        isCurrentUser: false,
        sender: "Lolade Pariola"
      }
    ]
  },
  {
    sender: "Lolade Pariola",
    messages: [
      {
        id: 1,
        text: "Hey, I love your product..",
        isCurrentUser: false,
        sender: "Lolade Pariola"
      }
    ]
  },
  {
    sender: "Lolade Pariola",
    messages: [
      {
        id: 1,
        text: "Hey, I love your product..",
        isCurrentUser: false,
        sender: "Lolade Pariola"
      }
    ]
  },
  {
    sender: "Lolade Pariola",
    messages: [
      {
        id: 1,
        text: "Hey, I love your product..",
        isCurrentUser: false,
        sender: "Lolade Pariola"
      }
    ]
  },
  {
    sender: "Lolade Pariola",
    messages: [
      {
        id: 1,
        text: "Hey, I love your product..",
        isCurrentUser: false,
        sender: "Lolade Pariola"
      }
    ]
  },
  {
    sender: "Lolade Pariola",
    messages: [
      {
        id: 1,
        text: "Hey, I love your product..",
        isCurrentUser: false,
        sender: "Lolade Pariola"
      }
    ]
  },
  {
    sender: "Lolade Pariola",
    messages: [
      {
        id: 1,
        text: "Hey, I love your product..",
        isCurrentUser: false,
        sender: "Lolade Pariola"
      }
    ]
  },
  {
    sender: "Lolade Pariola",
    messages: [
      {
        id: 1,
        text: "Hey, I love your product..",
        isCurrentUser: false,
        sender: "Lolade Pariola"
      }
    ]
  },
  {
    sender: "Lolade Pariola",
    messages: [
      {
        id: 1,
        text: "Hey, I love your product..",
        isCurrentUser: false,
        sender: "Lolade Pariola"
      }
    ]
  },
  {
    sender: "Lolade Pariola",
    messages: [
      {
        id: 1,
        text: "Hey, I love your product..",
        isCurrentUser: false,
        sender: "Lolade Pariola"
      }
    ]
  },
  {
    sender: "Lolade Pariola",
    messages: [
      {
        id: 1,
        text: "Hey, I love your product..",
        isCurrentUser: false,
        sender: "Lolade Pariola"
      }
    ]
  },
  {
    sender: "Lolade Pariola",
    messages: [
      {
        id: 1,
        text: "Hey, I love your product..",
        isCurrentUser: false,
        sender: "Lolade Pariola"
      }
    ]
  },
  {
    sender: "Lolade Pariola",
    messages: [
      {
        id: 1,
        text: "Hey, I love your product..",
        isCurrentUser: false,
        sender: "Lolade Pariola"
      }
    ]
  },
  {
    sender: "Lolade Pariola",
    messages: [
      {
        id: 1,
        text: "Hey, I love your product..",
        isCurrentUser: false,
        sender: "Lolade Pariola"
      }
    ]
  },
  {
    sender: "Lolade Pariola",
    messages: [
      {
        id: 1,
        text: "Hey, I love your product..",
        isCurrentUser: false,
        sender: "Lolade Pariola"
      }
    ]
  },
  {
    sender: "Lolade Pariola",
    messages: [
      {
        id: 1,
        text: "Hey, I love your product..",
        isCurrentUser: false,
        sender: "Lolade Pariola"
      }
    ]
  },
  {
    sender: "Lolade Pariola",
    messages: [
      {
        id: 1,
        text: "Hey, I love your product..",
        isCurrentUser: false,
        sender: "Lolade Pariola"
      }
    ]
  }
]

export default function ConversationList({ onSelect, className = "" }: ConversationListProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv)
    onSelect(conv);
  }

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
              <AvatarFallback>{conv.sender[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between text-sm font-medium">
                <span>{conv.sender}</span>
              </div>
              <div className="text-sm text-muted-foreground">{conv.messages[conv.messages.length - 1]?.text}</div>
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