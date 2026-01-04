/**
 * @fileoverview ThemeSwitcher View Component
 * MVVM-compliant view for switching between cyber theme modes
 * Enhanced with loading states and ShowCases-style aesthetic
 * 
 * @module components/ThemeSwitcher
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import { useThemeSwitcherModel, ThemeConfigItem } from './ThemeSwitcher.model';
import './ThemeSwitcher.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ThemeSwitcher component props
 */
export interface ThemeSwitcherProps {
    /** Display variant: 'compact' for header pills, 'full' for settings grid */
    variant?: 'compact' | 'full';
    /** Additional CSS classes */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Loading skeleton for theme pills
 */
const ThemePillSkeleton: React.FC = () => (
    <div className="theme-pill skeleton" aria-label="Loading theme">
        <span className="theme-pill-icon">◆</span>
        <span className="theme-pill-label hide-mobile">···</span>
    </div>
);

/**
 * Compact theme pill button
 */
interface ThemePillProps {
    config: ThemeConfigItem;
    isActive: boolean;
    onSelect: () => void;
}

const ThemePill: React.FC<ThemePillProps> = ({ config, isActive, onSelect }) => (
    <button
        onClick={onSelect}
        className={`theme-pill ${isActive ? 'active' : ''}`}
        title={`${config.label} - ${config.description}`}
        aria-label={`Switch to ${config.label} theme`}
        aria-pressed={isActive}
        style={config.previewColor ? { '--theme-pill-color': config.previewColor } as React.CSSProperties : undefined}
    >
        <span className="theme-pill-icon">{config.icon}</span>
        <span className="theme-pill-label hide-mobile">{config.label}</span>
    </button>
);

/**
 * Loading skeleton for theme cards
 */
const ThemeCardSkeleton: React.FC = () => (
    <div className="theme-card skeleton" aria-label="Loading theme">
        <div className="theme-card-icon">◆</div>
        <div className="theme-card-label">Loading...</div>
        <div className="theme-card-description">···</div>
    </div>
);

/**
 * Full theme card button
 */
interface ThemeCardProps {
    config: ThemeConfigItem;
    isActive: boolean;
    onSelect: () => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ config, isActive, onSelect }) => (
    <button
        onClick={onSelect}
        className={`theme-card ${isActive ? 'active' : ''}`}
        aria-label={`Switch to ${config.label} theme`}
        aria-pressed={isActive}
        style={config.previewColor ? { '--theme-card-color': config.previewColor } as React.CSSProperties : undefined}
    >
        <div
            className="theme-card-color-bar"
            style={{ backgroundColor: config.previewColor || 'var(--neon-primary)' }}
        />
        <div className="theme-card-icon">{config.icon}</div>
        <div className="theme-card-label">{config.label}</div>
        <div className="theme-card-description">{config.description}</div>
        {isActive && <div className="theme-card-indicator">Active</div>}
    </button>
);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ThemeSwitcher Component
 * 
 * MVVM-compliant component for switching between cyber theme modes.
 * Fetches themes dynamically from backend with static fallback.
 * Supports two display variants:
 * - 'compact': Horizontal pill buttons for header integration
 * - 'full': Grid of cards with descriptions for settings/admin pages
 * 
 * @example
 * ```tsx
 * // Compact version for header
 * <ThemeSwitcher variant="compact" />
 * 
 * // Full version for settings page
 * <ThemeSwitcher variant="full" />
 * ```
 */
export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
    variant = 'compact',
    className = ''
}) => {
    const vm = useThemeSwitcherModel();

    // Compact variant - horizontal pills
    if (variant === 'compact') {
        return (
            <div className={`theme-switcher-compact ${className}`}>
                {vm.isLoading ? (
                    // Show 4 skeleton pills while loading
                    Array.from({ length: 4 }).map((_, i) => (
                        <ThemePillSkeleton key={`skeleton-${i}`} />
                    ))
                ) : (
                    vm.themes.map((config) => (
                        <ThemePill
                            key={config.mode}
                            config={config}
                            isActive={vm.isActive(config.mode)}
                            onSelect={() => vm.selectTheme(config.mode)}
                        />
                    ))
                )}
            </div>
        );
    }

    // Full variant - card grid
    return (
        <div className={`theme-switcher-full ${className}`}>
            <h3 className="theme-switcher-title">Theme Mode</h3>
            <div className="theme-switcher-grid">
                {vm.isLoading ? (
                    // Show 4 skeleton cards while loading
                    Array.from({ length: 4 }).map((_, i) => (
                        <ThemeCardSkeleton key={`skeleton-${i}`} />
                    ))
                ) : (
                    vm.themes.map((config) => (
                        <ThemeCard
                            key={config.mode}
                            config={config}
                            isActive={vm.isActive(config.mode)}
                            onSelect={() => vm.selectTheme(config.mode)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ThemeSwitcher;
