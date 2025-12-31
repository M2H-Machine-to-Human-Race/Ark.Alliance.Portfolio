/**
 * @fileoverview ProjectSidebar ViewModel
 * Business logic and state management for the retractable project navigation sidebar.
 * 
 * Responsibilities:
 * - Manage sidebar collapse/expand state
 * - Handle responsive behavior (mobile overlay mode)
 * - Track active section
 * - Handle keyboard navigation
 * 
 * Inputs: ProjectSidebarProps
 * Outputs: ProjectSidebarModel (state and actions)
 * Side Effects: Window resize listener, localStorage for collapsed state
 * Invariants: 
 * - Sidebar state must match viewport size
 * - Active section must be valid ProjectSection
 * - Mobile mode activates below tablet breakpoint
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useState, useEffect, useCallback } from 'react';
import {
    ProjectSection,
    SIDEBAR_CONSTANTS,
    LAYOUT_CONSTANTS,
} from '@ark/portfolio-share';
import {
    ProjectSidebarProps,
    ProjectSidebarModel,
    SidebarState,
    SidebarNavItem,
} from './ProjectSidebar.types';

/**
 * Local storage key for sidebar collapsed state
 */
const SIDEBAR_COLLAPSED_KEY = 'project-sidebar-collapsed';

/**
 * ProjectSidebar ViewModel Hook
 * 
 * Manages sidebar state, responsive behavior, and user interactions.
 * Persists collapsed state in localStorage for user preference.
 * 
 * @param props - Component props
 * @returns ViewModel state and actions
 * 
 * @example
 * ```typescript
 * const vm = useProjectSidebarModel({
 *   activeSection: ProjectSection.OVERVIEW,
 *   sections: navItems,
 *   onSectionChange: handleSectionChange
 * });
 * ```
 */
export const useProjectSidebarModel = (
    props: ProjectSidebarProps
): ProjectSidebarModel => {
    const {
        activeSection,
        sections,
        onSectionChange,
        initialCollapsed = false,
    } = props;

    // Load collapsed state from localStorage
    const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
        if (typeof window === 'undefined') return initialCollapsed;

        const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
        return saved !== null ? JSON.parse(saved) : initialCollapsed;
    });

    const [isMobileMode, setIsMobileMode] = useState<boolean>(false);

    /**
     * Determine current sidebar state based on collapse and mobile mode
     */
    const state: SidebarState = isMobileMode
        ? isCollapsed
            ? SidebarState.HIDDEN
            : SidebarState.EXPANDED
        : isCollapsed
            ? SidebarState.COLLAPSED
            : SidebarState.EXPANDED;

    /**
     * Update navigation items with active state
     */
    const navItems: SidebarNavItem[] = sections.map((section) => ({
        ...section,
        isActive: section.id === activeSection,
    }));

    /**
     * Toggle sidebar collapsed state
     * Persists state to localStorage
     */
    const toggleCollapse = useCallback(() => {
        setIsCollapsed((prev) => {
            const newState = !prev;
            localStorage.setItem(SIDEBAR_COLLAPSED_KEY, JSON.stringify(newState));
            return newState;
        });
    }, []);

    /**
     * Navigate to a specific section
     * Closes mobile overlay after navigation
     */
    const navigateToSection = useCallback(
        (section: ProjectSection) => {
            onSectionChange(section);

            // Close mobile overlay after navigation
            if (isMobileMode) {
                setIsCollapsed(true);
            }
        },
        [onSectionChange, isMobileMode]
    );

    /**
     * Close mobile overlay
     */
    const closeMobileOverlay = useCallback(() => {
        if (isMobileMode) {
            setIsCollapsed(true);
        }
    }, [isMobileMode]);

    /**
     * Handle window resize
     * Updates mobile mode based on viewport width
     */
    const handleResize = useCallback(() => {
        const isMobile = window.innerWidth < SIDEBAR_CONSTANTS.OVERLAY_BREAKPOINT;
        setIsMobileMode(isMobile);

        // Auto-collapse on mobile, auto-expand on desktop
        if (isMobile && !isCollapsed) {
            // Keep collapsed on mobile by default
        } else if (!isMobile && isCollapsed) {
            // Optionally auto-expand on desktop
            // Commented out to respect user preference
            // setIsCollapsed(false);
        }
    }, [isCollapsed]);

    /**
     * Handle keyboard navigation
     * Supports Escape to close mobile overlay
     */
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isMobileMode && !isCollapsed) {
                closeMobileOverlay();
            }
        },
        [isMobileMode, isCollapsed, closeMobileOverlay]
    );

    /**
     * Setup resize listener
     */
    useEffect(() => {
        // Initial check
        handleResize();

        // Add resize listener
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    /**
     * Setup keyboard listener
     */
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return {
        state,
        isCollapsed,
        isMobileMode,
        navItems,
        toggleCollapse,
        navigateToSection,
        closeMobileOverlay,
        handleResize,
        handleKeyDown,
    };
};
