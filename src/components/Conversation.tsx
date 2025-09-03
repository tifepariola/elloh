import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDate } from "@/lib/utils"
import type { Conversation, Event } from "@/types"
import { ChevronDown, ImageIcon, MessageCirclePlus, Trash2 } from "lucide-react"
import { useState } from "react"
import { StatusIcon } from "./StatusIcon"
import { Separator } from "./ui/separator"

export default function Conversation({ conv }: { conv: Conversation }) {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <div className="flex-1 min-w-0 group flex items-center justify-between">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-900 truncate flex-1">
                        {conv.contact?.computedDisplayName || conv.contactID}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatDate(conv.updatedAt, "time_relative")}
                    </span> {/* Dropdown aligned properly */}
                    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                        <DropdownMenuTrigger asChild>
                            <div
                                className={`
              flex items-center justify-center
              ${menuOpen ? "flex" : "hidden group-hover:flex"}
            `}
                            >
                                <ChevronDown className="size-4" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem>
                                <MessageCirclePlus className="size-4 mr-2" />
                                Mark as unread
                            </DropdownMenuItem>
                            <Separator className="my-2" />
                            <DropdownMenuItem>
                                <Trash2 className="size-4 mr-2" />
                                Delete conversation
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="text-sm text-gray-500 truncate">
                    {_buildLastEvent(conv.lastEvent)}
                </div>
            </div>


        </div>
    )
}

function _buildLastEvent(event: Event | undefined) {
    if (!event) return null;
    switch (event.message?.body.type) {
        case "text":
            if (event.actorType === "agent") {
                return <div className="flex flex-row items-center gap-1 text-gray-500">
                    <StatusIcon status={event.message?.status || "sending"} className="flex-shrink-0" />
                    <span className="truncate">{event.message?.body.text}</span>
                </div>;
            }
            return event.message?.body.text;
        case "image":
            if (event.actorType === "agent") {
                return <div className="flex flex-row items-center gap-1 text-gray-500">
                    <StatusIcon status={event.message?.status || "sending"} className="flex-shrink-0" />
                    <ImageIcon className="size-4 text-gray-500 flex-shrink-0" />
                    <span className="truncate">{event.message?.body.image.text || "Photo"}</span>
                </div>;
            }
            return <div className="flex flex-row items-center gap-1 text-gray-500">
                <ImageIcon className="size-4 text-gray-500 flex-shrink-0" />
                <span className="truncate">{event.message?.body.image.text || "Photo"}</span>
            </div>;
        default:
            return "Unknown";
    }
}