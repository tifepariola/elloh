import api from "./axiosInstance";
import { Contact } from "@/types";

export const getContact = async (contactId: string): Promise<Contact | null> => {
    try {
        const response = await api.get(`/contacts/${contactId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching contact:", error);
        return null;
    }
};

export const listContacts = async (): Promise<Contact[]> => {
    try {
        const response = await api.get("/contacts");
        return response.data;
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return [];
    }
}; 