/**
 * @fileoverview Design System Tokens
 * Single source of truth for all design values.
 * Import this in components for consistent styling.
 * 
 * @author Armand Richelet-Kleinberg
 */

// ============================================
// Colors
// ============================================

export const COLORS = {
    // Primary - Blue gradient base
    primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
    },
    // Secondary - Purple accent
    secondary: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7c3aed',
        800: '#6b21a8',
        900: '#581c87',
    },
    // Neutral - Slate for backgrounds/text
    neutral: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
        950: '#020617',
    },
    // Semantic colors
    success: {
        light: '#86efac',
        DEFAULT: '#22c55e',
        dark: '#16a34a',
    },
    error: {
        light: '#fca5a5',
        DEFAULT: '#ef4444',
        dark: '#dc2626',
    },
    warning: {
        light: '#fcd34d',
        DEFAULT: '#f59e0b',
        dark: '#d97706',
    },
    info: {
        light: '#7dd3fc',
        DEFAULT: '#0ea5e9',
        dark: '#0284c7',
    },
} as const;

// ============================================
// Spacing (rem-based for accessibility)
// ============================================

export const SPACING = {
    0: '0',
    px: '1px',
    0.5: '0.125rem',   // 2px
    1: '0.25rem',      // 4px
    1.5: '0.375rem',   // 6px
    2: '0.5rem',       // 8px
    2.5: '0.625rem',   // 10px
    3: '0.75rem',      // 12px
    3.5: '0.875rem',   // 14px
    4: '1rem',         // 16px
    5: '1.25rem',      // 20px
    6: '1.5rem',       // 24px
    7: '1.75rem',      // 28px
    8: '2rem',         // 32px
    9: '2.25rem',      // 36px
    10: '2.5rem',      // 40px
    11: '2.75rem',     // 44px
    12: '3rem',        // 48px
    14: '3.5rem',      // 56px
    16: '4rem',        // 64px
    20: '5rem',        // 80px
    24: '6rem',        // 96px
    28: '7rem',        // 112px
    32: '8rem',        // 128px
} as const;

// ============================================
// Typography
// ============================================

export const TYPOGRAPHY = {
    fontFamily: {
        sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
        display: '"Outfit", "Inter", sans-serif',
    },
    fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
        '5xl': ['3rem', { lineHeight: '1.2' }],       // 48px
        '6xl': ['3.75rem', { lineHeight: '1.1' }],    // 60px
        '7xl': ['4.5rem', { lineHeight: '1.1' }],     // 72px
    },
    fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
    },
} as const;

// ============================================
// Border Radius
// ============================================

export const RADII = {
    none: '0',
    sm: '0.25rem',     // 4px
    DEFAULT: '0.375rem', // 6px
    md: '0.5rem',      // 8px
    lg: '0.75rem',     // 12px
    xl: '1rem',        // 16px
    '2xl': '1.5rem',   // 24px
    full: '9999px',
} as const;

// ============================================
// Shadows
// ============================================

export const SHADOWS = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    // Glow effects
    glow: {
        blue: '0 0 20px rgba(59, 130, 246, 0.5)',
        purple: '0 0 20px rgba(139, 92, 246, 0.5)',
        success: '0 0 20px rgba(34, 197, 94, 0.5)',
    },
} as const;

// ============================================
// Breakpoints (Mobile First)
// ============================================

export const BREAKPOINTS = {
    xs: '320px',
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
} as const;

// ============================================
// Z-Index Scale
// ============================================

export const Z_INDEX = {
    behind: -1,
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    overlay: 40,
    modal: 50,
    popover: 60,
    tooltip: 70,
    toast: 80,
    skipLink: 100,
} as const;

// ============================================
// Transitions
// ============================================

export const TRANSITIONS = {
    duration: {
        fast: '150ms',
        DEFAULT: '200ms',
        slow: '300ms',
        slower: '500ms',
    },
    easing: {
        linear: 'linear',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
} as const;

// ============================================
// Gradients
// ============================================

export const GRADIENTS = {
    primary: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    secondary: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    dark: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    glow: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
    shine: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
} as const;

// ============================================
// Export all tokens
// ============================================

export const DesignTokens = {
    colors: COLORS,
    spacing: SPACING,
    typography: TYPOGRAPHY,
    radii: RADII,
    shadows: SHADOWS,
    breakpoints: BREAKPOINTS,
    zIndex: Z_INDEX,
    transitions: TRANSITIONS,
    gradients: GRADIENTS,
} as const;

export default DesignTokens;
