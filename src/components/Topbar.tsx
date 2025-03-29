import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { BeakerIcon, Bell, ChartNoAxesColumn, ContactIcon, HelpCircle, InboxIcon, Settings } from "lucide-react"
import logo from "../assets/logo-full.svg"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"

export default function Topbar() {
    const navigate = useNavigate()
    return (
        <div className="bg-mine-shaft-900 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <img src={logo} className="h-6" />
                <button className="bg-mine-shaft-500/40 p-2">
                    <InboxIcon className="size-5" />
                </button>
                <button className="p-2">
                    <ContactIcon className="size-5" />
                </button>
                <button className="p-2">
                    <ChartNoAxesColumn className="size-5" />
                </button>
                <Input
                    placeholder="Search..."
                    className="bg-mine-shaft-600 border-none text-sm hidden md:block w-[250px] placeholder:text-gray-400"
                />
            </div>
            <div className="flex items-center gap-4">
                <Bell className="size-5 hidden sm:block" />
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage src="https://i.pravatar.cc/30" />
                            <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-54">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Help</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/auth")}>
                            Log out
                            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </div>
    )
}