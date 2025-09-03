import { useRef, useState } from "react";
import { listConversations, getContact } from "@/api";
import { Conversation, Contact } from "@/types";

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cache contacts so we don’t refetch them unnecessarily
  const contactsMap = useRef<Record<string, Contact>>({});

  const getConversations = async (refresh = false) => {
    try {
      if (refresh) {
        setIsLoading(true);
      }

      const data = await listConversations();
      const conversationsData: Conversation[] = data.conversations || [];

      // Attach cached contact if available, otherwise fetch
      const conversationsWithContacts = await Promise.all(
        conversationsData.map(async (conv) => {
          if (conv.contactID) {
            if (!contactsMap.current[conv.contactID]) {
              try {
                const contactData = await getContact(conv.contactID);
                contactsMap.current[conv.contactID] = contactData;
              } catch {
                // In case contact fetch fails, skip attaching
                return conv;
              }
            }
            return { ...conv, contact: contactsMap.current[conv.contactID] };
          }
          return conv;
        })
      );

      setConversations(conversationsWithContacts);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { conversations, getConversations, isLoading };
};