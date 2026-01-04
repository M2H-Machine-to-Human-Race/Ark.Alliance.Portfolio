/**
 * @fileoverview Static Generation Constants
 * Constants and defaults for static site generation.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { StaticPageType, StaticThemePreset, StaticResumeSectionType } from '../enums/static-generation.enum';
import { PageDefinitionDto } from '../dtos/static-generation.dto';

/**
 * Default pages for static export.
 */
export const DEFAULT_STATIC_PAGES: PageDefinitionDto[] = [
    {
        pageType: StaticPageType.HOME,
        title: 'Home',
        route: '/',
        isEnabled: true,
        displayOrder: 1,
        metadata: {
            showCarousel: true,
            showQuickNav: true
        }
    },
    {
        pageType: StaticPageType.RESUME,
        title: 'Resume',
        route: '/resume',
        sections: [
            StaticResumeSectionType.PROFILE,
            StaticResumeSectionType.EXPERIENCE,
            StaticResumeSectionType.EDUCATION,
            StaticResumeSectionType.SKILLS,
            StaticResumeSectionType.LANGUAGES,
            StaticResumeSectionType.HOBBIES,
            StaticResumeSectionType.BUSINESS_DOMAINS
        ],
        isEnabled: true,
        displayOrder: 2
    },
    {
        pageType: StaticPageType.PROJECTS,
        title: 'Projects',
        route: '/projects',
        isEnabled: true,
        displayOrder: 3
    },
    {
        pageType: StaticPageType.PROJECT_DETAIL,
        title: 'Project Detail',
        route: '/projects/:id',
        isEnabled: true,
        displayOrder: 4,
        metadata: {
            generateSubfolders: true
        }
    }
];

/**
 * Default export configuration.
 */
export const DEFAULT_STATIC_EXPORT_CONFIG = {
    pages: DEFAULT_STATIC_PAGES,
    theme: StaticThemePreset.ARCHITECTURAL,
    includeProjectSubfolders: true,
    includeAssets: true,
    siteMetadata: {
        keywords: ['portfolio', 'developer', 'projects', 'resume']
    }
};

/**
 * Theme CSS variables for each preset.
 */
export const STATIC_THEME_CSS_VARS: Record<StaticThemePreset, Record<string, string>> = {
    [StaticThemePreset.ARCHITECTURAL]: {
        '--bg-primary': '#0f172a',
        '--bg-secondary': '#1e293b',
        '--bg-tertiary': '#334155',
        '--text-primary': '#f8fafc',
        '--text-secondary': '#cbd5e1',
        '--text-muted': '#64748b',
        '--color-primary-400': '#60a5fa',
        '--color-primary-500': '#3b82f6',
        '--color-primary-600': '#2563eb',
        '--border-color': 'rgba(148, 163, 184, 0.1)',
        '--gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    },
    [StaticThemePreset.ALOEVERA]: {
        '--bg-primary': '#1a0a2e',
        '--bg-secondary': '#2d1b4e',
        '--bg-tertiary': '#4a2c7a',
        '--text-primary': '#f8fafc',
        '--text-secondary': '#d8b4fe',
        '--text-muted': '#a78bfa',
        '--color-primary-400': '#a78bfa',
        '--color-primary-500': '#8b5cf6',
        '--color-primary-600': '#7c3aed',
        '--border-color': 'rgba(167, 139, 250, 0.1)',
        '--gradient-primary': 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)'
    },
    [StaticThemePreset.LIGHT]: {
        '--bg-primary': '#ffffff',
        '--bg-secondary': '#f8fafc',
        '--bg-tertiary': '#f1f5f9',
        '--text-primary': '#0f172a',
        '--text-secondary': '#475569',
        '--text-muted': '#94a3b8',
        '--color-primary-400': '#60a5fa',
        '--color-primary-500': '#3b82f6',
        '--color-primary-600': '#2563eb',
        '--border-color': 'rgba(15, 23, 42, 0.1)',
        '--gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)'
    },
    [StaticThemePreset.CUSTOM]: {
        '--bg-primary': '#0f172a',
        '--bg-secondary': '#1e293b',
        '--text-primary': '#f8fafc',
        '--text-secondary': '#94a3b8',
        '--color-primary-500': '#3b82f6'
    }
};

/**
 * Vite project dependencies for static export.
 */
export const STATIC_VITE_DEPENDENCIES = {
    dependencies: {
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        'react-router-dom': '^6.20.0',
        'lucide-react': '^0.300.0'
    },
    devDependencies: {
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        '@vitejs/plugin-react': '^4.2.0',
        'typescript': '^5.3.0',
        'vite': '^5.0.0'
    }
};

/**
 * Files to exclude from asset collection.
 */
export const STATIC_ASSET_EXCLUDES = [
    '.git',
    'node_modules',
    '.env',
    '.env.local',
    'dist',
    'coverage',
    '*.log',
    '*.lock'
];

/**
 * Maximum file size for individual assets (10MB).
 */
export const MAX_STATIC_ASSET_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Get display name for a page type.
 */
export function getStaticPageDisplayName(pageType: StaticPageType): string {
    const names: Record<StaticPageType, string> = {
        [StaticPageType.HOME]: 'Home Page',
        [StaticPageType.RESUME]: 'Resume / CV',
        [StaticPageType.PROJECTS]: 'Projects Catalogue',
        [StaticPageType.PROJECT_DETAIL]: 'Project Details'
    };
    return names[pageType] || pageType;
}

/**
 * Get icon name for a page type (Lucide icon).
 */
export function getStaticPageIcon(pageType: StaticPageType): string {
    const icons: Record<StaticPageType, string> = {
        [StaticPageType.HOME]: 'Home',
        [StaticPageType.RESUME]: 'FileText',
        [StaticPageType.PROJECTS]: 'Briefcase',
        [StaticPageType.PROJECT_DETAIL]: 'FolderOpen'
    };
    return icons[pageType] || 'File';
}
