/**
 * RadialNavigation Helpers
 * Utility functions for radial navigation calculations.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { NavItemPosition } from './RadialNavigation.types';

/**
 * Converts degrees to radians.
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
export function degreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

/**
 * Calculates position for an item at given angle and radius.
 * @param angle - Angle in degrees
 * @param radius - Distance from center
 * @returns X and Y position offsets
 */
export function calculateItemPosition(angle: number, radius: number): NavItemPosition {
    const rad = degreesToRadians(angle);
    return {
        x: radius * Math.cos(rad),
        y: radius * Math.sin(rad)
    };
}

/**
 * Calculates responsive radius based on viewport.
 * @param isMobile - Whether viewport is mobile
 * @param windowWidth - Window width in pixels
 * @param windowHeight - Window height in pixels
 * @returns Calculated radius
 */
export function calculateResponsiveRadius(
    isMobile: boolean,
    windowWidth: number,
    windowHeight: number
): number {
    const base = Math.min(windowWidth, windowHeight);
    return isMobile ? base * 0.36 : base * 0.32;
}

/**
 * Default navigation items for portfolio.
 */
export const DEFAULT_NAV_ITEMS = [
    { id: 'cv', label: 'Resume', angle: -90 },
    { id: 'portfolio', label: 'Portfolio', angle: 30 },
    { id: 'projects', label: 'Projects', angle: 150 }
];

