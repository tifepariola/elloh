import React from 'react';
import { cn } from '@/lib/utils';
import whatsapp from "@/assets/platforms/whatsapp.png";

interface PlatformLogoProps {
  platform: string;
  className?: string;
}

export const PlatformLogo: React.FC<PlatformLogoProps> = ({ 
  platform, 
  className 
}) => {

  return (
    <img src={platform === "whatsapp" ? whatsapp : platform} alt={platform} className={cn("size-3", className)} />
  );
};

export default PlatformLogo; 