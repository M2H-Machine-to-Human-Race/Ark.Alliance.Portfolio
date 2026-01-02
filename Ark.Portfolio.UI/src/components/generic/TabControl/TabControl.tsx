/**
 * @fileoverview TabControl View Component
 * Generic, reusable tab control with icons and multiple variants.
 * Follows MVVM pattern with clean separation of concerns.
 * 
 * @author Armand Richelet-Kleinberg
 * 
 * @example
 * ```tsx
 * <TabControl
 *     tabs={[
 *         { id: 'all', label: 'All', icon: 'Grid3X3' },
 *         { id: 'images', label: 'Images', icon: 'Image' }
 *     ]}
 *     activeTab={activeTab}
 *     onTabChange={setActiveTab}
 *     variant="pills"
 * />
 * ```
 */

import React, { useRef } from 'react';
import {
    Grid3X3, Image, Video, Music, FileText, FileType,
    Table, FileCode, Braces, File, Folder, Settings,
    Home, User, Bell, Search, Filter, List, LayoutGrid,
    LucideIcon
} from 'lucide-react';
import { TabControlProps, TabItem } from './TabControl.types';
import { useTabControlModel } from './TabControl.model';
import './TabControl.styles.css';

/**
 * Icon mapping from string names to Lucide components
 * Extensible - add new icons as needed
 */
const ICON_MAP: Record<string, LucideIcon> = {
    // Media types
    Grid3X3,
    Image,
    Video,
    Music,
    FileText,
    FileType,
    Table,
    FileCode,
    Braces,
    File,
    Folder,
    // Navigation
    Home,
    User,
    Settings,
    Bell,
    Search,
    Filter,
    List,
    LayoutGrid,
};

/**
 * Get icon component from name
 */
const getIcon = (iconName?: string, size: number = 16): React.ReactNode => {
    if (!iconName) return null;
    const IconComponent = ICON_MAP[iconName];
    return IconComponent ? <IconComponent size={size} /> : null;
};

/**
 * TabControl Component
 * 
 * A polished, accessible tab control with:
 * - Multiple visual variants (default, pills, underline, compact)
 * - Lucide icon support
 * - Keyboard navigation
 * - ARIA accessibility
 * - Badge support
 * - Scrollable overflow
 */
export const TabControl: React.FC<TabControlProps> = (props) => {
    const {
        tabs,
        variant = 'pills',
        theme = 'dark',
        iconsOnly = false,
        scrollable = true,
        className = '',
        ariaLabel = 'Tab navigation',
    } = props;

    const vm = useTabControlModel(props);
    const tabListRef = useRef<HTMLDivElement>(null);

    // Container classes
    const containerClasses = [
        'tab-control',
        `tab-control--${variant}`,
        `tab-control--${theme}`,
        scrollable ? 'tab-control--scrollable' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div
            className={containerClasses}
            role="tablist"
            aria-label={ariaLabel}
            ref={tabListRef}
        >
            {tabs.map((tab, index) => (
                <button
                    key={tab.id}
                    className={vm.getTabClasses(tab, index)}
                    onClick={() => vm.handleTabClick(tab.id, index)}
                    onKeyDown={(e) => vm.handleKeyDown(e, index)}
                    disabled={tab.disabled}
                    title={tab.tooltip || tab.label}
                    {...vm.getTabAriaProps(tab, index)}
                >
                    {/* Icon */}
                    {(tab.iconElement || tab.icon) && (
                        <span className="tab-control-icon">
                            {tab.iconElement || getIcon(tab.icon)}
                        </span>
                    )}

                    {/* Label */}
                    {!iconsOnly && (
                        <span className="tab-control-label">{tab.label}</span>
                    )}

                    {/* Badge */}
                    {tab.badge !== undefined && (
                        <span className="tab-control-badge">{tab.badge}</span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default TabControl;
