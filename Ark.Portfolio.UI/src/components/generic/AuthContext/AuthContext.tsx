import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User } from '../../../services/auth.service';

interface AuthContextType {
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    const login = (token: string, userData: User) => {
        setUser(userData);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const changePassword = async (oldPassword: string, newPassword: string) => {
        await authService.changePassword(oldPassword, newPassword);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, changePassword, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

