/**
 * @fileoverview Theme Manager Model
 * MVVM-compliant viewmodel for Admin Theme Management page.
 * 
 * @module pages/Admin/Themes
 * @author Armand Richelet-Kleinberg
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../api/client/apiClient';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Theme data structure from API
 */
export interface AdminTheme {
    id: number;
    name: string;
    slug: string;
    description?: string;
    cssContent: string;
    previewColor?: string;
    icon?: string;
    isDefault: boolean;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Theme form data for create/update
 */
export interface ThemeFormData {
    name: string;
    slug: string;
    description?: string;
    cssContent: string;
    previewColor?: string;
    icon?: string;
    isDefault?: boolean;
    order?: number;
    isActive?: boolean;
}

/**
 * Theme Manager ViewModel interface
 */
export interface ThemeManagerModel {
    themes: AdminTheme[];
    isLoading: boolean;
    error: string | null;
    selectedTheme: AdminTheme | null;
    isEditing: boolean;
    isSaving: boolean;

    // Actions
    loadThemes: () => Promise<void>;
    createTheme: (data: ThemeFormData) => Promise<boolean>;
    updateTheme: (id: number, data: ThemeFormData) => Promise<boolean>;
    deleteTheme: (id: number) => Promise<boolean>;
    setDefaultTheme: (id: number) => Promise<boolean>;
    reorderThemes: (themeIds: number[]) => Promise<boolean>;

    // UI State
    setSelectedTheme: (theme: AdminTheme | null) => void;
    setIsEditing: (editing: boolean) => void;
    clearError: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// API CLIENT CONFIG
// ═══════════════════════════════════════════════════════════════════════════

// Using centralized client, we shouldn't need manual config here usually.
// But we might need the URL prefix if apiClient base is generic.
// Assuming apiClient base is generic /api.
const ADMIN_THEMES_URL = '/admin/themes';

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Theme Manager ViewModel Hook
 */
export function useThemeManagerModel(): ThemeManagerModel {
    const [themes, setThemes] = useState<AdminTheme[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTheme, setSelectedTheme] = useState<AdminTheme | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    /**
     * Load all themes from API
     */
    const loadThemes = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get(ADMIN_THEMES_URL);
            setThemes(response.data || []);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load themes';
            setError(message);
            console.error('Failed to load themes:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Create a new theme
     */
    const createTheme = useCallback(async (data: ThemeFormData): Promise<boolean> => {
        setIsSaving(true);
        setError(null);
        try {
            await apiClient.post(ADMIN_THEMES_URL, data);
            await loadThemes();
            setIsEditing(false);
            setSelectedTheme(null);
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to create theme';
            setError(message);
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [loadThemes]);

    /**
     * Update an existing theme
     */
    const updateTheme = useCallback(async (id: number, data: ThemeFormData): Promise<boolean> => {
        setIsSaving(true);
        setError(null);
        try {
            await apiClient.put(`${ADMIN_THEMES_URL}/${id}`, data);
            await loadThemes();
            setIsEditing(false);
            setSelectedTheme(null);
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update theme';
            setError(message);
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [loadThemes]);

    /**
     * Delete a theme
     */
    const deleteTheme = useCallback(async (id: number): Promise<boolean> => {
        setError(null);
        try {
            await apiClient.delete(`${ADMIN_THEMES_URL}/${id}`);
            await loadThemes();
            return true;
        } catch (err: unknown) {
            const axiosError = err as { response?: { data?: { message?: string } } };
            const message = axiosError.response?.data?.message || 'Failed to delete theme';
            setError(message);
            return false;
        }
    }, [loadThemes]);

    /**
     * Set a theme as default
     */
    const setDefaultTheme = useCallback(async (id: number): Promise<boolean> => {
        setError(null);
        try {
            await apiClient.put(`${ADMIN_THEMES_URL}/${id}/set-default`, {});
            await loadThemes();
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to set default theme';
            setError(message);
            return false;
        }
    }, [loadThemes]);

    /**
     * Reorder themes
     */
    const reorderThemes = useCallback(async (themeIds: number[]): Promise<boolean> => {
        setError(null);
        try {
            await apiClient.put(`${ADMIN_THEMES_URL}/reorder`, { themeIds });
            await loadThemes();
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to reorder themes';
            setError(message);
            return false;
        }
    }, [loadThemes]);

    /**
     * Clear error state
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Load themes on mount
    useEffect(() => {
        loadThemes();
    }, [loadThemes]);

    return {
        themes,
        isLoading,
        error,
        selectedTheme,
        isEditing,
        isSaving,
        loadThemes,
        createTheme,
        updateTheme,
        deleteTheme,
        setDefaultTheme,
        reorderThemes,
        setSelectedTheme,
        setIsEditing,
        clearError
    };
}

export default useThemeManagerModel;
