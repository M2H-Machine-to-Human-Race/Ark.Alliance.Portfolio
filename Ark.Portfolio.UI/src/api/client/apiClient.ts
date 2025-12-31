import axios from 'axios';

// Environment variable handling would go here
const BASE_URL = 'http://localhost:3000/api';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
});

// Interceptors can be added here for auth tokens, logging, etc.
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Global error handling logic
        console.warn('API Error:', error);
        return Promise.reject(error);
    }
);

