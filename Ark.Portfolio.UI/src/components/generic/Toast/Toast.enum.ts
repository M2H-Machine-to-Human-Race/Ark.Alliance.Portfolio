/**
 * @fileoverview Toast Enums
 * Enumerations for toast notification types.
 * 
 * @author Armand Richelet-Kleinberg
 */

/**
 * Toast notification type variants.
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast notification type constants for type-safe usage.
 */
export const ToastTypeEnum = {
    SUCCESS: 'success' as ToastType,
    ERROR: 'error' as ToastType,
    WARNING: 'warning' as ToastType,
    INFO: 'info' as ToastType
} as const;
