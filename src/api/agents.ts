import { Agent } from "@/types";
import api from "./axiosInstance";


export const listAgents = async (): Promise<{ agents: Agent[], count: number }> => {
    const response = await api.get("/agents");
    return response.data;
};
