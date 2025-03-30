import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type NewChatModalProps = {
    isOpen: boolean;
    onClose?: () => void;
    onCreateChat?: (name: string) => void;
};

export function NewChatModal({ isOpen, onClose, onCreateChat }: NewChatModalProps) {
    const [recipient, setRecipient] = useState("");
    const [message, setMessage] = useState("");

    const handleCreateChat = () => {
        if (recipient.trim()) {
            onCreateChat?.(recipient);
            setRecipient(""); // Reset input after creation
            onClose?.();
        }
    };

    if (!isOpen) return null; // Hide modal when not open

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop overlay */}
            <div
                className="absolute inset-0 bg-black/70"
                onClick={onClose}
            />

            {/* Modal Card */}
            <Card className="w-full mx-4 sm:w-[450px] bg-white shadow-lg rounded-lg z-50">
                <CardHeader>
                    <CardTitle>New Chat</CardTitle>
                    <CardDescription>Start a conversation with a new recipient.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Recipient</Label>
                            <Input
                                id="name"
                                placeholder="Enter recipient's name"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Message</Label>
                            <Textarea
                                id="message"
                                placeholder="Type your message here"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleCreateChat} disabled={!recipient.trim()}>
                        Start Chat
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}