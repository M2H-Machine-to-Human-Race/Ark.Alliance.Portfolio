/**
 * @fileoverview ProjectPresentation TypeScript Types
 * Type definitions for the project presentation/detail page.
 * 
 * Responsibilities:
 * - Define page props and state interfaces
 * - Define section content types
 * - Ensure type safety across page implementation
 * 
 * @author Armand Richelet-Kleinberg
 */

import { ProjectSection, ProjectDto } from '@ark/portfolio-share';
import { SidebarNavItem } from '../../components/ProjectSidebar';

/**
 * ProjectPresentation Page Props
 */
export interface ProjectPresentationProps {
    /** Optional CSS class */
    className?: string;
}

/**
 * Section content structure
 */
export interface SectionContent {
    /** Section type */
    type: ProjectSection;

    /** Section title */
    title: string;

    /** Markdown content */
    content: string;

    /** Mermaid diagrams (optional) */
    diagrams?: string[];

    /** Gallery images (optional) */
    images?: string[];
}

/**
 * ProjectPresentation ViewModel State
 */
export interface ProjectPresentationModel {
    /** Is page loading */
    isLoading: boolean;

    /** Error message if any */
    error: string | null;

    /** Project data */
    project: ProjectDto | null;

    /** Current active section */
    activeSection: ProjectSection;

    /** All available sections */
    sections: SidebarNavItem[];

    /** Current section content */
    currentContent: SectionContent | null;

    /** Is admin user */
    isAdmin: boolean;

    // Actions
    /** Change active section */
    setActiveSection: (section: ProjectSection) => void;

    /** Navigate back to projects */
    navigateBack: () => void;

    /** Edit project (admin) */
    handleEdit: () => void;

    /** Scroll to anchor */
    scrollToAnchor: (anchor: string) => void;
}
