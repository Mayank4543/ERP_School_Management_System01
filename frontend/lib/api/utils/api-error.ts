import axios from 'axios';

export interface ApiErrorResult {
    message: string;
    code?: string;
    fieldErrors?: Record<string, string>;
}

export function parseApiError(
    error: unknown,
    fallbackMessage: string,
): ApiErrorResult {
    if (!axios.isAxiosError(error)) {
        return {
            message: fallbackMessage,
        };
    }

    const data = error.response?.data;

    if (!data) {
        return {
            message: 'Unable to connect to the server. Please try again.',
        };
    }
    const err = data.error ?? data;

    return {
        message:
            typeof err.message === 'string'
                ? err.message
                : fallbackMessage,

        code: err.code,

        fieldErrors: err.errors,
    };
}