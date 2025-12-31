/**
 * ThemeToggle Component
 * Button to toggle between application themes.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { ThemeToggleProps } from './ThemeToggle.types';
import { cn } from '../../../utils/cn';
import './ThemeToggle.styles.css';

/**
 * Theme toggle button component.
 * Allows users to switch between 'default' (dark) and 'architectural' (light) themes.
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
    className,
    showLabel = true
}) => {
    const { theme, toggleTheme, config } = useTheme();

    const isLight = theme === 'architectural';

    return (
        <button
            className={cn('theme-toggle', className)}
            onClick={toggleTheme}
            aria-label={`Switch to ${isLight ? 'dark' : 'light'} theme`}
            title={`Current: ${config.displayName}`}
        >
            <span className="theme-toggle__icon">
                {isLight ? <Moon size={16} /> : <Sun size={16} />}
            </span>
            {showLabel && (
                <span className="theme-toggle__label">
                    {isLight ? 'Dark' : 'Light'}
                </span>
            )}
        </button>
    );
};

export default ThemeToggle;

