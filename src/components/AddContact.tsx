import { createContact } from "@/api";
import { countryCodes, splitPhoneNumber } from "@/lib/utils";
import { Contact } from "@/types";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type AddContactProps = {
    isAddContactOpen: boolean;
    setIsAddContactOpen: (isOpen: boolean) => void;
    trigger: React.ReactNode;
    phoneNumber: string;
    contact: Contact;
    onContactCreated?: () => void;
}

export default function AddContact({ isAddContactOpen, trigger, setIsAddContactOpen, phoneNumber, contact, onContactCreated }: AddContactProps) {

    const [isCreatingContact, setIsCreatingContact] = useState(false);
    const [firstName, setFirstName] = useState(contact.attributes.firstName || '');
    const [lastName, setLastName] = useState(contact.attributes.lastName || '');
    const [selectedCountryCode, setSelectedCountryCode] = useState(splitPhoneNumber(phoneNumber)?.countryCode || '');
    const [phoneNumberInput, setPhoneNumberInput] = useState(splitPhoneNumber(phoneNumber)?.localNumber || '');

    const handleAddContact = async () => {
        if (!firstName.trim() || !phoneNumberInput.trim() || !selectedCountryCode) {
            return;
        }

        try {
            setIsCreatingContact(true);
            const contactData = {
                attributes: {
                    firstName: firstName.trim(),
                    ...(lastName.trim() && { lastName: lastName.trim() })
                },
                identifiers: [
                    {
                        type: "phonenumber",
                        value: selectedCountryCode + phoneNumberInput.trim()
                    }
                ]
            };

            await createContact(contactData);
            console.log('Contact created successfully');

            // Reset form
            setFirstName('');
            setLastName('');
            setSelectedCountryCode('');
            setPhoneNumberInput('');
            setIsAddContactOpen(false);
            
            // Call callback if provided
            onContactCreated?.();
        } catch (error) {
            console.error('Error creating contact:', error);
        } finally {
            setIsCreatingContact(false);
        }
    };
    return (
        <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Contact</DialogTitle>
                    <DialogDescription>
                        Create a new contact to start a conversation
                    </DialogDescription>
                </DialogHeader>
                <div className="grid w-full items-center gap-4">
                    <div className="flex gap-2">
                        <div className="flex flex-col space-y-1.5 w-1/2">
                            <Label htmlFor="firstname">First Name *</Label>
                            <Input
                                id="firstname"
                                placeholder="Enter first name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5 w-1/2">
                            <Label htmlFor="lastname">Last Name</Label>
                            <Input
                                id="lastname"
                                placeholder="Enter last name (optional)"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <div className="flex gap-2">
                            <Select
                                value={selectedCountryCode}
                                onValueChange={(value) => {
                                    setSelectedCountryCode(value);
                                }}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Country Code" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countryCodes.map(({ country, code }, idx) => (
                                        <SelectItem key={idx} value={code}>
                                            +{code} ({country})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                id="phone"
                                placeholder="8000000000"
                                maxLength={10}
                                value={phoneNumberInput}
                                onChange={(e) => setPhoneNumberInput(e.target.value)}
                                className="flex-1"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsAddContactOpen(false)}
                            disabled={isCreatingContact}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddContact}
                            disabled={!firstName.trim() || !phoneNumberInput.trim() || !selectedCountryCode || isCreatingContact}
                        >
                            {isCreatingContact ? 'Creating...' : 'Create Contact'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>)
}