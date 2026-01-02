/**
 * @fileoverview TabControl Type Definitions
 * Defines the interfaces and types for the generic TabControl component.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { ReactNode } from 'react';

/**
 * Individual tab item configuration
 */
export interface TabItem {
    /** Unique identifier for the tab */
    id: string;

    /** Display label for the tab */
    label: string;

    /** Lucide icon name (e.g., 'Image', 'Video', 'FileText') */
    icon?: string;

    /** Custom icon element (alternative to icon name) */
    iconElement?: ReactNode;

    /** Whether the tab is disabled */
    disabled?: boolean;

    /** Optional badge (e.g., notification count) */
    badge?: string | number;

    /** Optional tooltip text */
    tooltip?: string;
}

/**
 * Tab visual variants
 * - default: Standard tabs with background
 * - pills: Rounded pill-shaped tabs
 * - underline: Tabs with bottom border indicator
 * - compact: Smaller tabs with minimal padding
 */
export type TabVariant = 'default' | 'pills' | 'underline' | 'compact';

/**
 * Tab theme options
 */
export type TabTheme = 'dark' | 'light' | 'auto';

/**
 * TabControl component props
 */
export interface TabControlProps {
    /** Array of tab items to render */
    tabs: TabItem[];

    /** Currently active tab ID */
    activeTab: string;

    /** Callback when tab changes */
    onTabChange: (tabId: string) => void;

    /** Visual variant */
    variant?: TabVariant;

    /** Color theme */
    theme?: TabTheme;

    /** Show icons only (hide labels) */
    iconsOnly?: boolean;

    /** Allow horizontal scrolling for many tabs */
    scrollable?: boolean;

    /** Additional CSS class */
    className?: string;

    /** ARIA label for the tablist */
    ariaLabel?: string;
}

/**
 * TabControl ViewModel return type
 */
export interface TabControlViewModel {
    /** Currently active tab index */
    activeIndex: number;

    /** Handle tab selection */
    handleTabClick: (tabId: string, index: number) => void;

    /** Handle keyboard navigation */
    handleKeyDown: (event: React.KeyboardEvent, index: number) => void;

    /** Get ARIA attributes for a tab */
    getTabAriaProps: (tab: TabItem, index: number) => Record<string, string | boolean | number>;

    /** Get CSS classes for a tab */
    getTabClasses: (tab: TabItem, index: number) => string;
}
