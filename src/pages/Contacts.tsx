import { listContacts } from '@/api';
import AddContact from '@/components/AddContact';
import ContactDetails from '@/components/ContactDetails';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPhoneNumber } from '@/lib/utils';
import { Contact } from '@/types';
import { Phone, Plus, Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Contacts() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isAddContactOpen, setIsAddContactOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    const fetchContacts = async () => {
        try {
            setIsLoading(true);
            const data = await listContacts();
            setContacts(data);
            setFilteredContacts(data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        if (searchTerm.trim()) {
            const filtered = contacts.filter(contact =>
                contact.computedDisplayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.attributes.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.attributes.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.identifiers.some(identifier =>
                    identifier.value.includes(searchTerm)
                )
            );
            setFilteredContacts(filtered);
        } else {
            setFilteredContacts(contacts);
        }
    }, [searchTerm, contacts]);

    const getPhoneNumber = (contact: Contact) => {
        const phoneIdentifier = contact.identifiers.find(id => id.type === 'phonenumber');
        return phoneIdentifier ? formatPhoneNumber(phoneIdentifier.value) : 'No phone';
    };

    const handleSelectContact = (contact: Contact) => setSelectedContact(contact);
    const handleBackToList = () => setSelectedContact(null);

    return (
        <div className="flex h-full bg-white">
            {/* Sidebar */}
            <div
                className={`flex flex-col w-full md:w-[320px] border-r border-gray-200
          ${selectedContact ? 'hidden md:flex' : 'flex'}
        `}
            >
                {/* Scrollable Sidebar */}
                <div className="flex flex-col h-full">
                    {/* Sticky Header */}
                    <div className="sticky top-0 bg-white h-18 border-b border-gray-200 z-10 p-4">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search contacts..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 h-9 text-sm"
                                />
                            </div>
                            <AddContact
                                trigger={
                                    <Button size="icon" variant="default" className="h-9 w-9">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                }
                                isAddContactOpen={isAddContactOpen}
                                setIsAddContactOpen={setIsAddContactOpen}
                                phoneNumber=""
                                contact={{
                                    id: '',
                                    identifiers: [],
                                    computedDisplayName: '',
                                    attributes: {},
                                    workspaceID: '',
                                    updatedAt: '',
                                    createdAt: ''
                                }}
                                onContactCreated={fetchContacts}
                            />
                        </div>
                        {/* <p className="text-xs text-gray-500 mt-2">
                            {filteredContacts.length} of {contacts.length} contacts
                        </p> */}
                    </div>

                    {/* Contact List */}
                    <div className="flex-1 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-3"></div>
                                    <p className="text-gray-500 text-sm">Loading contacts...</p>
                                </div>
                            </div>
                        ) : filteredContacts.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center max-w-sm mx-auto px-4">
                                    <Users className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                                    <h3 className="text-base font-semibold text-gray-800 mb-1">
                                        {searchTerm ? 'No contacts found' : 'No contacts yet'}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-3">
                                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first contact to get started'}
                                    </p>
                                    {!searchTerm && (
                                        <AddContact
                                            trigger={<Button className="gap-2 text-sm">
                                                <Plus className="h-4 w-4" />
                                                Add Contact
                                            </Button>}
                                            isAddContactOpen={isAddContactOpen}
                                            setIsAddContactOpen={setIsAddContactOpen}
                                            phoneNumber=""
                                            contact={{
                                                id: '',
                                                identifiers: [],
                                                computedDisplayName: '',
                                                attributes: {},
                                                workspaceID: '',
                                                updatedAt: '',
                                                createdAt: ''
                                            }}
                                            onContactCreated={fetchContacts}
                                        />
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {filteredContacts.map((contact) => (
                                    <div
                                        key={contact.id}
                                        className={`p-3 hover:bg-gray-50 transition-colors cursor-pointer ${selectedContact?.id === contact.id ? 'bg-gray-100' : ''
                                            }`}
                                        onClick={() => handleSelectContact(contact)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="text-sm font-medium">
                                                    {contact.computedDisplayName.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 truncate">{contact.computedDisplayName}</h3>
                                                <div className="flex items-center text-xs text-gray-500 mt-0.5">
                                                    <Phone className="h-3 w-3 mr-1 text-gray-400" />
                                                    {getPhoneNumber(contact)}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {new Date(contact.updatedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Contact Details */}
            <div
                className={`flex-1 ${selectedContact ? 'flex' : 'hidden md:flex'} flex-col`}
            >
                <ContactDetails
                    contact={selectedContact}
                    onBack={handleBackToList}
                    onEdit={() => console.log('Edit contact:', selectedContact?.id)}
                    onMessage={() => console.log('Message contact:', selectedContact?.id)}
                />
            </div>
        </div>
    );
}