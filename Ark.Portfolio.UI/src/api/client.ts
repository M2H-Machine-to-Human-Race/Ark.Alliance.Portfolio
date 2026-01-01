import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Define configuration to allow switching mock/real
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
// Enable usage of mocks if VITE_USE_MOCKS is true OR if request fails and we are in DEV mode
const FORCE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
const ALLOW_FALLBACK = import.meta.env.DEV || import.meta.env.VITE_ALLOW_MOCK_FALLBACK === 'true';

export class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async get<T>(url: string, config?: AxiosRequestConfig, mockData?: T): Promise<T> {
        try {
            const response = await this.client.get<T>(url, config);
            return response.data;
        } catch (error) {
            // Check if we should fallback (Explicitly forced OR in DEV/Allowed mode w/ failure)
            if ((FORCE_MOCKS || ALLOW_FALLBACK) && mockData) {
                console.warn(`API call to ${url} failed. Falling back to mock data.`);
                return mockData;
            }
            throw error;
        }
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig, mockData?: T): Promise<T> {
        try {
            const response = await this.client.post<T>(url, data, config);
            return response.data;
        } catch (error) {
            // Check if we should fallback (Explicitly forced OR in DEV/Allowed mode w/ failure)
            if ((FORCE_MOCKS || ALLOW_FALLBACK) && mockData) {
                console.warn(`API call to ${url} failed. Falling back to mock data.`);
                return mockData;
            }
            throw error;
        }
    }
}

export const apiClient = new ApiClient();

