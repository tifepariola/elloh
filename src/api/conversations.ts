import api from "./axiosInstance";
import { ConversationsResponse, Message } from "@/types";

export const listConversations = async (): Promise<ConversationsResponse> => {
    const response = await api.get("/conversations");
    return response.data;
};

import { EventsResponse } from "@/types";

export const listEvents = async (conversationID: string): Promise<EventsResponse> => {
    try {
        const response = await api.get("/conversations/" + conversationID + "/events");
        return response.data;
    } catch (error) {
        console.error("Error fetching events:", error);
        return { events: [] };
    }
};

// Legacy function for backward compatibility
export const listMessages = async (conversationID: string): Promise<EventsResponse> => {
    return listEvents(conversationID);
};

// Helper function to get only message events
export const getMessageEvents = (events: Event[]): Event[] => {
    return events.filter(event => event.type === 'message');
};

import { Event } from "@/types";

export const sendMessage = async (conversationID: string, message: Message): Promise<Event> => {
    const response = await api.post("/conversations/" + conversationID + "/messages", message);
    return response.data;

};

export const downloadMedia = async (mediaId: string): Promise<string> => {
    const response = await api.get("/media/" + mediaId + "/download");
    console.log("response", response.data);
    return response.data.url;
};

export const listMessageTemplates = async (): Promise<any> => {
    const response = await api.get("/message-templates");
    return response.data;
};