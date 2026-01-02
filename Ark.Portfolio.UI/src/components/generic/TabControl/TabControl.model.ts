/**
 * @fileoverview TabControl ViewModel
 * Manages state and logic for the TabControl component.
 * Follows MVVM pattern - no UI logic, only state and event handling.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useCallback, useMemo } from 'react';
import { TabItem, TabControlProps, TabControlViewModel } from './TabControl.types';

/**
 * TabControl ViewModel Hook
 * 
 * Provides state management and event handlers for the TabControl.
 * Supports keyboard navigation and ARIA accessibility.
 * 
 * @param props - TabControl configuration
 * @returns ViewModel with state and handlers
 * 
 * @example
 * ```tsx
 * const vm = useTabControlModel({
 *     tabs: myTabs,
 *     activeTab: 'tab1',
 *     onTabChange: setActiveTab,
 *     variant: 'pills'
 * });
 * ```
 */
export const useTabControlModel = (props: TabControlProps): TabControlViewModel => {
    const { tabs, activeTab, onTabChange, variant = 'default' } = props;

    // Calculate active index from activeTab ID
    const activeIndex = useMemo(() => {
        const index = tabs.findIndex(tab => tab.id === activeTab);
        return index >= 0 ? index : 0;
    }, [tabs, activeTab]);

    /**
     * Handle tab click
     */
    const handleTabClick = useCallback((tabId: string, index: number) => {
        const tab = tabs[index];
        if (tab && !tab.disabled) {
            onTabChange(tabId);
        }
    }, [tabs, onTabChange]);

    /**
     * Handle keyboard navigation
     * - ArrowLeft/ArrowRight: Navigate between tabs
     * - Home: Go to first tab
     * - End: Go to last tab
     * - Enter/Space: Select current tab
     */
    const handleKeyDown = useCallback((event: React.KeyboardEvent, index: number) => {
        const enabledTabs = tabs.filter(t => !t.disabled);
        const currentEnabledIndex = enabledTabs.findIndex(t => t.id === tabs[index].id);

        let newIndex = -1;

        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                newIndex = currentEnabledIndex > 0
                    ? currentEnabledIndex - 1
                    : enabledTabs.length - 1;
                break;
            case 'ArrowRight':
                event.preventDefault();
                newIndex = currentEnabledIndex < enabledTabs.length - 1
                    ? currentEnabledIndex + 1
                    : 0;
                break;
            case 'Home':
                event.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                event.preventDefault();
                newIndex = enabledTabs.length - 1;
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                onTabChange(tabs[index].id);
                return;
            default:
                return;
        }

        if (newIndex >= 0 && enabledTabs[newIndex]) {
            onTabChange(enabledTabs[newIndex].id);
        }
    }, [tabs, onTabChange]);

    /**
     * Get ARIA attributes for accessibility
     */
    const getTabAriaProps = useCallback((tab: TabItem, index: number): Record<string, string | boolean | number> => {
        const isActive = tab.id === activeTab;
        return {
            'role': 'tab',
            'aria-selected': isActive,
            'aria-disabled': tab.disabled || false,
            'aria-controls': `tabpanel-${tab.id}`,
            'id': `tab-${tab.id}`,
            'tabIndex': isActive ? 0 : -1,
        };
    }, [activeTab]);

    /**
     * Generate CSS classes for a tab
     */
    const getTabClasses = useCallback((tab: TabItem, index: number): string => {
        const classes = ['tab-control-tab'];

        // Variant class
        classes.push(`tab-control-tab--${variant}`);

        // State classes
        if (tab.id === activeTab) {
            classes.push('tab-control-tab--active');
        }
        if (tab.disabled) {
            classes.push('tab-control-tab--disabled');
        }

        return classes.join(' ');
    }, [activeTab, variant]);

    return {
        activeIndex,
        handleTabClick,
        handleKeyDown,
        getTabAriaProps,
        getTabClasses,
    };
};
