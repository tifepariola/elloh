import api from "./axiosInstance";
import { Contact } from "@/types";

export const getContact = async (contactId: string): Promise<Contact> => {
    const response = await api.get(`/contacts/${contactId}`);
    return response.data;
};

export const listContacts = async (): Promise<Contact[]> => {
    try {
        const response = await api.get("/contacts");
        return response.data.contacts;
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return [];
    }
};

export const createContact = async (contactData: {
    attributes: {
        firstName?: string;
        lastName?: string;
    };
    identifiers: Array<{
        type: string;
        value: string;
    }>;
}): Promise<Contact> => {
    try {
        const response = await api.post("/contacts", contactData);
        return response.data;
    } catch (error) {
        console.error("Error creating contact:", error);
        throw error;
    }
}; 