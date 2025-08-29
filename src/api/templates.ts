import axiosInstance from './axiosInstance';
import { 
    MessageTemplate, 
    CreateTemplateRequest, 
    UpdateTemplateRequest, 
    TemplatesResponse,
    TemplateVersionsResponse,
    ApiResponse 
} from '../types';

export const templatesApi = {
    // Get all templates
    getTemplates: async (page = 1, limit = 20): Promise<TemplatesResponse> => {
        const response = await axiosInstance.get(`/templates?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Get template by ID
    getTemplate: async (id: string): Promise<MessageTemplate> => {
        const response = await axiosInstance.get(`/templates/${id}`);
        return response.data;
    },

    // Create new template
    createTemplate: async (template: CreateTemplateRequest): Promise<MessageTemplate> => {
        const response = await axiosInstance.post('/templates', template);
        return response.data;
    },

    // Update template
    updateTemplate: async (id: string, template: UpdateTemplateRequest): Promise<MessageTemplate> => {
        const response = await axiosInstance.put(`/templates/${id}`, template);
        return response.data;
    },

    // Delete template
    deleteTemplate: async (id: string): Promise<ApiResponse<null>> => {
        const response = await axiosInstance.delete(`/templates/${id}`);
        return response.data;
    },

    // Toggle template active status
    toggleTemplateStatus: async (id: string, isActive: boolean): Promise<MessageTemplate> => {
        const response = await axiosInstance.patch(`/templates/${id}/status`, { isActive });
        return response.data;
    },

    // Get template versions
    getTemplateVersions: async (templateId: string): Promise<TemplateVersionsResponse> => {
        const response = await axiosInstance.get(`/templates/${templateId}/versions`);
        return response.data;
    },

    // Create new template version
    createTemplateVersion: async (templateId: string, versionData: {
        content: any;
        description?: string;
    }): Promise<any> => {
        const response = await axiosInstance.post(`/templates/${templateId}/versions`, versionData);
        return response.data;
    },

    // Update template version
    updateTemplateVersion: async (templateId: string, versionId: string, versionData: {
        content?: any;
        description?: string;
    }): Promise<any> => {
        const response = await axiosInstance.put(`/templates/${templateId}/versions/${versionId}`, versionData);
        return response.data;
    },

    // Delete template version
    deleteTemplateVersion: async (templateId: string, versionId: string): Promise<ApiResponse<null>> => {
        const response = await axiosInstance.delete(`/templates/${templateId}/versions/${versionId}`);
        return response.data;
    }
}; 