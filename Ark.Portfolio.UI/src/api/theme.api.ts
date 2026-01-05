/**
 * @fileoverview Theme API Client
 * Functions for fetching theme data from the backend API.
 * 
 * @module api/theme.api
 * @author Armand Richelet-Kleinberg
 */

import { apiClient } from './client';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Theme list item (without CSS content for performance).
 */
export interface ThemeListItem {
    id: number;
    name: string;
    slug: string;
    description?: string;
    previewColor?: string;
    icon?: string;
    isDefault: boolean;
    order: number;
}

/**
 * Theme detail with full CSS content.
 */
export interface ThemeDetail extends ThemeListItem {
    cssContent: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// API FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fetches all active themes (without CSS content).
 * 
 * @returns Promise resolving to array of theme list items
 */
export async function fetchThemes(): Promise<ThemeListItem[]> {
    try {
        return await apiClient.get<ThemeListItem[]>('/themes');
    } catch (error) {
        console.warn('Failed to fetch themes from backend:', error);
        return [];
    }
}

/**
 * Fetches a specific theme by slug with full CSS content.
 * 
 * @param slug - Theme slug identifier
 * @returns Promise resolving to theme detail or null if not found
 */
export async function fetchThemeBySlug(slug: string): Promise<ThemeDetail | null> {
    try {
        return await apiClient.get<ThemeDetail>(`/themes/${slug}`);
    } catch (error) {
        console.warn(`Failed to fetch theme '${slug}' from backend:`, error);
        return null;
    }
}

/**
 * Fetches the default theme with full CSS content.
 * 
 * @returns Promise resolving to default theme or null if not configured
 */
export async function fetchDefaultTheme(): Promise<ThemeDetail | null> {
    try {
        return await apiClient.get<ThemeDetail>('/themes/default');
    } catch (error) {
        console.warn('Failed to fetch default theme from backend:', error);
        return null;
    }
}
