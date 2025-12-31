/**
 * ArchitecturalHomePage Types
 * Type definitions for the architectural home page component.
 * 
 * @author Armand Richelet-Kleinberg
 */

/**
 * Possible page views within the architectural home.
 */
export type ArchitecturalPageView = 'home' | 'cv' | 'portfolio' | 'projects';

/**
 * Props for ArchitecturalHomePage component.
 */
export interface ArchitecturalHomePageProps {
    /** Initial page view */
    initialView?: ArchitecturalPageView;
    /** CSS class name */
    className?: string;
}

/**
 * Title segment for header display.
 */
export interface TitleSegment {
    text: string;
}

