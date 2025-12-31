/**
 * @fileoverview ProjectSidebar View Component
 * Retractable sidebar for project detail page navigation.
 * 
 * Responsibilities:
 * - Render sidebar navigation with section links
 * - Handle collapse/expand transitions
 * - Support mobile overlay mode
 * - Provide external links (GitHub, Live Demo)
 * 
 * Inputs: ProjectSidebarProps
 * Outputs: JSX sidebar component
 * Side Effects: None (pure view component)
 * Invariants: All navigation items must have valid section IDs
 * 
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import {
    ChevronLeft,
    ChevronRight,
    X,
    Home,
    Layout,
    Layers,
    Code,
    Map,
    Image,
    Github,
    ExternalLink,
} from 'lucide-react';
import { ProjectSection } from '@ark/portfolio-share';
import { useProjectSidebarModel } from './ProjectSidebar.model';
import {
    ProjectSidebarProps,
    SidebarState,
    SidebarNavItem,
    SidebarPosition,
} from './ProjectSidebar.types';
import './ProjectSidebar.styles.css';

/**
 * Icon mapping for section types
 */
const SECTION_ICONS: Record<ProjectSection, React.ReactNode> = {
    [ProjectSection.OVERVIEW]: <Home size={20} />,
    [ProjectSection.ARCHITECTURE]: <Layout size={20} />,
    [ProjectSection.FEATURES]: <Layers size={20} />,
    [ProjectSection.TECHNICAL]: <Code size={20} />,
    [ProjectSection.ROADMAP]: <Map size={20} />,
    [ProjectSection.GALLERY]: <Image size={20} />,
};

/**
 * ProjectSidebar Component
 * 
 * Retractable navigation sidebar for project detail pages.
 * Features:
 * - Collapse/expand with smooth animation
 * - Mobile-responsive overlay mode
 * - Section navigation with icons
 * - External links (GitHub, Live Demo)
 * - Keyboard accessibility
 */
export const ProjectSidebar: React.FC<ProjectSidebarProps> = (props) => {
    const {
        position = SidebarPosition.LEFT,
        className = '',
        githubUrl,
        liveUrl,
    } = props;

    const vm = useProjectSidebarModel(props);

    /**
     * Build CSS class string based on state
     */
    const sidebarClass = [
        'project-sidebar',
        `project-sidebar--${position}`,
        `project-sidebar--${vm.state}`,
        vm.isMobileMode ? 'project-sidebar--mobile' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    /**
     * Render navigation item
     */
    const renderNavItem = (item: SidebarNavItem) => (
        <button
            key={item.id}
            className={`project-sidebar__nav-item ${item.isActive ? 'active' : ''}`}
            onClick={() => vm.navigateToSection(item.id)}
            aria-current={item.isActive ? 'page' : undefined}
            title={vm.isCollapsed ? item.label : undefined}
        >
            <span className="project-sidebar__nav-icon">
                {SECTION_ICONS[item.id]}
            </span>
            {!vm.isCollapsed && (
                <span className="project-sidebar__nav-label">{item.label}</span>
            )}
            {!vm.isCollapsed && item.badgeCount !== undefined && (
                <span className="project-sidebar__nav-badge">{item.badgeCount}</span>
            )}
        </button>
    );

    return (
        <>
            {/* Mobile overlay backdrop */}
            {vm.isMobileMode && vm.state === SidebarState.EXPANDED && (
                <div
                    className="project-sidebar__backdrop"
                    onClick={vm.closeMobileOverlay}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar container */}
            <aside
                className={sidebarClass}
                role="navigation"
                aria-label="Project sections"
            >
                {/* Toggle button */}
                <button
                    className="project-sidebar__toggle"
                    onClick={vm.toggleCollapse}
                    aria-expanded={!vm.isCollapsed}
                    aria-label={vm.isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {vm.isMobileMode ? (
                        <X size={20} />
                    ) : vm.isCollapsed ? (
                        <ChevronRight size={20} />
                    ) : (
                        <ChevronLeft size={20} />
                    )}
                </button>

                {/* Navigation items */}
                <nav className="project-sidebar__nav">
                    {vm.navItems.map(renderNavItem)}
                </nav>

                {/* External links */}
                {(githubUrl || liveUrl) && !vm.isCollapsed && (
                    <div className="project-sidebar__links">
                        {githubUrl && (
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-sidebar__link"
                            >
                                <Github size={18} />
                                <span>Source Code</span>
                            </a>
                        )}
                        {liveUrl && (
                            <a
                                href={liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-sidebar__link"
                            >
                                <ExternalLink size={18} />
                                <span>Live Demo</span>
                            </a>
                        )}
                    </div>
                )}
            </aside>
        </>
    );
};

export default ProjectSidebar;
