/**
 * RadialNavigation Types
 * Type definitions for the star-pattern navigation component.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { ReactNode } from 'react';

/**
 * Configuration for a single navigation item.
 */
export interface RadialNavItem {
    /** Unique identifier */
    id: string;
    /** Display label */
    label: string;
    /** Icon element to display */
    icon: ReactNode;
    /** Angle in degrees (0 = right, 90 = bottom, -90 = top) */
    angle: number;
    /** Navigation route or action */
    route?: string;
    /** Optional override for distance from center */
    distance?: number;
    /** Optional control point for the Bezier curve (relative to center) */
    curveControlPoint?: { x: number; y: number };
}

/**
 * Position calculated for a navigation item.
 */
export interface NavItemPosition {
    x: number;
    y: number;
}

/**
 * Props for RadialNavigation component.
 */
export interface RadialNavigationProps {
    /** Navigation items to display */
    items: RadialNavItem[];
    /** Radius distance from center to buttons */
    radius?: number;
    /** Handler called when item is clicked */
    onItemClick?: (item: RadialNavItem) => void;
    /** Whether navigation is currently active/visible */
    isActive?: boolean;
    /** CSS class name */
    className?: string;
}

/**
 * Props for individual navigation button.
 */
export interface RadialNavButtonProps {
    /** Navigation item data */
    item: RadialNavItem;
    /** Position from center */
    position: NavItemPosition;
    /** Is mobile viewport */
    isMobile: boolean;
    /** Click handler */
    onClick: () => void;
}

