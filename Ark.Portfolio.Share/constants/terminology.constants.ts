/**
 * @fileoverview Terminology Constants
 * Centralized terminology for consistent naming across the application.
 * 
 * Responsibilities:
 * - Define standard terms for domain concepts
 * - Ensure UI consistency
 * - Support internationalization preparation
 * 
 * Inputs: None (pure constants)
 * Outputs: Constant terminology values
 * Side Effects: None
 * Invariants: All terms must be consistent with user-facing documentation
 * 
 * @example
 * ```typescript
 * import { TERMINOLOGY } from '@ark/portfolio-share';
 * 
 * const pageTitle = TERMINOLOGY.RESUME_DISPLAY; // "Resume"
 * const apiEndpoint = `/api/${TERMINOLOGY.RESUME}`; // "/api/resume"
 * ```
 * 
 * @author Armand Richelet-Kleinberg
 */

/**
 * Standard terminology for portfolio domain concepts
 * 
 * @remarks
 * - Use DISPLAY variants for user-facing text
 * - Use lowercase variants for routes and identifiers
 * - Maintain backwards compatibility via deprecated aliases
 */
export const TERMINOLOGY = {
    // Resume (formerly CV)
    RESUME: 'resume',
    RESUME_DISPLAY: 'Resume',
    RESUME_PLURAL: 'resumes',

    // Experience
    EXPERIENCE: 'experience',
    EXPERIENCE_DISPLAY: 'Experience',
    EXPERIENCE_PLURAL: 'experiences',

    // Education
    EDUCATION: 'education',
    EDUCATION_DISPLAY: 'Education',
    EDUCATION_PLURAL: 'education',

    // Skills
    SKILL: 'skill',
    SKILL_DISPLAY: 'Skill',
    SKILL_PLURAL: 'skills',

    // Projects
    PROJECT: 'project',
    PROJECT_DISPLAY: 'Project',
    PROJECT_PLURAL: 'projects',

    // Media
    MEDIA: 'media',
    MEDIA_DISPLAY: 'Media',

    // Carousel
    CAROUSEL: 'carousel',
    CAROUSEL_DISPLAY: 'Carousel',

    // Admin
    ADMIN: 'admin',
    ADMIN_DISPLAY: 'Admin',

    // Deprecated (for backwards compatibility)
    /** @deprecated Use RESUME instead */
    CV: 'cv',
    /** @deprecated Use RESUME_DISPLAY instead */
    CV_DISPLAY: 'CV',
} as const;

/**
 * Type for terminology keys
 */
export type TerminologyKey = keyof typeof TERMINOLOGY;

/**
 * Type for terminology values
 */
export type TerminologyValue = typeof TERMINOLOGY[TerminologyKey];
