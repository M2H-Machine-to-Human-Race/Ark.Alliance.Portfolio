/**
 * @fileoverview Cyber Theme Context
 * Manages visual effect modes for cyber-futuristic styling
 * Supports dynamic CSS injection from backend and localStorage persistence
 * 
 * @module contexts/CyberThemeContext
 * @author Armand Richelet-Kleinberg
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { fetchDefaultTheme, fetchThemeBySlug, ThemeDetail } from '../api/theme.api';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Available cyber theme modes for visual effects
 */
export type CyberThemeMode = 'professional' | 'normal' | 'neon' | 'minimal' | 'glass';

/**
 * Cyber theme context value
 */
interface CyberThemeContextValue {
    /** Current cyber theme mode */
    cyberTheme: CyberThemeMode;
    /** Set cyber theme mode */
    setCyberTheme: (theme: CyberThemeMode) => void;
    /** Toggle between cyber themes */
    cycleCyberTheme: () => void;
    /** Whether theme CSS is currently loading */
    isLoadingTheme: boolean;
    /** Load and inject CSS for a specific theme from backend */
    loadThemeCss: (slug: string) => Promise<void>;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const CyberThemeContext = createContext<CyberThemeContextValue | undefined>(undefined);

const CYBER_THEME_STORAGE_KEY = 'ark-portfolio-cyber-theme';
const DYNAMIC_THEME_STYLE_ID = 'ark-dynamic-theme-css';
const CYBER_THEME_MODES: CyberThemeMode[] = ['professional', 'normal', 'neon', 'minimal', 'glass'];

// ═══════════════════════════════════════════════════════════════════════════
// CSS INJECTION UTILITY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Injects CSS content into a dynamic style element in the document head.
 * Replaces any existing dynamic theme CSS.
 * 
 * @param cssContent - CSS string to inject
 */
function injectThemeCss(cssContent: string): void {
    // Remove existing dynamic theme style if present
    const existingStyle = document.getElementById(DYNAMIC_THEME_STYLE_ID);
    if (existingStyle) {
        existingStyle.remove();
    }

    // Create and inject new style element
    if (cssContent) {
        const styleElement = document.createElement('style');
        styleElement.id = DYNAMIC_THEME_STYLE_ID;
        styleElement.textContent = cssContent;
        document.head.appendChild(styleElement);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════════════

interface CyberThemeProviderProps {
    children: ReactNode;
    defaultCyberTheme?: CyberThemeMode;
}

/**
 * Cyber Theme Provider Component
 * Manages visual effect modes with:
 * - localStorage persistence for user preference
 * - Backend sync to fetch default theme on first load
 * - Dynamic CSS injection from backend theme data
 */
export const CyberThemeProvider: React.FC<CyberThemeProviderProps> = ({
    children,
    defaultCyberTheme = 'professional'
}) => {
    const [isLoadingTheme, setIsLoadingTheme] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);

    // Initialize cyber theme from localStorage or default
    const [cyberTheme, setCyberThemeState] = useState<CyberThemeMode>(() => {
        try {
            const stored = localStorage.getItem(CYBER_THEME_STORAGE_KEY);
            if (stored && CYBER_THEME_MODES.includes(stored as CyberThemeMode)) {
                return stored as CyberThemeMode;
            }
        } catch (error) {
            console.warn('Failed to read cyber theme from localStorage:', error);
        }
        return defaultCyberTheme;
    });

    /**
     * Load and inject CSS for a specific theme from backend
     */
    const loadThemeCss = useCallback(async (slug: string): Promise<void> => {
        setIsLoadingTheme(true);
        try {
            const theme = await fetchThemeBySlug(slug);
            if (theme?.cssContent) {
                injectThemeCss(theme.cssContent);
            }
        } catch (error) {
            console.warn(`Failed to load theme CSS for '${slug}':`, error);
        } finally {
            setIsLoadingTheme(false);
        }
    }, []);

    // Sync with backend default theme on first mount (if no localStorage preference)
    useEffect(() => {
        const initializeTheme = async () => {
            try {
                const storedTheme = localStorage.getItem(CYBER_THEME_STORAGE_KEY);

                // If user has no stored preference, fetch default from backend
                if (!storedTheme) {
                    const defaultTheme = await fetchDefaultTheme();
                    if (defaultTheme && CYBER_THEME_MODES.includes(defaultTheme.slug as CyberThemeMode)) {
                        setCyberThemeState(defaultTheme.slug as CyberThemeMode);
                        if (defaultTheme.cssContent) {
                            injectThemeCss(defaultTheme.cssContent);
                        }
                    }
                } else {
                    // Load CSS for the stored theme preference
                    await loadThemeCss(storedTheme);
                }
            } catch (error) {
                console.warn('Failed to initialize theme from backend:', error);
            } finally {
                setHasInitialized(true);
            }
        };

        initializeTheme();
    }, [loadThemeCss]);

    // Apply cyber theme attribute to document element and load CSS when theme changes
    useEffect(() => {
        document.documentElement.setAttribute('data-cyber-theme', cyberTheme);

        // Persist to localStorage
        try {
            localStorage.setItem(CYBER_THEME_STORAGE_KEY, cyberTheme);
        } catch (error) {
            console.warn('Failed to save cyber theme to localStorage:', error);
        }

        // Load theme CSS from backend when theme changes (after initialization)
        if (hasInitialized) {
            loadThemeCss(cyberTheme);
        }
    }, [cyberTheme, hasInitialized, loadThemeCss]);

    /**
     * Set cyber theme with validation
     */
    const setCyberTheme = (newTheme: CyberThemeMode) => {
        if (CYBER_THEME_MODES.includes(newTheme)) {
            setCyberThemeState(newTheme);
        } else {
            console.warn(`Invalid cyber theme mode: ${newTheme}`);
        }
    };

    /**
     * Cycle through available cyber themes
     */
    const cycleCyberTheme = () => {
        const currentIndex = CYBER_THEME_MODES.indexOf(cyberTheme);
        const nextIndex = (currentIndex + 1) % CYBER_THEME_MODES.length;
        setCyberTheme(CYBER_THEME_MODES[nextIndex]);
    };

    const value: CyberThemeContextValue = {
        cyberTheme,
        setCyberTheme,
        cycleCyberTheme,
        isLoadingTheme,
        loadThemeCss,
    };

    return (
        <CyberThemeContext.Provider value={value}>
            {children}
        </CyberThemeContext.Provider>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook to access cyber theme context
 * @throws Error if used outside CyberThemeProvider
 */
export const useCyberTheme = (): CyberThemeContextValue => {
    const context = useContext(CyberThemeContext);
    if (!context) {
        throw new Error('useCyberTheme must be used within CyberThemeProvider');
    }
    return context;
};

/**
 * Helper hook to check if a specific cyber theme is active
 */
export const useIsCyberTheme = (targetTheme: CyberThemeMode): boolean => {
    const { cyberTheme } = useCyberTheme();
    return cyberTheme === targetTheme;
};

export default CyberThemeProvider;
