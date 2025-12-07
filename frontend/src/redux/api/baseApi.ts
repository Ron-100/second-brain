import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../config/config';

/**
 * Base API configuration
 * Shared configuration for all feature APIs
 * Feature APIs can extend this using injectEndpoints()
 */
export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: config.apiendpointurl,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),

    tagTypes: [
        'Tag',
        'Content',
        'User',
    ],

    endpoints: () => ({}),
});