import axios from 'axios';

import { authService } from '../../services/auth.service';
import { API_CONFIG } from '../../config/api.constants';

// Use centralized API config
const BASE_URL = API_CONFIG.BASE_URL;

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request Interceptor: Inject Token
apiClient.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle 401
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('[API] Unauthorized - redirecting to login');
            authService.logout();
            // Optional: trigger a redirect event or rely on auth state change
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

