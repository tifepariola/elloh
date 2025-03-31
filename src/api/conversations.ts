import api from "./axiosInstance";


export const listConversations = async () => {
    try {
        const response = await api.get("/conversations");
        return response.data;
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return [];
    }
};

export const listMessages = async (conversationID) => {
    try {
        const response = await api.get("/conversations/" + conversationID + "/messages");
        return response.data;
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return [];
    }
};

export const sendMessage = async (conversationID, message) => {
    try {
        const response = await api.post("/conversations/" + conversationID + "/messages", {
            "body": {
                "type": "text",
                "text": {
                    "text": message
                }
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error sending message:", error);
        return [];
    }
};