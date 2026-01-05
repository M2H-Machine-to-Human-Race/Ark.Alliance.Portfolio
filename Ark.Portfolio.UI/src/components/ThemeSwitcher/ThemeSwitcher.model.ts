/**
 * @fileoverview ThemeSwitcher ViewModel
 * MVVM-compliant model for the ThemeSwitcher component
 * Enhanced with backend API integration for dynamic theme loading
 * 
 * @module components/ThemeSwitcher
 * @author Armand Richelet-Kleinberg
 */

import { useState, useEffect, useCallback } from 'react';
import { useCyberTheme, CyberThemeMode } from '../../contexts/CyberThemeContext';
import { fetchThemes, ThemeListItem } from '../../api/theme.api';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Theme configuration data
 */
export interface ThemeConfigItem {
    /** Theme mode key */
    mode: CyberThemeMode;
    /** Display label */
    label: string;
    /** Icon character/emoji */
    icon: string;
    /** Brief description */
    description: string;
    /** Preview color for theme card indicator */
    previewColor?: string;
}

/**
 * ThemeSwitcher ViewModel interface
 */
export interface ThemeSwitcherModel {
    /** Current active cyber theme mode */
    currentTheme: CyberThemeMode;
    /** Available theme configurations */
    themes: ThemeConfigItem[];
    /** Whether themes are loading from API */
    isLoading: boolean;
    /** Check if a theme is currently active */
    isActive: (mode: CyberThemeMode) => boolean;
    /** Select a theme */
    selectTheme: (mode: CyberThemeMode) => void;
    /** Cycle to next theme */
    cycleTheme: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Static theme configurations (fallback when API unavailable)
 */
export const THEME_CONFIGS: ThemeConfigItem[] = [
    {
        mode: 'normal',
        label: 'Normal',
        icon: '⚡',
        description: 'Balanced neon glow',
        previewColor: '#00d4ff'
    },
    {
        mode: 'neon',
        label: 'Neon',
        icon: '✨',
        description: 'Maximum intensity',
        previewColor: '#00ffff'
    },
    {
        mode: 'minimal',
        label: 'Minimal',
        icon: '○',
        description: 'Reduced effects',
        previewColor: '#0099ff'
    },
    {
        mode: 'glass',
        label: 'Glass',
        icon: '◇',
        description: 'Ultra glassmorphism',
        previewColor: '#7dd3fc'
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Convert backend theme to frontend config format
 */
function mapBackendTheme(theme: ThemeListItem): ThemeConfigItem {
    return {
        mode: theme.slug as CyberThemeMode,
        label: theme.name,
        icon: theme.icon || '◆',
        description: theme.description || '',
        previewColor: theme.previewColor
    };
}

/**
 * Validate if a slug is a valid CyberThemeMode
 */
function isValidThemeMode(slug: string): slug is CyberThemeMode {
    return ['normal', 'neon', 'minimal', 'glass'].includes(slug);
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ThemeSwitcher ViewModel Hook
 * 
 * Provides all state and actions for the ThemeSwitcher component.
 * Fetches themes from backend API with fallback to static configs.
 * Following MVVM pattern to separate business logic from presentation.
 * 
 * @returns ThemeSwitcherModel - viewmodel with state and actions
 * 
 * @example
 * ```tsx
 * const vm = useThemeSwitcherModel();
 * console.log(vm.currentTheme); // 'normal'
 * vm.selectTheme('neon');
 * ```
 */
export function useThemeSwitcherModel(): ThemeSwitcherModel {
    const { cyberTheme, setCyberTheme, cycleCyberTheme } = useCyberTheme();
    const [themes, setThemes] = useState<ThemeConfigItem[]>(THEME_CONFIGS);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Fetch themes from backend and merge with static configs
     */
    const loadThemes = useCallback(async () => {
        setIsLoading(true);
        try {
            const backendThemes = await fetchThemes();

            if (backendThemes && backendThemes.length > 0) {
                // Filter to only valid theme modes and map to config format
                const validThemes = backendThemes
                    .filter(t => isValidThemeMode(t.slug))
                    .sort((a, b) => a.order - b.order)
                    .map(mapBackendTheme);

                if (validThemes.length > 0) {
                    setThemes(validThemes);
                }
            }
            // If backend returns empty, keep static configs
        } catch (error) {
            console.warn('Failed to fetch themes, using static fallback:', error);
            // Keep static configs on error
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch themes on mount
    useEffect(() => {
        loadThemes();
    }, [loadThemes]);

    /**
     * Check if a specific theme mode is active
     */
    const isActive = (mode: CyberThemeMode): boolean => {
        return cyberTheme === mode;
    };

    /**
     * Select a theme mode
     */
    const selectTheme = (mode: CyberThemeMode): void => {
        setCyberTheme(mode);
    };

    /**
     * Cycle to the next theme
     */
    const cycleTheme = (): void => {
        cycleCyberTheme();
    };

    return {
        currentTheme: cyberTheme,
        themes,
        isLoading,
        isActive,
        selectTheme,
        cycleTheme
    };
}

export default useThemeSwitcherModel;
