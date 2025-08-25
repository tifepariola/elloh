import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/store/authContext"
import { Bell, ContactIcon, InboxIcon, Menu, Search, Settings } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import logo from "../assets/logo-full.svg"

export default function Topbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/auth")
  }

  const navItems = [
    { to: "/inbox", icon: InboxIcon, label: "Inbox" },
    { to: "/contacts", icon: ContactIcon, label: "Contacts" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <header className="bg-mine-shaft-900 text-white px-4 py-3 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="h-6" />

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-1 ml-4">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Button
              key={to}
              asChild
              variant="ghost"
              className={`text-gray-300 hover:bg-mine-shaft-700 px-3 py-2 rounded-lg ${
                location.pathname === to ? "bg-mine-shaft-700 text-white" : ""
              }`}
            >
              <Link to={to} title={label}>
                <Icon className="h-5 w-5" />
                <span className="hidden sm:block">{label}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search..."
            className="bg-mine-shaft-700 border-none text-sm pl-9 w-[250px] rounded-lg placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button variant="ghost" className="sm:hidden">
          <Search className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-mine-shaft-700 hidden sm:flex"
        >
          <Bell className="h-5 w-5" />
        </Button>

        {/* Mobile Nav Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-mine-shaft-700 sm:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>Navigation</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {navItems.map(({ to, icon: Icon, label }) => (
              <DropdownMenuItem key={to} asChild>
                <Link to={to} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" /> {label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://i.pravatar.cc/30" />
              <AvatarFallback>
                {user?.email?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{user?.email || "User"}</span>
                <span className="text-xs text-gray-500">Logged in</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Help</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}