import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PlatformLogo from "./PlatformLogo";

export default function UserAvatar({ name, platform, className }: { name: string, platform?: string, className?: string }) {
    return <div className="relative"><Avatar className={className}>
        <AvatarImage src={`https://ui-avatars.com/api/?name=${name}+&background=random&bold=true`} />
        <AvatarFallback>
            {name?.substring(0, 2).toUpperCase()}
        </AvatarFallback>
    </Avatar>
        {platform && <PlatformLogo platform={platform} className="absolute bottom-0 right-0" />}
    </div>
}