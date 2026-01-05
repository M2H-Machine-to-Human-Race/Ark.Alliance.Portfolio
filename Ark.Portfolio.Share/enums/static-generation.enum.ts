/**
 * @fileoverview Static Generation Enums
 * Enums for static site generation configuration and status.
 * 
 * @author Armand Richelet-Kleinberg
 */

/**
 * Types of pages that can be included in static export.
 */
export enum StaticPageType {
    /** Home page with carousel and quick nav */
    HOME = 'home',
    /** Resume page with experience, education, skills */
    RESUME = 'resume',
    /** Projects catalogue page */
    PROJECTS = 'projects',
    /** Individual project detail page */
    PROJECT_DETAIL = 'project_detail'
}

/**
 * Status of static export generation process.
 */
export enum StaticExportStatus {
    /** Export not started */
    PENDING = 'pending',
    /** Export in progress */
    GENERATING = 'generating',
    /** Export completed successfully */
    COMPLETED = 'completed',
    /** Export failed */
    FAILED = 'failed'
}

/**
 * Sections that can be included in the resume export.
 */
export enum StaticResumeSectionType {
    PROFILE = 'profile',
    EXPERIENCE = 'experience',
    EDUCATION = 'education',
    SKILLS = 'skills',
    LANGUAGES = 'languages',
    HOBBIES = 'hobbies',
    BUSINESS_DOMAINS = 'business_domains'
}

/**
 * Asset types for static export.
 */
export enum StaticAssetType {
    /** Image files (png, jpg, webp, svg) */
    IMAGE = 'image',
    /** Font files (woff, woff2, ttf) */
    FONT = 'font',
    /** Icon files */
    ICON = 'icon',
    /** CSS stylesheets */
    STYLESHEET = 'stylesheet',
    /** Other assets */
    OTHER = 'other'
}

/**
 * Theme presets for static export.
 */
export enum StaticThemePreset {
    /** Dark architectural theme (default) */
    ARCHITECTURAL = 'architectural',
    /** Purple aloevera theme */
    ALOEVERA = 'aloevera',
    /** Light modern theme */
    LIGHT = 'light',
    /** Custom user-defined theme */
    CUSTOM = 'custom'
}
