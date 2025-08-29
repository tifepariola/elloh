// Authentication types
export interface User {
    id?: string;
    email: string;
    name?: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, email: string) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

// Contact types
export interface Contact {
    id: string;
    workspaceID: string;
    attributes: {
        firstName?: string;
        lastName?: string;
        [key: string]: any;
    };
    identifiers: Array<{
        type: string;
        value: string;
    }>;
    computedDisplayName: string;
    updatedAt: string;
    createdAt: string;
}

// Conversation types
export interface Conversation {
    id: string;
    workspaceID: string;
    title: string;
    status: string;
    platform: string;
    channelID: string;
    contactID: string;
    updatedAt: string;
    createdAt: string;
    assignedAgentID: string;
    contact?: Contact;
    lastEvent?: Event;
}

// Event types (for messages and other conversation events)
export interface Event {
    id: string;
    workspaceID: string;
    type: string;
    message: {
        status: string;
        statusReason?: string;
        body: {
            type: string;
            text: string;
            image: {
                id: string;
                text?: string;
            };
        };
    };
    actorID: string;
    actorType: string;
    conversationID: string;
    updatedAt: string;
    createdAt: string;
}

// Legacy Message type for backward compatibility
export interface Message {
    body: {
        type: string;
        text?: string;
        image?: {
            id: string;
            text?: string;
        };
    };
}

// API Response types
export interface ApiResponse<T> {
    data: T;
    message?: string;
    status?: string;
}

export interface ConversationsResponse {
    conversations: Conversation[];
    total?: number;
    page?: number;
    limit?: number;
}

export interface EventsResponse {
    events: Event[];
    total?: number;
    page?: number;
    limit?: number;
}

export interface MessagesResponse {
    messages: Message[];
    total?: number;
    page?: number;
    limit?: number;
}

export interface Agent {
    id: string;
    firstName: string;
    lastName: string;
    status: "active" | "inactive";
    createdAt: string;
    updatedAt: string;
}

// Message Template types
export interface MessageTemplate {
    id: string;
    workspaceID: string;
    name: string;
    status: "active" | "inactive";
    platform: string;
    liveVersionID: string;
    draftVersionID: string | null;
    platformReference: string;
    platformMetadata: {
        category: string;
    };
    content: string;
    updatedAt: string;
    createdAt: string;
    publishedAt: string;
}

export interface CreateTemplateRequest {
    name: string;
    platform: string;
    category: string;
}

export interface UpdateTemplateRequest {
    name?: string;
    platform?: string;
    category?: string;
    isActive?: boolean;
}

export interface TemplatesResponse {
    templates: MessageTemplate[];
    total?: number;
    page?: number;
    limit?: number;
}

// Template Version types
export interface TemplateBlock {
    type: string;
    role: string;
    text: string;
}

export interface TemplateContent {
    locale: string;
    blocks: TemplateBlock[];
    channelID: string;
}

export interface TemplateVersion {
    id: string;
    workspaceID: string;
    status: "live" | "draft" | "rejected";
    content: TemplateContent;
    templateID: string;
    description: string;
    updatedAt: string;
    createdAt: string;
}

export interface TemplateVersionsResponse {
    count: number;
    versions: TemplateVersion[];
}