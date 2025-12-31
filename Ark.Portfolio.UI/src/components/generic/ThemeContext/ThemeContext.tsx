/**
 * Theme Context Provider
 * React context for managing theme state across the application.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { ThemeContextValue, ThemeVariant } from './ThemeContext.types';
import { THEME_CONFIGS, DEFAULT_THEME } from './ThemeContext.config';
import { getStoredTheme, storeTheme, getNextTheme } from './ThemeContext.helpers';

/**
 * Theme context with default value.
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Props for ThemeProvider component.
 */
interface ThemeProviderProps {
    children: ReactNode;
    /** Optional initial theme override */
    initialTheme?: ThemeVariant;
}

/**
 * Theme provider component.
 * Wraps the application and provides theme context to all children.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialTheme }) => {
    const [theme, setThemeState] = useState<ThemeVariant>(() => {
        return initialTheme || getStoredTheme();
    });

    // Apply theme class to document
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('theme-default', 'theme-architectural', 'theme-aloevera');
        root.classList.add(`theme-${theme}`);
    }, [theme]);

    const setTheme = (newTheme: ThemeVariant) => {
        setThemeState(newTheme);
        storeTheme(newTheme);
    };

    const toggleTheme = () => {
        const nextTheme = getNextTheme(theme);
        setTheme(nextTheme);
    };

    const value = useMemo<ThemeContextValue>(() => ({
        theme,
        config: THEME_CONFIGS[theme],
        setTheme,
        toggleTheme
    }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Hook to access theme context.
 * @throws Error if used outside ThemeProvider
 */
export const useTheme = (): ThemeContextValue => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export { ThemeContext };

