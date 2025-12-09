import { baseApi } from './baseApi';

// Request interfaces
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

// Response interfaces
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

// API Response wrappers
export interface ContentSuccessResponse {
    statusCode: number;
    data: ContentResponse;
    message: string;
    success: boolean;
}

export interface ContentListSuccessResponse {
    statusCode: number;
    data: ContentResponseWithRange;
    message: string;
    success: boolean;
}

export interface ContentDeleteSuccessResponse {
    statusCode: number;
    data: {
        message: string;
    };
    message: string;
    success: boolean;
}

// Query parameters for getAllContents
export interface GetAllContentsParams {
    page: number;
    limit: number;
    tagId?: number;
}

export const contentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * Create new content
         */
        createContent: builder.mutation<ContentSuccessResponse, ContentCreateRequest>({
            query: (contentData) => ({
                url: '/register-content',
                method: 'POST',
                body: contentData,
            }),
            invalidatesTags: ['Content'],
        }),

        /**
         * Get content by ID
         */
        getContentById: builder.query<ContentSuccessResponse, number>({
            query: (id) => `/get-content-by-id/${id}`,
            providesTags: (result, error, id) => [{ type: 'Content', id }],
        }),

        /**
         * Get all contents with pagination and filtering
         */
        getAllContents: builder.query<ContentListSuccessResponse, GetAllContentsParams>({
            query: ({ page, limit, tagId }) => ({
                url: '/get-all-contents-by-range-and-tag',
                params: {
                    page,
                    limit,
                    ...(tagId !== undefined && { tagId }),
                },
            }),
            providesTags: ['Content'],
        }),

        /**
         * Update content by ID
         */
        updateContent: builder.mutation<ContentSuccessResponse, { id: number; data: ContentUpdateRequest }>({
            query: ({ id, data }) => ({
                url: `/update-content/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Content', id }, 'Content'],
        }),

        /**
         * Delete content by ID
         */
        deleteContent: builder.mutation<ContentDeleteSuccessResponse, number>({
            query: (id) => ({
                url: `/delete-content/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Content'],
        }),
    }),
});

// Export hooks for usage in components
export const {
    useCreateContentMutation,
    useGetContentByIdQuery,
    useGetAllContentsQuery,
    useUpdateContentMutation,
    useDeleteContentMutation,
} = contentApi;