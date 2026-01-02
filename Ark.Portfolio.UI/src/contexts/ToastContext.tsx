/**
 * @fileoverview Toast Notification Context
 * Provides global toast notification functionality across the application.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastType } from '../components/generic/Toast/Toast.enum';

/**
 * Toast notification data structure
 */
export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration: number;
}

/**
 * Toast context value interface
 */
interface ToastContextValue {
    toasts: Toast[];
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * Toast Provider Props
 */
interface ToastProviderProps {
    children: ReactNode;
}

/**
 * Toast Provider Component
 * Wrap your app with this provider to enable global toast notifications.
 * 
 * @example
 * ```tsx
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * ```
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((
        message: string,
        type: ToastType = 'info',
        duration: number = 4000
    ) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newToast: Toast = { id, message, type, duration };

        setToasts(prev => [...prev, newToast]);

        // Auto-remove toast after duration
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
};

/**
 * Hook to access toast notifications
 * 
 * @returns Toast context with showToast and removeToast functions
 * @throws Error if used outside of ToastProvider
 * 
 * @example
 * ```tsx
 * const { showToast } = useToast();
 * showToast('Project saved successfully!', 'success');
 * ```
 */
export const useToast = (): ToastContextValue => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
