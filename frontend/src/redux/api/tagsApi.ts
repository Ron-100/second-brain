import { baseApi } from './baseApi';

export interface TagResponse {
    statusCode: number;
    data: {
        id: number;
        name: string;
    }[];
    message: string;
    success: boolean;
}

export const tagsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * Get all tags endpoint
         */
        getTags: builder.query<TagResponse, void>({
            query: () => '/get-all-tags',
            keepUnusedDataFor: 600,
            providesTags: ['Tag'],
        }),
    }),
});

// Export hooks for usage in components
export const {
    useGetTagsQuery
} = tagsApi;