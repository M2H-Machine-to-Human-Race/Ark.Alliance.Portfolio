/**
 * ConcentricBackground Types
 * Type definitions for the animated background component.
 * 
 * @author Armand Richelet-Kleinberg
 */

/**
 * Configuration for a single circle in the background.
 */
export interface CircleConfig {
    /** Radius of the circle */
    radius: number;
    /** Animation duration in seconds for orbiting particles */
    animationDuration: number;
    /** Stroke opacity (0-1) */
    strokeOpacity: number;
}

/**
 * Props for ConcentricBackground component.
 */
export interface ConcentricBackgroundProps {
    /** Optional custom circle configurations */
    circles?: CircleConfig[];
    /** Number of particles per circle */
    particlesPerCircle?: number;
    /** Base color for circles and particles (default: black) */
    color?: string;
    /** CSS class name */
    className?: string;
}

