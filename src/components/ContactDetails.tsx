import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatPhoneNumber } from '@/lib/utils';
import { Contact } from '@/types';
import { Calendar, ChevronLeft, Edit, Mail, MessageCircle, Phone } from 'lucide-react';

interface ContactDetailsProps {
    contact: Contact | null;
    onBack: () => void;
    onEdit?: () => void;
    onMessage?: () => void;
    className?: string;
}

export default function ContactDetails({
    contact,
    onBack,
    onEdit,
    onMessage,
    className = ""
}: ContactDetailsProps) {
    if (!contact) {
        return (
            <div className={`flex-1 flex-col bg-white ${className}`}>
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="text-gray-400 mb-3">
                            <Avatar className="h-14 w-14 mx-auto">
                                <AvatarFallback className="text-base">?</AvatarFallback>
                            </Avatar>
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">No Contact Selected</h3>
                        <p className="text-sm text-gray-500">Select a contact to view details</p>
                    </div>
                </div>
            </div>
        );
    }

    const getPhoneNumber = () => {
        const phoneIdentifier = contact.identifiers.find(id => id.type === 'phonenumber');
        return phoneIdentifier ? formatPhoneNumber(phoneIdentifier.value) : 'No phone number';
    };

    const getEmail = () => {
        const emailIdentifier = contact.identifiers.find(id => id.type === 'email');
        return emailIdentifier ? emailIdentifier.value : 'No email address';
    };

    const getAttributeValue = (key: string) => {
        return contact.attributes[key as keyof typeof contact.attributes] || 'Not provided';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`flex flex-col h-full bg-white ${className}`}>
            {/* Sticky Header */}
            <div className="flex items-center justify-between border-b py-3 px-4 sticky top-0 bg-white z-10 h-18">
                <div className="flex items-center gap-3">
                    <ChevronLeft className="size-5 md:hidden" onClick={onBack} />
                    <Avatar className="w-12 h-12">
                        <AvatarFallback>{contact.computedDisplayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-semibold">{contact.computedDisplayName}</h2>
                        <p className="text-xs text-gray-500">Contact Details</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {onMessage && <Button variant="ghost" size="sm" onClick={onMessage}><MessageCircle className="size-4" /></Button>}
                    {onEdit && <Button variant="ghost" size="sm" onClick={onEdit}><Edit className="size-4" /></Button>}
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto space-y-5 p-4">

                    {/* Basic Information */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">Basic Information</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Phone Number</p>
                                    <p className="text-sm font-medium">{getPhoneNumber()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Email Address</p>
                                    <p className="text-sm font-medium">{getEmail()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Details */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">Personal Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-xs text-gray-500">First Name</p>
                                <p className="font-medium">{getAttributeValue('firstName')}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Last Name</p>
                                <p className="font-medium">{getAttributeValue('lastName')}</p>
                            </div>
                            {Object.entries(contact.attributes).map(([key, value]) => {
                                if (key !== 'firstName' && key !== 'lastName') {
                                    return (
                                        <div key={key}>
                                            <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                            <p className="font-medium">{value}</p>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>

                    {/* Identifiers */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">Identifiers</h3>
                        <div className="space-y-2">
                            {contact.identifiers.map((identifier, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                                    <div>
                                        <p className="text-xs text-gray-500 capitalize">{identifier.type}</p>
                                        <p className="text-sm font-medium">{identifier.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">Metadata</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Created</p>
                                    <p className="font-medium">{formatDate(contact.createdAt)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Last Updated</p>
                                    <p className="font-medium">{formatDate(contact.updatedAt)}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Contact ID</p>
                                <p className="font-mono text-xs bg-gray-50 p-2 rounded border">{contact.id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}