import { listMessageTemplates, sendMessage } from "@/api";
import { confirmSignedUpload, downloadMedia, startSignedUpload, uploadMedia } from "@/api/media";
import { useEventsCache } from "@/hooks/useEventsCache";
import { formatDate } from "@/lib/utils";
import { useAgents } from "@/providers/AgentProvider";
import { Conversation, Event, Message } from "@/types";
import { Check, CheckCheck, ChevronLeft, FolderOpen, Image as ImageIcon, Loader2, Send, UserPlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AddContact from "./AddContact";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import UserAvatar from "./UserAvatar";

type ChatWindowProps = {
    onBack: () => void;
    conversation: Conversation;
    className?: string;
};

export default function ChatWindow({ onBack, conversation, className = "" }: ChatWindowProps) {
    const [inputValue, setInputValue] = useState("");
    const [captionValue, setCaptionValue] = useState("");
    const { events: messages, isLoading, refreshEvents } = useEventsCache(conversation.id);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { agents } = useAgents();

    const [isAddContactOpen, setIsAddContactOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
    const [templates, setTemplates] = useState<any[]>([]);
    const [templateSearch, setTemplateSearch] = useState("");
    const [loadingTemplates, setLoadingTemplates] = useState(false);

    const getAgentName = (actorID: string) => {
        if (!agents || !Array.isArray(agents)) {
            return "Unknown Agent"; // fallback to actorID if agents is not available
        }
        const agent = agents.find(a => a.id === actorID);
        return agent ? `${agent.firstName} ${agent.lastName}` : "Unknown Agent"; // fallback to actorID if not found
    };

    const fetchTemplates = async () => {
        try {
            setLoadingTemplates(true);
            const data = await listMessageTemplates(); // API should return templates
            setTemplates(data.templates || []);
        } catch (error) {
            console.error("Error fetching templates:", error);
        } finally {
            setLoadingTemplates(false);
        }
    };

    useEffect(() => {
        if (isTemplateDialogOpen) fetchTemplates();
    }, [isTemplateDialogOpen]);

    const scrollToBottom = (smooth = true) => {
        messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        setShouldAutoScroll(scrollHeight - scrollTop <= clientHeight + 100);
    };

    const handleUploadImage = async (file: File, text?: string) => {
        try {
            setIsUploading(true);
            const response = await startSignedUpload({ mimeType: file.type, size: file.size });
            const { id, uploadURL } = response;
            await uploadMedia(uploadURL, file).then(async () => {
                const confirmed = await confirmSignedUpload(id);
                sendMessage(conversation.id, {
                    body: {
                        type: "image",
                        image: { id: id, text: text },
                        text: text
                    }
                });
                console.log("confirmed", confirmed);
            });
            return id;
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileSelect = (file: File) => {
        setPreviewFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setIsPreviewOpen(true);
        setCaptionValue(inputValue || "");
    };

    const handleConfirmUpload = async () => {
        if (!previewFile) return;

        try {
            setIsUploading(true);
            const mediaId = await handleUploadImage(previewFile, captionValue);
            console.log("mediaId", mediaId);
            // const toSend: Message = {
            //     body: { type: "image", image: { id: mediaId }, text: "" }, // adjust according to API
            // };
            // await sendMessage(conversation.id, toSend);
            // await refreshEvents();
            scrollToBottom();
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setIsUploading(false);
            handleClosePreview();
        }
    };

    const handleClosePreview = () => {
        setIsPreviewOpen(false);
        setPreviewFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        // Reset file input
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
        }
    };



    const handleSendTemplate = async (template: any) => {
        try {
            await sendMessage(conversation.id, {
                body: {
                    type: "template",
                    // template: {
                    //     name: template.name,
                    //     language: template.language,
                    //     components: template.components || []
                    // }
                    text: template.text
                }
            });
            setIsTemplateDialogOpen(false);
            await refreshEvents();
            scrollToBottom();
        } catch (error) {
            console.error("Error sending template:", error);
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
            await refreshEvents();
            scrollToBottom();
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    useEffect(() => {
        refreshEvents();
        const interval = setInterval(refreshEvents, 3000);
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
                <div className="flex items-center gap-3 flex-1">
                    <UserAvatar name={conversation.contact?.computedDisplayName || conversation.contactID || ""} platform={conversation.platform} className="w-10 h-10" />
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
                        {(() => {
                            let lastDate: string | null = null;

                            return messages.map((msg) => {
                                const currentDate = formatDate(msg.createdAt, "relative");
                                const showDateDivider = currentDate !== lastDate;
                                lastDate = currentDate;

                                return (
                                    <div key={msg.id}>
                                        {showDateDivider && (
                                            <div className="flex justify-center my-4">
                                                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                                                    {currentDate}
                                                </span>
                                            </div>
                                        )}

                                        {msg.type === "note"
                                            ? _buildNotes(msg, getAgentName)
                                            : _buildMessageContainer(msg, getAgentName)}
                                    </div>
                                );
                            });
                        })()}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t flex items-center gap-2 sticky bottom-0">
                {/* Hidden File Input */}
                <input
                    id="file-upload"
                    type="file"
                    accept="image/*" // or change to "*/*" for all file types
                    className="hidden"
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        handleFileSelect(file);
                    }}
                />

                {/* Message Template Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsTemplateDialogOpen(true)}
                    className="rounded-full"
                >
                    <FolderOpen className="size-5" /> {/* or a better icon for templates */}
                </Button>

                {/* Upload Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => document.getElementById("file-upload")?.click()}
                    className="rounded-full"
                >
                    <ImageIcon className="size-5" />
                </Button>

                {/* Text Input */}
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

                {/* Send Button */}
                <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="rounded-full"
                >
                    <Send className="size-5" />
                </Button>
            </div>

            {/* Image Preview Dialog */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Preview Image</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {previewUrl && (
                            <div className="relative">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        )}
                        <div className="flex justify-end gap-2">
                            <input
                                type="text"
                                value={captionValue}
                                placeholder="Add a caption..."
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleConfirmUpload();
                                    }
                                }}
                                onChange={(e) => setCaptionValue(e.target.value)}
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                            <Button
                                onClick={handleConfirmUpload}
                                disabled={isUploading}
                                className="flex items-center gap-2 rounded-full"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <Send className="size-5" />
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Select Message Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={templateSearch}
                            onChange={(e) => setTemplateSearch(e.target.value)}
                            className="w-full rounded-md border px-3 py-2 text-sm"
                        />
                        <div className="max-h-64 overflow-y-auto space-y-2">
                            {loadingTemplates ? (
                                <div className="flex justify-center items-center py-4">
                                    <Loader2 className="animate-spin size-5 text-gray-400" />
                                </div>
                            ) : templates.length === 0 ? (
                                <p className="text-gray-500 text-center">No templates found</p>
                            ) : (
                                templates
                                    .filter(t => t.name.toLowerCase().includes(templateSearch.toLowerCase()))
                                    .map(template => (
                                        <div
                                            key={template.id}
                                            className="border rounded-md p-3 flex justify-between items-center hover:bg-gray-50"
                                        >
                                            <div>
                                                <p className="font-medium text-sm">{template.name}</p>
                                                <p className="text-xs text-gray-500">{template.language}</p>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => handleSendTemplate(template)}
                                            >
                                                Send
                                            </Button>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}


function ImageMessage({ imageId }: { imageId: string }) {
    const [src, setSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const url = await downloadMedia(imageId); // get signed URL
                console.log("url", url);
                setSrc(url.link);
            } catch (error) {
                console.error("Error loading image:", error);
            }
        };
        fetchImage();
    }, [imageId]);

    return (
        <div
            className="w-[250px] h-[200px] bg-gray-100 rounded-md flex items-center justify-center relative"
        >
            {loading && (
                <Loader2 className="size-6 animate-spin text-gray-400 absolute" />
            )}
            {src && (
                <img
                    src={src}
                    alt="Image"
                    className="rounded-md w-full h-full object-cover"
                    onLoad={() => setLoading(false)}
                    style={{ display: loading ? "none" : "block" }}
                />
            )}
        </div>
    );
}

function _buildTextMessage(msg: Event) {
    const isAgent = msg.actorType === "agent";
    return <div
        className={`rounded-2xl px-4 py-2 ${isAgent
            ? "bg-primary text-white rounded-br-none"
            : "bg-gray-100 text-gray-900 rounded-bl-none"
            }`}
    >
        {<span>{msg.message.body.text || msg.message.body.image.text}</span>}
    </div>;
}


function _buildStatusReasonMessage(msg: Event) {
    return <span>{msg.message?.statusReason}</span>;
}

function _buildMessage(msg: Event, isAgent: boolean) {
    switch (msg.message?.body.type) {
        case "text":
            return _buildTextMessage(msg);
        case "image":
            return <div className={`flex flex-col ${isAgent ? "items-end" : "items-start"} gap-1`}>
                <ImageMessage imageId={msg.message.body.image.id} />
                {msg.message.body.image.text && (
                    _buildTextMessage(msg)
                )}
            </div>;
        default:
            return <span>Unknown message type: {msg.message?.body.type}</span>;
    }
}

function _buildMessageContainer(msg: Event, getAgentName: (id: string) => string) {
    const isAgent = msg.actorType === "agent";
    return (
        <div
            key={msg.id}
            className={`flex flex-col max-w-[75%] ${isAgent ? "ml-auto items-end" : "items-start"}`}
        >
            <span className="text-xs text-gray-400 mb-1">{formatDate(msg.createdAt, "short")}</span>
            {_buildMessage(msg, isAgent)}
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                {isAgent && <span className="ml-1 text-gray-700">{getAgentName(msg.actorID)}</span>}
                {isAgent && (
                    <Tooltip>
                        <TooltipTrigger>
                            {_buildEventMessageStatus(msg)}
                        </TooltipTrigger>
                        {msg.message?.statusReason && (
                            <TooltipContent>
                                {_buildStatusReasonMessage(msg)}
                            </TooltipContent>
                        )}
                    </Tooltip>
                )}
            </div>
        </div>
    );
}

function _buildNotes(msg: Event, getAgentName: (id: string) => string) {
    return (
        <div className="flex items-center justify-center gap-1 text-xs">
            <span>{getAgentName(msg.actorID)} shared a note</span>
        </div>
    );
}

function _buildEventMessageStatus(msg: Event) {
    switch (msg.message?.status) {
        case "sending":
        case "accepted":
            return <Loader2 className="size-4 animate-spin text-gray-400" />;
        case "sent":
            return <Check className="size-4 text-green-500" />;
        case "delivered":
            return <CheckCheck className="size-4 text-green-500" />;
        case "failed":
            return <X className="size-4 text-red-500" />;
        default:
            return <span>{msg.message?.status}</span>;
    }
}