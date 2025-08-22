import { listMessages, sendMessage } from "@/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { Conversation, Event, Message } from "@/types";
import { ChevronLeft, Send, UserPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PlatformLogo from "./PlatformLogo";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type ChatWindowProps = {
    onBack: () => void;
    conversation: Conversation;
    className?: string;
};

export default function ChatWindow({ onBack, conversation, className = "" }: ChatWindowProps) {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const isAtBottom = scrollHeight - scrollTop <= clientHeight + 100; // 100px threshold
        setShouldAutoScroll(isAtBottom);
    };

    const fetchMessages = async () => {
        try {
            setIsLoading(true);
            const data = await listMessages(conversation.id);
            console.log('Fetched messages:', data.events);
            // Sort messages by creation date (newest first)
            const sortedMessages = data.events.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setMessages(sortedMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const toSend: Message = {
            body: {
                type: "text",
                text: inputValue
            }
        }

        try {
            const data = await sendMessage(conversation.id, toSend);
            console.log('Message sent:', data);
            setInputValue('');

            // Refresh messages immediately after sending
            await fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchMessages();

        // Set up interval for refreshing messages
        const interval = setInterval(() => {
            fetchMessages();
        }, 3000); // Refresh every 3 seconds

        // Cleanup interval on unmount or conversation change
        return () => clearInterval(interval);
    }, [conversation.id]); // Only re-run when conversation ID changes

    // Auto-scroll to bottom when new messages arrive and user is at bottom
    useEffect(() => {
        if (shouldAutoScroll) {
            scrollToBottom();
        }
    }, [messages, shouldAutoScroll]);


    return (
        <div className={`flex-1 flex-col bg-white ${className}`}>
            <div className="flex gap-2 items-center border-b py-4 px-2">
                {onBack && (
                    <Button variant={"ghost"} onClick={onBack} className="sm:hidden">
                        <ChevronLeft className="size-7" />
                    </Button>
                )}
                <div className="flex flex-1 items-center gap-3">
                    <div className="relative">
                        <Avatar className="w-10 h-10">
                            <AvatarFallback>
                                {conversation.contact?.computedDisplayName?.[0] || conversation.contactID[0]}
                            </AvatarFallback>
                        </Avatar>
                        <PlatformLogo platform={conversation.platform} className="size-3 absolute bottom-0 right-0" />
                    </div>
                    <div>
                        <p className="font-semibold">Chat with {conversation.contact?.computedDisplayName || conversation.contactID}</p>
                    </div>
                        <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={"ghost"} size={"sm"}>
                                <UserPlus className="size-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Contact</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                                <Input type="text" placeholder="Contact ID" className="w-full" />
                                <Button className="w-full">Add</Button>
                            </DialogDescription>
                        </DialogContent>
                    </Dialog>
                </div>
                
            </div>

            {/* Messages */}
            <div
                className="flex-1 overflow-y-auto p-4 pb-0 flex flex-col-reverse"
                onScroll={handleScroll}
            >
                {isLoading && messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-sm text-muted-foreground">Loading messages...</div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-sm text-muted-foreground">No messages yet</div>
                    </div>
                ) : (
                    <>
                        {/* Scroll anchor for auto-scrolling */}
                        <div ref={messagesEndRef} />

                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${msg.actorType === "agent" ? "items-end" : "items-start"} mb-5`}
                            >
                                <div
                                    className={`p-2 px-3 rounded-md max-w-md flex items-center ${msg.message.status === "failed" && "opacity-50"} gap-2 ${msg.actorType === "agent" ? "bg-mine-shaft-200" : "bg-muted"
                                        }`}
                                >
                                    {msg.message?.body.type === "text" && msg.message.body.text && (
                                        <span>{msg.message.body.text}</span>
                                    )}
                                    {msg.message?.body.type === "image" && msg.message.body.image?.link && (
                                        <img src={msg.message.body.image.link} alt="Image" className="w-full h-full object-contain" />
                                    )}
                                    {/* <span className="text-xs text-gray-500">{formatDate(msg.createdAt, "short")}</span> */}
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                    {msg.actorType === "agent" && (
                                        <>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="text-xs text-gray-500 capitalize">{msg.message.status} •</span>
                                                </TooltipTrigger>
                                                {msg.message.statusReason && (
                                                    <TooltipContent className="mr-4">
                                                        <p className="text-xs max-w-xs text-center">{msg.message.statusReason}</p>
                                                    </TooltipContent>
                                                )}</Tooltip>

                                        </>
                                    )}
                                    <span className="text-xs text-gray-500">{formatDate(msg.createdAt, "short")}</span>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Chat input */}
            <div className="sticky bg-white p-4 border-t flex items-center gap-2 shadow-md">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    placeholder="Type your message..."
                    className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button onClick={handleSendMessage} disabled={!inputValue.trim()} className="">
                    <Send className="size-5" />
                </Button>
            </div>
        </div>
    )
}