/**
 * @fileoverview UI Layout Constants
 * Centralized constants for UI components, layouts, and styling.
 * Part of the Share layer for cross-project consistency.
 * 
 * Responsibilities:
 * - Define UI-related constants (sizing, spacing, breakpoints)
 * - Provide layout configuration constants
 * - Define component-specific constants
 * 
 * Inputs: None
 * Outputs: Type-safe constant objects
 * Side Effects: None (pure constants)
 * Invariants: All values must be positive numbers for sizing/spacing
 * 
 * @example
 * ```typescript
 * import { LAYOUT_CONSTANTS, SIDEBAR_CONSTANTS } from '@ark/portfolio-share';
 * 
 * const sidebarWidth = SIDEBAR_CONSTANTS.DEFAULT_WIDTH;
 * ```
 * 
 * @author Armand Richelet-Kleinberg
 */

/**
 * Layout Configuration Constants
 * Defines standard layout dimensions and breakpoints
 */
export const LAYOUT_CONSTANTS = {
    /**
     * Responsive breakpoints (in pixels)
     * Based on common device widths
     */
    BREAKPOINTS: {
        /** Mobile devices (0-640px) */
        MOBILE: 640,
        /** Tablets (641-768px) */
        TABLET: 768,
        /** Desktops (769-1024px) */
        DESKTOP: 1024,
        /** Large screens (1025px+) */
        LARGE: 1280,
    },

    /**
     * Container max widths
     */
    CONTAINER: {
        /** Small containers */
        SM: '640px',
        /** Medium containers */
        MD: '768px',
        /** Large containers */
        LG: '1024px',
        /** Extra large containers */
        XL: '1280px',
        /** Full width */
        FULL: '100%',
    },

    /**
     * Standard spacing values (in rem)
     */
    SPACING: {
        /** Extra small spacing (0.25rem / 4px) */
        XS: 0.25,
        /** Small spacing (0.5rem / 8px) */
        SM: 0.5,
        /** Medium spacing (1rem / 16px) */
        MD: 1,
        /** Large spacing (1.5rem / 24px) */
        LG: 1.5,
        /** Extra large spacing (2rem / 32px) */
        XL: 2,
        /** 2XL spacing (3rem / 48px) */
        XXL: 3,
    },

    /**
     * Z-index layers
     */
    Z_INDEX: {
        /** Base layer */
        BASE: 0,
        /** Elevated content */
        ELEVATED: 10,
        /** Dropdown menus */
        DROPDOWN: 100,
        /** Sticky headers */
        STICKY: 500,
        /** Fixed sidebars */
        SIDEBAR: 600,
        /** Modals */
        MODAL: 1000,
        /** Tooltips */
        TOOLTIP: 1100,
        /** Toast notifications */
        TOAST: 1200,
    },
} as const;

/**
 * Sidebar Component Constants
 * Configuration for retractable sidebar components
 */
export const SIDEBAR_CONSTANTS = {
    /**
     * Default sidebar width when expanded (in pixels)
     */
    DEFAULT_WIDTH: 280,

    /**
     * Sidebar width when collapsed (in pixels)
     */
    COLLAPSED_WIDTH: 64,

    /**
     * Animation duration for expand/collapse (in milliseconds)
     */
    ANIMATION_DURATION: 300,

    /**
     * Breakpoint below which sidebar becomes overlay (in pixels)
     */
    OVERLAY_BREAKPOINT: 768,

    /**
     * Sidebar position options
     */
    POSITION: {
        /** Left-aligned sidebar */
        LEFT: 'left',
        /** Right-aligned sidebar */
        RIGHT: 'right',
    } as const,
} as const;

/**
 * Header Component Constants
 * Configuration for header/navbar components
 */
export const HEADER_CONSTANTS = {
    /**
     * Default header height (in pixels)
     */
    DEFAULT_HEIGHT: 72,

    /**
     * Compact header height when scrolled (in pixels)
     */
    COMPACT_HEIGHT: 60,

    /**
     * Scroll threshold to activate compact mode (in pixels)
     */
    SCROLL_THRESHOLD: 50,
} as const;

/**
 * Animation Constants
 * Standard animation timings and easing functions
 */
export const ANIMATION_CONSTANTS = {
    /**
     * Animation durations (in milliseconds)
     */
    DURATION: {
        /** Fast animations */
        FAST: 150,
        /** Normal speed animations */
        NORMAL: 300,
        /** Slow animations */
        SLOW: 500,
    },

    /**
     * Easing functions
     */
    EASING: {
        /** Linear easing */
        LINEAR: 'linear',
        /** Ease in (slow start) */
        EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
        /** Ease out (slow end) */
        EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
        /** Ease in-out (slow start and end) */
        EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
        /** Spring effect */
        SPRING: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
} as const;

/**
 * Scroll Behavior Constants
 * Configuration for smooth scrolling
 */
export const SCROLL_CONSTANTS = {
    /**
     * Scroll behavior type
     */
    BEHAVIOR: {
        /** Smooth scrolling */
        SMOOTH: 'smooth',
        /** Instant scrolling */
        AUTO: 'auto',
    } as const,

    /**
     * Offset for anchored scrolling (accounts for fixed header)
     */
    ANCHOR_OFFSET: 100,
} as const;

/**
 * Type Exports
 * Ensure type safety when using constants
 */
export type LayoutConstants = typeof LAYOUT_CONSTANTS;
export type SidebarConstants = typeof SIDEBAR_CONSTANTS;
export type HeaderConstants = typeof HEADER_CONSTANTS;
export type AnimationConstants = typeof ANIMATION_CONSTANTS;
export type ScrollConstants = typeof SCROLL_CONSTANTS;
