/**
 * @fileoverview Application Defaults Configuration
 * Centralized constants for hardcoded values across the application.
 * 
 * @author Armand Richelet-Kleinberg
 */

// ============================================
// Media Placeholders
// ============================================
export const PLACEHOLDER_IMAGES = {
    noImage: 'https://via.placeholder.com/120x68?text=No+Image',
    avatar: 'https://via.placeholder.com/100x100?text=Avatar',
    project: 'https://via.placeholder.com/300x200?text=Project',
    carousel: 'https://via.placeholder.com/1920x600?text=Slide'
};

// ============================================
// API Configuration
// Uses HTTP by default, configure VITE_API_URL for HTTPS
// ============================================
export const API_CONFIG = {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3085/api',
    timeout: 30000
};

// ============================================
// Pagination Defaults
// ============================================
export const PAGINATION = {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100]
};

// ============================================
// UI Defaults
// ============================================
export const UI_DEFAULTS = {
    debounceMs: 300,
    toastDurationMs: 3000
};

