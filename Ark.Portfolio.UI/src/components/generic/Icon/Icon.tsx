import React from 'react';
import { IconProps } from './Icon.types';
import { IconRegistry } from './icons/IconRegistry';
import { cn } from '../../../utils/cn';
import './Icon.styles.css';

export const Icon: React.FC<IconProps> = ({
    name,
    size = 'md',
    className,
    color,
    rotation,
    flip,
    spin,
    ariaLabel,
    onClick,
    ...props
}) => {
    const iconDef = (IconRegistry as any)[name];

    if (!iconDef) {
        console.warn(`Icon "${name}" not found in registry.`);
        return null; // Or placeholder
    }

    // Size Classes
    const sizeClasses = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    };

    // Transform logic
    const style: React.CSSProperties = {
        color: color,
        transform: [
            rotation ? `rotate(${rotation}deg)` : '',
            flip === 'horizontal' ? 'scaleX(-1)' : '',
            flip === 'vertical' ? 'scaleY(-1)' : ''
        ].filter(Boolean).join(' ') || undefined,
        cursor: onClick ? 'pointer' : undefined
    };

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
                "inline-block transition-colors",
                sizeClasses[size || 'md'],
                spin && "animate-spin-slow",
                className
            )}
            style={style}
            onClick={onClick}
            aria-label={ariaLabel || name}
            role="img"
            {...props}
        >
            <path d={iconDef.path} />
        </svg>
    );
};

