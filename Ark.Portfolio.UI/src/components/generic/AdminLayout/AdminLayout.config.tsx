/**
 * @fileoverview Admin Layout Configuration
 * Defines navigation items for the admin sidebar.
 * @author Armand Richelet-Kleinberg
 */

import {
    LayoutDashboard,
    Briefcase,
    FileText,
    Grid,
    Menu as MenuIcon,
    Palette,
    Image,
    GalleryHorizontal,
    Bot
} from 'lucide-react';

/**
 * Navigation item configuration for admin sidebar.
 */
export interface AdminNavItem {
    /** Unique identifier for the nav item */
    id: string;
    /** Display label */
    label: string;
    /** Route path */
    path: string;
    /** Lucide icon element */
    icon: React.ReactNode;
}

/**
 * Admin navigation items configuration.
 * @remarks Items are displayed in the order defined here.
 */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'projects', label: 'Projects', path: '/admin/projects', icon: <Briefcase size={20} /> },
    { id: 'resume', label: 'Resume', path: '/admin/resume', icon: <FileText size={20} /> },
    { id: 'widgets', label: 'Widgets', path: '/admin/widgets', icon: <Grid size={20} /> },
    { id: 'carousel', label: 'Carousel', path: '/admin/carousel', icon: <GalleryHorizontal size={20} /> },
    { id: 'menu', label: 'Menu', path: '/admin/menu', icon: <MenuIcon size={20} /> },
    { id: 'styles', label: 'Styles', path: '/admin/styles', icon: <Palette size={20} /> },
    { id: 'media', label: 'Media', path: '/admin/media', icon: <Image size={20} /> },
    { id: 'ai-settings', label: 'AI Settings', path: '/admin/ai-settings', icon: <Bot size={20} /> }
];

