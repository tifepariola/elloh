import { listMessages, sendMessage } from "@/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { Conversation, Event, Message } from "@/types";
import { ChevronLeft, Send, UserPlus, Image as ImageIcon, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AddContact from "./AddContact";
import PlatformLogo from "./PlatformLogo";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type ChatWindowProps = {
    onBack: () => void;
    conversation: Conversation;
    className?: string;
};

export default function ChatWindow({ onBack, conversation, className = "" }: ChatWindowProps) {
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [isAddContactOpen, setIsAddContactOpen] = useState(false);

    const scrollToBottom = (smooth = true) => {
        messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        setShouldAutoScroll(scrollHeight - scrollTop <= clientHeight + 100);
    };

    const fetchMessages = async () => {
        try {
            setIsLoading(true);
            const data = await listMessages(conversation.id);
            const sortedMessages = data.events.sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            setMessages(sortedMessages);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const toSend: Message = {
            body: { type: "text", text: inputValue },
        };

        try {
            await sendMessage(conversation.id, toSend);
            setInputValue("");
            await fetchMessages();
            scrollToBottom();
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [conversation.id]);

    useEffect(() => {
        if (shouldAutoScroll) scrollToBottom(false);
    }, [messages]);

    return (
        <div className={`flex flex-col ${className}`}>
            {/* Header */}
            <div className="flex items-center border-b py-3 px-4 gap-3 sticky top-0 z-10 h-18">
                <ChevronLeft className="size-6" onClick={onBack} />
                <div className="relative flex items-center gap-3 flex-1">
                    <Avatar className="w-10 h-10">
                        <AvatarFallback>
                            {conversation.contact?.computedDisplayName?.substring(0, 2).toUpperCase() || conversation.contactID?.substring(0, 2).toUpperCase() || "?"}
                        </AvatarFallback>
                    </Avatar>
                    <PlatformLogo platform={conversation.platform} className="size-3 absolute bottom-0 left-7" />
                    <div className="flex-1">
                        <p className="font-semibold text-gray-900 truncate">
                            {conversation.contact?.computedDisplayName || conversation.contactID}
                        </p>
                    </div>
                </div>
                <AddContact
                    trigger={
                        <Button variant="ghost" size="sm">
                            <UserPlus className="size-4" />
                        </Button>
                    }
                    isAddContactOpen={isAddContactOpen}
                    setIsAddContactOpen={setIsAddContactOpen}
                    phoneNumber={conversation.contact?.identifiers[0]?.value || ""}
                    contact={
                        conversation.contact || {
                            id: "",
                            identifiers: [],
                            computedDisplayName: "",
                            attributes: {},
                            workspaceID: "",
                            updatedAt: "",
                            createdAt: "",
                        }
                    }
                />
            </div>

            {/* Messages */}
            <div
                className="flex-1 overflow-y-auto p-4 space-y-4"
                onScroll={handleScroll}
            >
                {isLoading && messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-gray-500">
                        <Loader2 className="size-6 animate-spin mr-2" /> Loading messages...
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-full text-gray-400">
                        <ImageIcon className="size-10 mb-3 opacity-50" />
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    <>
                        {messages.map((msg) => {
                            const isAgent = msg.actorType === "agent";
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col max-w-[75%] ${isAgent ? "ml-auto items-end" : "items-start"
                                        }`}
                                >
                                    <div
                                        className={`rounded-2xl px-4 py-2 ${isAgent
                                                ? "bg-primary text-white rounded-br-none"
                                                : "bg-gray-100 text-gray-900 rounded-bl-none"
                                            }`}
                                    >
                                        {msg.message?.body.type === "text" && (
                                            <span>{msg.message.body.text}</span>
                                        )}
                                        {msg.message?.body.type === "image" && msg.message.body.image?.link && (
                                            <img
                                                src={msg.message.body.image.link}
                                                alt="Image"
                                                className="rounded-md max-w-[200px] mt-1"
                                            />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                                        {isAgent && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <span>{msg.message.status}</span>
                                                </TooltipTrigger>
                                                {msg.message.statusReason && (
                                                    <TooltipContent>
                                                        {msg.message.statusReason}
                                                    </TooltipContent>
                                                )}
                                            </Tooltip>
                                        )}
                                        <span>• {formatDate(msg.createdAt, "short")}</span>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t flex items-center gap-2 sticky bottom-0">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    placeholder="Type your message..."
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
                <Button onClick={handleSendMessage} disabled={!inputValue.trim()} className="rounded-full">
                    <Send className="size-5" />
                </Button>
            </div>
        </div>
    );
}