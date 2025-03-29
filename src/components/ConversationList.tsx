import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"
import ChatWindow from "./ChatWindow"

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

export default function ConversationList({ onSelect,className = "" }: ConversationListProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv)
    onSelect(conv);
  }

  const handleBack = () => {
    setSelectedConversation(null)
  }

  return (
    <div className={`w-full md:w-[300px] bg-white ${className} border-r py-4 overflow-y-auto ${selectedConversation ? 'hidden' : 'block'}`}>
      <h2 className="text-md font-normal mb-4 px-4">Conversations</h2>
      <div className="divide-y-1">
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