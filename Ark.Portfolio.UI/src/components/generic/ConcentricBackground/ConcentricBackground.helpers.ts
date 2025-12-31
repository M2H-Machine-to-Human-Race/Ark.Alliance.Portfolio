/**
 * ConcentricBackground Helpers
 * Utility functions for background calculations.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { CircleConfig } from './ConcentricBackground.types';

/**
 * Default circle radii for concentric background.
 */
const DEFAULT_RADII = [300, 600, 900, 1200, 1500, 1800];

/**
 * Generates default circle configurations.
 * @returns Array of circle configurations with decreasing opacity
 */
export function generateDefaultCircles(): CircleConfig[] {
    return DEFAULT_RADII.map((radius, idx) => ({
        radius: radius / 2, // Convert to actual SVG radius
        animationDuration: 30 + idx * 12,
        strokeOpacity: 0.35 - (idx * 0.05)
    }));
}

/**
 * Generates SVG path for circular motion animation.
 * @param centerX - X coordinate of center
 * @param centerY - Y coordinate of center
 * @param radius - Radius of the circle
 * @returns SVG path string for circular motion
 */
export function generateCircularPath(centerX: number, centerY: number, radius: number): string {
    return `M ${centerX}, ${centerY - radius} a ${radius},${radius} 0 1,1 0,${radius * 2} a ${radius},${radius} 0 1,1 0,-${radius * 2}`;
}

/**
 * Calculates particle offsets for even distribution around circle.
 * @param count - Number of particles
 * @returns Array of angular offsets in degrees
 */
export function calculateParticleOffsets(count: number): number[] {
    const offsets: number[] = [];
    const step = 360 / count;
    for (let i = 0; i < count; i++) {
        offsets.push(i * step);
    }
    return offsets;
}

