/**
 * Theme Configuration Constants
 * Static configuration for available themes.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { ThemeConfig, ThemeVariant } from './ThemeContext.types';

/**
 * Theme configurations map.
 */
export const THEME_CONFIGS: Record<ThemeVariant, ThemeConfig> = {
    default: {
        variant: 'default',
        displayName: 'Cyberpunk',
        description: 'Dark theme with sidebar navigation',
        isFullScreen: false
    },
    architectural: {
        variant: 'architectural',
        displayName: 'Architectural',
        description: 'Light minimalist theme with radial navigation',
        isFullScreen: true
    }
};

/**
 * Default theme to use when none is stored.
 */
export const DEFAULT_THEME: ThemeVariant = 'architectural';

/**
 * LocalStorage key for persisting theme preference.
 */
export const THEME_STORAGE_KEY = 'ark-portfolio-theme';

