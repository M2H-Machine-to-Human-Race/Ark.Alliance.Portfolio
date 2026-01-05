/**
 * @fileoverview UI-Local Enums
 * Enumerations that are specific to the frontend UI layer.
 * These do not need to be shared with the backend.
 * 
 * @remarks
 * For enums used by both frontend and backend (e.g., MediaTypeEnum, ProjectStatus),
 * import from '@ark/portfolio-share' instead.
 * 
 * @module enums/ui.enums
 * @author Armand Richelet-Kleinberg
 * @license MIT
 */

/**
 * Timeline entry category for resume timeline display.
 * 
 * @remarks
 * Used for filtering timeline entries in the UI.
 * 'all' is a filter option, not a persisted category.
 */
export enum TimelineCategoryEnum {
    /** Show all entries */
    ALL = 'all',
    /** Work experience entries */
    EXPERIENCE = 'experience',
    /** Educational background entries */
    EDUCATION = 'education',
    /** Achievement/certification entries */
    ACHIEVEMENT = 'achievement'
}

/**
 * View mode for grid/list layouts.
 * 
 * @remarks
 * Common pattern across admin pages for switching display modes.
 */
export enum ViewModeEnum {
    /** Card/thumbnail grid view */
    GRID = 'grid',
    /** Table/list view */
    LIST = 'list'
}

/**
 * Toast notification types.
 * 
 * @remarks
 * Defines the visual style and icon for toast messages.
 */
export enum ToastTypeEnum {
    /** Success message (green) */
    SUCCESS = 'success',
    /** Error message (red) */
    ERROR = 'error',
    /** Warning message (yellow) */
    WARNING = 'warning',
    /** Informational message (blue) */
    INFO = 'info'
}

/**
 * Tab control visual variants.
 * 
 * @remarks
 * UI-only styling options for the TabControl component.
 */
export enum TabVariantEnum {
    /** Default bordered tabs */
    DEFAULT = 'default',
    /** Pill-shaped tabs */
    PILLS = 'pills',
    /** Underlined tabs */
    UNDERLINE = 'underline',
    /** Compact minimal tabs */
    COMPACT = 'compact'
}
