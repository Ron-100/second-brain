import axios, { type AxiosResponse } from 'axios';
import config from '../config/config';
import { handleApiError } from '../utils';

export interface ContentCreateRequest {
    uniqueId: string;
    title: string;
    content: string;
    url: string;
    tagId: number;
    linkId?: number | null;
}

export interface ContentUpdateRequest {
    title?: string;
    content?: string;
    url?: string;
    tagId?: number;
    linkId?: number | null;
}

export interface ContentResponse {
    id: number;
    uniqueId: string;
    title: string;
    content: string;
    url?: string;
    userId: number;
    tag: string;
    link?: string;
}

export interface ContentResponseWithRange {
    totalLinks: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    contents: ContentResponse[];
}

interface ContentSuccessResponse {
    statusCode: number;
    data: ContentResponse;
    message: string;
    success: boolean;
}

interface ContentListSuccessResponse {
    statusCode: number;
    data: ContentResponseWithRange;
    message: string;
    success: boolean;
}

interface ContentDeleteSuccessResponse {
    statusCode: number;
    data: {
        message: string;
    };
    message: string;
    success: boolean;
}

const apiClient = axios.create({
    baseURL: config.apiendpointurl,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const createContent = async (contentData: ContentCreateRequest): Promise<ContentSuccessResponse> => {
    try {
        const response: AxiosResponse<ContentSuccessResponse> = await apiClient.post('/register-content', contentData);
        return response.data;
    } catch (error: unknown) {
        throw handleApiError(error);
    }
};

export const getContentById = async (id: number): Promise<ContentSuccessResponse> => {
    try {
        const response: AxiosResponse<ContentSuccessResponse> = await apiClient.get(`/content/${id}`);
        return response.data;
    } catch (error: unknown) {
        throw handleApiError(error);
    }
};

export const getAllContents = async (
    page: number = 1,
    limit: number = 10,
    tagId?: number
): Promise<ContentListSuccessResponse> => {
    try {
        const params: Record<string, string | number> = {
            page,
            limit
        };

        if (tagId !== undefined && tagId > 0) {
            params.tagId = tagId;
        }

        const response: AxiosResponse<ContentListSuccessResponse> = await apiClient.get('/content', { params });
        return response.data;
    } catch (error: unknown) {
        throw handleApiError(error);
    }
};

export const updateContent = async (id: number, contentData: ContentUpdateRequest): Promise<ContentSuccessResponse> => {
    try {
        const response: AxiosResponse<ContentSuccessResponse> = await apiClient.put(`/content/${id}`, contentData);
        return response.data;
    } catch (error: unknown) {
        throw handleApiError(error);
    }
};

export const deleteContent = async (id: number): Promise<ContentDeleteSuccessResponse> => {
    try {
        const response: AxiosResponse<ContentDeleteSuccessResponse> = await apiClient.delete(`/content/${id}`);
        return response.data;
    } catch (error: unknown) {
        throw handleApiError(error);
    }
};