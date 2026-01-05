/**
 * @fileoverview Enhanced TechBadge Component
 * Wrapper around ark-alliance-react-ui TechBadge that handles data fetching
 * 
 * @module components/TechBadge
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import { TechnologyDto } from '@ark/portfolio-share';
import { useTechnology } from '../../hooks/useTechnology';
import { TechBadge as LibraryTechBadge } from 'ark-alliance-react-ui';

interface TechBadgeProps {
    /** Technology key (e.g., "react", "typescript") */
    techKey: string;
    /** Badge size */
    size?: 'sm' | 'md' | 'lg';
    /** Active state */
    active?: boolean;
    /** Show technology icon */
    showIcon?: boolean;
    /** Click handler - receives full technology data */
    onClick?: (tech: TechnologyDto) => void;
    /** Additional className */
    className?: string;
}

/**
 * TechBadge Component
 * Wrapper around ark-alliance-react-ui TechBadge that handles data fetching
 */
export const TechBadge: React.FC<TechBadgeProps> = ({
    techKey,
    size = 'md',
    active = false,
    showIcon = false,
    onClick,
    className
}) => {
    // Guard against null/undefined techKey
    const safeTechKey = techKey || '';

    // Always call the hook (React hooks must be called unconditionally)
    const tech = useTechnology(safeTechKey);

    // Don't render anything if techKey is empty
    if (!safeTechKey) {
        return null;
    }

    // Create fallback technology data when lookup fails
    // This ensures badges are visible even when technology data hasn't loaded
    const fallbackTech: TechnologyDto = {
        key: safeTechKey,
        name: safeTechKey.charAt(0).toUpperCase() + safeTechKey.slice(1), // Capitalize first letter
        label: safeTechKey.charAt(0).toUpperCase() + safeTechKey.slice(1), // Same as name for fallback
        color: 'var(--text-secondary, #94a3b8)', // Use theme variable with fallback
        icon: '',
        description: `Technology: ${safeTechKey}`,
        category: 'Other'
    };

    // Use actual tech data or fallback
    const effectiveTech = tech || fallbackTech;

    const handleClick = () => {
        if (onClick) {
            onClick(effectiveTech);
        }
    };

    // Construct technology data object for library component
    const techData = {
        key: effectiveTech.key,
        name: effectiveTech.name,
        color: effectiveTech.color,
        icon: effectiveTech.icon,
        description: effectiveTech.description,
        category: effectiveTech.category,
        website: effectiveTech.website,
        versions: effectiveTech.versions
    };

    return (
        <LibraryTechBadge
            techKey={safeTechKey}
            technology={techData}
            size={size}
            active={active}
            showIcon={showIcon}
            onClick={onClick ? handleClick : undefined}
            className={`tech-badge ${className || ''}`}
        />
    );
};
