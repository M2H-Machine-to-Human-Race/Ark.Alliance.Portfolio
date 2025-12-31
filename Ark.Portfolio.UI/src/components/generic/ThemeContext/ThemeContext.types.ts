/**
 * Theme Types for Ark.Portfolio
 * Defines theme variants and configuration options.
 * 
 * @author Armand Richelet-Kleinberg
 */

/**
 * Available theme variants.
 * - 'default': Dark cyberpunk theme with sidebar navigation
 * - 'architectural': Light minimalist theme with radial navigation
 * - 'aloevera': Purple gradient theme with modern typography
 */
export type ThemeVariant = 'default' | 'architectural' | 'aloevera';

/**
 * Configuration for a theme.
 */
export interface ThemeConfig {
    /** Unique identifier for the theme */
    variant: ThemeVariant;
    /** Display name for theme selection */
    displayName: string;
    /** Theme description */
    description: string;
    /** Whether this theme uses a full-screen layout without sidebar */
    isFullScreen: boolean;
}

/**
 * Context value provided by ThemeProvider.
 */
export interface ThemeContextValue {
    /** Current active theme */
    theme: ThemeVariant;
    /** Theme configuration for current theme */
    config: ThemeConfig;
    /** Function to change theme */
    setTheme: (theme: ThemeVariant) => void;
    /** Toggle between available themes */
    toggleTheme: () => void;
}

