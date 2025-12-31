import axios from 'axios';

const API_URL = 'http://localhost:5085/api/auth';

export interface User {
    id: string;
    username: string;
    role: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

class AuthService {
    async login(username: string, password: string): Promise<LoginResponse> {
        const response = await axios.post<LoginResponse>(`${API_URL}/login`, { username, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    }

    async changePassword(oldPassword: string, newPassword: string): Promise<void> {
        const token = this.getToken();
        await axios.post(`${API_URL}/change-password`,
            { oldPassword, newPassword },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}

export const authService = new AuthService();

