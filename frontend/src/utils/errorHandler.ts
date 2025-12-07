import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

export interface ApiErrorResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: {
        message: string;
        errors: string | null;
    };
}

// Type guard for FetchBaseQueryError
export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === 'object' && error != null && 'status' in error;
}

// Type guard for SerializedError
export function isSerializedError(error: unknown): error is SerializedError {
    return typeof error === 'object' && error != null && 'message' in error && !('status' in error);
}

export const handleApiError = (error: unknown, defaultMessage: string = 'Request failed'): ApiErrorResponse => {
    // Handle RTK Query FetchBaseQueryError
    if (isFetchBaseQueryError(error)) {
        // Server responded with error status (e.g., 400, 401, 500)
        if (typeof error.status === 'number') {
            const responseData = error.data as Partial<ApiErrorResponse>;

            // Extract message from nested data.data.message structure
            const errorMessage = responseData?.data?.message || responseData?.message || 'Server Error';
            const errorDetails = responseData?.data?.errors || null;

            return {
                statusCode: error.status,
                data: {
                    message: errorMessage,
                    errors: errorDetails
                },
                message: defaultMessage,
                success: false
            };
        }

        // Network error (FETCH_ERROR)
        if (error.status === 'FETCH_ERROR') {
            return {
                statusCode: 0,
                data: {
                    message: 'Network Error',
                    errors: 'Please check your internet connection and try again'
                },
                message: defaultMessage,
                success: false
            };
        }

        // Timeout error
        if (error.status === 'TIMEOUT_ERROR') {
            return {
                statusCode: 408,
                data: {
                    message: 'Request Timeout',
                    errors: 'The request took too long to complete'
                },
                message: defaultMessage,
                success: false
            };
        }

        // Parsing error (invalid JSON response)
        if (error.status === 'PARSING_ERROR') {
            return {
                statusCode: 0,
                data: {
                    message: 'Parsing Error',
                    errors: 'Invalid response from server'
                },
                message: defaultMessage,
                success: false
            };
        }

        // Custom error
        if (error.status === 'CUSTOM_ERROR') {
            return {
                statusCode: 0,
                data: {
                    message: 'Error',
                    errors: error.error || 'Something went wrong'
                },
                message: defaultMessage,
                success: false
            };
        }
    }

    // Handle SerializedError
    if (isSerializedError(error)) {
        return {
            statusCode: 500,
            data: {
                message: 'Error',
                errors: error.message || 'Something went wrong'
            },
            message: defaultMessage,
            success: false
        };
    }

    // Non-RTK Query errors
    return {
        statusCode: 500,
        data: {
            message: 'Unexpected Error',
            errors: error instanceof Error ? error.message : 'Something went wrong'
        },
        message: defaultMessage,
        success: false
    };
};

// Simple helper to get just the error message
export const getErrorMessage = (error: unknown, defaultMessage: string = 'Something went wrong'): string => {
    const errorResponse = handleApiError(error, defaultMessage);
    return errorResponse.data.errors
        ? `${errorResponse.data.message}: ${errorResponse.data.errors}`
        : errorResponse.data.message;
};