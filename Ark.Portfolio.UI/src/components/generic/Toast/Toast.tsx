/**
 * @fileoverview Toast Notification Component
 * Displays toast notifications with different variants (success, error, warning, info).
 * 
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { ToastType } from './Toast.enum';
import './Toast.styles.css';

/**
 * Icon mapping for toast types
 */
const TOAST_ICONS: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />
};

/**
 * Toast Container Component
 * Renders all active toast notifications.
 * Place this component once in your app (usually in App.tsx).
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ToastProvider>
 *       <Router>...</Router>
 *       <ToastContainer />
 *     </ToastProvider>
 *   );
 * }
 * ```
 */
export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`toast toast--${toast.type}`}
                    role="alert"
                    aria-live="polite"
                >
                    <div className="toast__icon">
                        {TOAST_ICONS[toast.type]}
                    </div>
                    <div className="toast__message">
                        {toast.message}
                    </div>
                    <button
                        className="toast__close"
                        onClick={() => removeToast(toast.id)}
                        aria-label="Close notification"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
