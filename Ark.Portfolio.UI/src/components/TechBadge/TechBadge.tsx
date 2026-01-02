/**
 * @fileoverview Enhanced TechBadge Component
 * Displays technology badges with icons, colors, and click functionality
 * 
 * @module components/TechBadge
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import { TechnologyDto } from '@ark/portfolio-share';
import { useTechnology } from '../../hooks/useTechnology';
import { cn } from '../../utils/cn';

interface TechBadgeProps {
    /** Technology key (e.g., "react", "typescript") */
    techKey: string;
    /** Badge size */
    size?: 'sm' | 'md';
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
 * Displays a stylized badge for a technology with optional icon and click handler
 */
export const TechBadge: React.FC<TechBadgeProps> = ({
    techKey,
    size = 'md',
    active = false,
    showIcon = false,
    onClick,
    className
}) => {
    const tech = useTechnology(techKey);

    // Fallback if technology not found
    const displayName = tech?.name || techKey;
    const brandColor = tech?.color || '#64748b';
    const iconClass = tech?.icon || 'fas fa-code';

    const handleClick = () => {
        if (onClick && tech) {
            onClick(tech);
        }
    };

    return (
        <span
            className={cn(
                "tech-badge",
                "font-mono font-semibold rounded-lg border transition-all duration-300 inline-flex items-center gap-1.5",
                size === 'sm' ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1",
                active
                    ? "shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                    : "hover:shadow-[0_0_10px_rgba(100,116,139,0.15)]",
                onClick && tech && "cursor-pointer hover:scale-105",
                !tech && "opacity-70",
                className
            )}
            style={{
                backgroundColor: active
                    ? `${brandColor}20`
                    : `rgba(30, 41, 59, 0.6)`,
                borderColor: active
                    ? `${brandColor}80`
                    : `${brandColor}40`,
                color: active ? brandColor : `${brandColor}cc`
            }}
            onClick={handleClick}
            title={tech?.description || displayName}
        >
            {showIcon && tech && (
                <i
                    className={iconClass}
                    style={{ color: brandColor, fontSize: size === 'sm' ? '10px' : '12px' }}
                    aria-hidden="true"
                />
            )}
            <span>{displayName}</span>
        </span>
    );
};
