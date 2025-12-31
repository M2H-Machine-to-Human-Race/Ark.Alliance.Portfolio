/**
 * @fileoverview ProjectSidebar Barrel Export
 * Re-exports all public API from the ProjectSidebar component module.
 * 
 * @author Armand Richelet-Kleinberg
 */

export { ProjectSidebar, default } from './ProjectSidebar';
export { useProjectSidebarModel } from './ProjectSidebar.model';
export type {
    ProjectSidebarProps,
    ProjectSidebarModel,
    SidebarNavItem,
    SidebarPosition,
    SidebarState,
} from './ProjectSidebar.types';
