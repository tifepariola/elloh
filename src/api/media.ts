import axios from "axios";
import api from "./axiosInstance";

export const startSignedUpload = async (mimeType: string): Promise<any> => {
    const response = await api.post("/media/upload", { mimeType });
    return response.data;
};

export const uploadMedia = async (url: string, file: File): Promise<any> => {
    const response = await axios.put(url, file, {
        headers: {
            "Content-Type": file.type,
        },
    });
    return response.data;
};

export const confirmSignedUpload = async (mediaId: string): Promise<string> => {
    const response = await api.post(`/media/${mediaId}/confirm-upload`);
    return response.data;
};

export const downloadMedia = async (mediaId: string): Promise<{ link: string }> => {
    const response = await api.get(`/media/${mediaId}/download`);
    return response.data;
};