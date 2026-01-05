/**
 * @fileoverview Project Presentation Section Enumeration
 * Defines the available sections in a project presentation/detail page.
 * 
 * Responsibilities:
 * - Define valid section identifiers for project presentation
 * - Support type-safe section navigation
 * - Maintain consistent section naming across frontend and backend
 * 
 * Inputs: None (enum definition)
 * Outputs: Type-safe enum values
 * Side Effects: None
 * Invariants: Section values must match route segments and API expectations
 * 
 * @example
 * ```typescript
 * import { ProjectSection } from '@ark/portfolio-share';
 * 
 * const currentSection: ProjectSection = ProjectSection.OVERVIEW;
 * ```
 * 
 * @author Armand Richelet-Kleinberg
 */

/**
 * Project Presentation Section Enumeration
 * 
 * Represents the different sections/tabs available in a project detail view.
 * These correspond to content pages within a project's documentation.
 * 
 * @remarks
 * - Values are lowercase for use in URLs and API calls
 * - Display names should be derived from TERMINOLOGY constants
 * - Order reflects recommended navigation sequence
 */
export enum ProjectSection {
    /** Project overview and summary */
    OVERVIEW = 'overview',

    /** Architecture diagrams and system design */
    ARCHITECTURE = 'architecture',

    /** Functional requirements and user stories */
    FUNCTIONAL = 'functional',

    /** Features and functionality demonstration */
    FEATURES = 'features',

    /** Technical implementation details */
    TECHNICAL = 'technical',

    /** Development roadmap and future plans */
    ROADMAP = 'roadmap',

    /** Media gallery (screenshots, videos, demos) */
    GALLERY = 'gallery',
}

/**
 * Default section to display when loading a project
 */
export const DEFAULT_PROJECT_SECTION = ProjectSection.OVERVIEW;

/**
 * Maximum number of images allowed in gallery section
 */
export const MAX_GALLERY_IMAGES = 20;
