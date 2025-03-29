import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ChevronLeft, Send, SkipBackIcon, StepBackIcon, TagIcon } from "lucide-react"
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

type ChatWindowProps = {
    onBack: () => void;
    conversation: {
        sender: string;
        messages: {
            id: number;
            text: string;
            isCurrentUser: boolean;
            sender: string;
        }[];
    };
    className?: string;
};

export default function ChatWindow({ onBack, conversation, className = "" }: ChatWindowProps) {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState(conversation.messages);

    useEffect(() => {
        setMessages(conversation.messages);
    }, [conversation]);

    const handleSend = () => {
        if (inputValue.trim()) {
            setMessages([...messages, {
                id: messages.length + 1,
                text: inputValue,
                isCurrentUser: true,
                sender: "You"
            }]);
            setInputValue('');
        }
    };
    return (
        <div className={`flex-1 flex-col bg-white ${className}`}>
            <div className="flex gap-2 items-center border-b p-4">
                {onBack && (
                    <button onClick={onBack} className="sm:hidden">
                        <ChevronLeft className="size-7" />
                    </button>
                )}
                <div className="flex flex-1 items-center gap-3">
                    <Avatar>
                        <AvatarImage src="https://i.pravatar.cc/30?img=1" />
                        <AvatarFallback>BP</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">Chat with {conversation.sender}</p>
                    </div>
                </div>
                <button>
                    <TagIcon className="size-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-5 p-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex flex-col ${msg.isCurrentUser ? "items-end" : "items-start"}`}
                    >
                        <div
                            className={`p-4 rounded-md max-w-md ${msg.isCurrentUser ? "bg-mine-shaft-200" : "bg-muted"
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Chat input */}
            <div className="sticky bg-white p-4 border-t flex items-center gap-2 shadow-md">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button onClick={handleSend} className="">
                <Send className="size-5" />

                </Button>
            </div>
        </div>
    )
}