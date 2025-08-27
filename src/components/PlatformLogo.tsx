import React from 'react';
import { cn } from '@/lib/utils';
import whatsapp from "@/assets/platforms/whatsapp.png";
import instagram from "@/assets/platforms/instagram.png";

interface PlatformLogoProps {
    platform: string;
    className?: string;
}

export const PlatformLogo: React.FC<PlatformLogoProps> = ({
    platform,
    className
}) => {

    return (
        <div className={cn("rounded-full p-0.5 bg-white", className)}>
            <img src={platform === "whatsapp" ? whatsapp : platform === "instagram" ? instagram : platform} alt={platform} className="size-3" />
        </div>
    );
};

export default PlatformLogo; 