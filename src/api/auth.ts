import api from "./axiosInstance";

interface LoginResponse {
    challengeID: string;
}

interface CompleteLoginResponse {
    token: string;
}

export const login = async (email: string): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", {
        email,
    });
    return response.data;
};

export const completeLogin = async (challengeId: string, code: string): Promise<CompleteLoginResponse> => {
    const response = await api.post("/auth/complete", {
        code, challengeId,
    });
    return response.data;
};