import { cn } from "@/lib/utils";
import { Check, CheckCheck, Loader2, X } from "lucide-react";

export function StatusIcon({ status, className }: { status: string, className?: string }) {
    switch (status) {
        case "sending":
        case "accepted":
            return <Loader2 className={cn("size-4 animate-spin text-gray-400", className)} />;
        case "sent":
            return <Check className={cn("size-4 text-green-500", className)} />;
        case "delivered":
            return <CheckCheck className={cn("size-4 text-green-500", className)} />;
        case "failed":
            return <X className={cn("size-4 text-red-500", className)} />;
        default:
            return <span>{status}</span>;
    }
}