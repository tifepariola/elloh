import React, { createContext, useContext, useEffect, useState } from "react";
import { listAgents } from "@/api/agents";
import { Agent } from "@/types";

interface AgentContextType {
    agents: Agent[];
    loading: boolean;
    error: string | null;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const { agents } = await listAgents();
                setAgents(agents);
            } catch (err) {
                setError("Failed to load agents");
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
    }, []);

    return (
        <AgentContext.Provider value={{ agents, loading, error }}>
            {children}
        </AgentContext.Provider>
    );
};

export const useAgents = () => {
    const context = useContext(AgentContext);
    if (!context) throw new Error("useAgents must be used within AgentProvider");
    return context;
};