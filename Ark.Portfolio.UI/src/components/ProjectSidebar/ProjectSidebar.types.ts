/**
 * @fileoverview ProjectSidebar TypeScript Types
 * Type definitions for the retractable project navigation sidebar.
 * 
 * Responsibilities:
 * - Define component prop interfaces
 * - Define internal state types
 * - Ensure type safety across sidebar implementation
 * 
 * Inputs: None (type definitions)
 * Outputs: TypeScript types and interfaces
 * Side Effects: None
 * Invariants: All types must be compatible with React component patterns
 * 
 * @author Armand Richelet-Kleinberg
 */

import { ProjectSection } from '@ark/portfolio-share';

/**
 * Sidebar navigation item
 * Represents a single section link in the sidebar
 */
export interface SidebarNavItem {
    /** Unique section identifier */
    id: ProjectSection;

    /** Display label for the section */
    label: string;

    /** Icon name (from lucide-react) */
    icon?: string;

    /** Is this section currently active */
    isActive: boolean;

    /** Optional badge count (e.g., number of items) */
    badgeCount?: number;
}

/**
 * Sidebar position enum
 * Defines where the sidebar is positioned
 */
export enum SidebarPosition {
    /** Left-aligned sidebar */
    LEFT = 'left',

    /** Right-aligned sidebar */
    RIGHT = 'right',
}

/**
 * Sidebar state enum
 * Defines the current visual state of the sidebar
 */
export enum SidebarState {
    /** Sidebar is fully expanded */
    EXPANDED = 'expanded',

    /** Sidebar is collapsed */
    COLLAPSED = 'collapsed',

    /** Sidebar is hidden (mobile overlay mode) */
    HIDDEN = 'hidden',
}

/**
 * ProjectSidebar Component Props
 */
export interface ProjectSidebarProps {
    /** Current active section */
    activeSection: ProjectSection;

    /** Available sections to display */
    sections: SidebarNavItem[];

    /** Callback when section is selected */
    onSectionChange: (section: ProjectSection) => void;

    /** Initial collapsed state (default: false) */
    initialCollapsed?: boolean;

    /** Position of sidebar (default: left) */
    position?: SidebarPosition;

    /** Additional CSS class */
    className?: string;

    /** GitHub repository URL (optional) */
    githubUrl?: string;

    /** Live demo URL (optional) */
    liveUrl?: string;
}

/**
 * ProjectSidebar ViewModel State
 */
export interface ProjectSidebarModel {
    /** Current sidebar state */
    state: SidebarState;

    /** Is sidebar collapsed */
    isCollapsed: boolean;

    /** Is mobile overlay mode */
    isMobileMode: boolean;

    /** Sidebar navigation items */
    navItems: SidebarNavItem[];

    // Actions
    /** Toggle sidebar collapsed state */
    toggleCollapse: () => void;

    /** Navigate to a section */
    navigateToSection: (section: ProjectSection) => void;

    /** Close mobile overlay */
    closeMobileOverlay: () => void;

    /** Handle window resize */
    handleResize: () => void;

    /** Handle keyboard navigation */
    handleKeyDown: (e: KeyboardEvent) => void;
}
