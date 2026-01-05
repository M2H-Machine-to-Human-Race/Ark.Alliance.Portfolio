/**
 * @fileoverview Static Generation DTOs
 * Data Transfer Objects for static site generation.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { StaticPageType, StaticExportStatus, StaticThemePreset, StaticResumeSectionType } from '../enums/static-generation.enum';

/**
 * Configuration for a page in the static export.
 */
export interface PageDefinitionDto {
    /** Unique identifier */
    id?: number;
    /** Page type from enum */
    pageType: StaticPageType;
    /** Page title for navigation */
    title: string;
    /** URL route path */
    route: string;
    /** Sections to include (for resume page) */
    sections?: StaticResumeSectionType[];
    /** Whether page is enabled for export */
    isEnabled: boolean;
    /** Display order in navigation */
    displayOrder: number;
    /** Additional metadata */
    metadata?: Record<string, any>;
}

/**
 * Configuration for static site export.
 */
export interface StaticExportConfigDto {
    /** Pages to include in export */
    pages: PageDefinitionDto[];
    /** Theme preset or custom */
    theme: StaticThemePreset;
    /** Custom theme overrides (if theme is CUSTOM) */
    customTheme?: {
        primaryColor?: string;
        secondaryColor?: string;
        accentColor?: string;
        backgroundColor?: string;
        textColor?: string;
        fontFamily?: string;
    };
    /** Include project subfolders */
    includeProjectSubfolders: boolean;
    /** Include all media assets */
    includeAssets: boolean;
    /** Site metadata */
    siteMetadata: {
        title?: string;
        description?: string;
        author?: string;
        keywords?: string[];
    };
}

/**
 * Result of static site generation.
 */
export interface StaticExportResultDto {
    /** Export status */
    status: StaticExportStatus;
    /** Generated filename */
    filename?: string;
    /** File size in bytes */
    sizeBytes?: number;
    /** Number of pages generated */
    pageCount?: number;
    /** Number of assets included */
    assetCount?: number;
    /** Generation timestamp */
    generatedAt?: string;
    /** Error message if failed */
    error?: string;
}

/**
 * Preview data before export.
 */
export interface StaticExportPreviewDto {
    /** Profile name for export */
    profileName: string;
    /** Number of projects */
    projectCount: number;
    /** Number of experience entries */
    experienceCount: number;
    /** Number of skills */
    skillCount: number;
    /** Number of languages */
    languageCount: number;
    /** Number of hobbies */
    hobbyCount: number;
    /** Number of business domains */
    domainCount: number;
    /** Current theme */
    theme: string;
    /** Estimated ZIP size */
    estimatedSize: string;
    /** Pages to be exported */
    pages: PageDefinitionDto[];
}

/**
 * Request to generate static site.
 */
export interface GenerateStaticSiteRequestDto {
    /** Export configuration */
    config?: Partial<StaticExportConfigDto>;
    /** Force regeneration even if cached */
    forceRegenerate?: boolean;
}

/**
 * Validation for StaticExportConfigDto.
 */
export function validateStaticExportConfig(config: StaticExportConfigDto): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.pages || config.pages.length === 0) {
        errors.push('At least one page must be configured for export.');
    }

    if (!config.theme) {
        errors.push('Theme must be specified.');
    }

    if (config.theme === StaticThemePreset.CUSTOM && !config.customTheme) {
        errors.push('Custom theme settings required when using CUSTOM theme.');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
