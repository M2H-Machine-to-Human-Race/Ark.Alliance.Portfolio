/**
 * Theme Helper Functions
 * Utility functions for theme management.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { ThemeVariant } from './ThemeContext.types';
import { THEME_STORAGE_KEY, DEFAULT_THEME, THEME_CONFIGS } from './ThemeContext.config';

/**
 * Retrieves the stored theme preference from localStorage.
 * @returns The stored theme or default if none stored
 */
export function getStoredTheme(): ThemeVariant {
    if (typeof window === 'undefined') return DEFAULT_THEME;

    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && (stored === 'default' || stored === 'architectural' || stored === 'aloevera')) {
        return stored;
    }
    return DEFAULT_THEME;
}

/**
 * Persists theme preference to localStorage.
 * @param theme - Theme variant to store
 */
export function storeTheme(theme: ThemeVariant): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * Gets the next theme in rotation.
 * @param current - Current theme variant
 * @returns Next theme variant
 */
export function getNextTheme(current: ThemeVariant): ThemeVariant {
    const themes = Object.keys(THEME_CONFIGS) as ThemeVariant[];
    const currentIndex = themes.indexOf(current);
    const nextIndex = (currentIndex + 1) % themes.length;
    return themes[nextIndex];
}

/**
 * Gets the theme configuration for a variant.
 * @param variant - Theme variant
 * @returns Theme configuration
 */
export function getThemeConfig(variant: ThemeVariant) {
    return THEME_CONFIGS[variant];
}

