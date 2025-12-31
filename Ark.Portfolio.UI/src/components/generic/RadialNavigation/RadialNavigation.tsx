/**
 * RadialNavigation Component
 * Star-pattern navigation with circular buttons positioned at angles.
 * Provides elegant navigation for the architectural theme.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React, { useEffect, useState, useMemo } from 'react';
import {
    RadialNavigationProps,
    RadialNavItem
} from './RadialNavigation.types';
import {
    calculateItemPosition,
    calculateResponsiveRadius
} from './RadialNavigation.helpers';
import { cn } from '../../../utils/cn';
import './RadialNavigation.styles.css';

/**
 * Star-pattern radial navigation component.
 * Displays navigation buttons in a circular pattern around the center.
 */
export const RadialNavigation: React.FC<RadialNavigationProps> = ({
    items,
    radius: customRadius,
    onItemClick,
    isActive = true,
    className
}) => {
    const [isMobile, setIsMobile] = useState(false);
    const [windowDimensions, setWindowDimensions] = useState({ width: 800, height: 600 });

    // Handle responsive sizing
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate radius
    const radius = useMemo(() => {
        if (customRadius) return customRadius;
        return calculateResponsiveRadius(
            isMobile,
            windowDimensions.width,
            windowDimensions.height
        );
    }, [customRadius, isMobile, windowDimensions]);

    const handleItemClick = (item: RadialNavItem) => {
        if (onItemClick) {
            onItemClick(item);
        }
    };

    // Calculate container size (needs to cover the reach of the arms)
    const containerSize = radius * 2 + 100; // Add padding
    const center = containerSize / 2;

    return (
        <div
            className={cn(
                'radial-navigation',
                !isActive && 'radial-navigation--hidden',
                className
            )}
            style={{
                width: containerSize,
                height: containerSize
            }}
        >
            <svg className="radial-nav__svg-container">
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                {items.map((item, index) => {
                    const itemRadius = item.distance || radius;
                    const position = calculateItemPosition(item.angle, itemRadius);
                    // Adjust position to be relative to SVG center
                    const endX = center + position.x;
                    const endY = center + position.y;

                    // Calculate control point for Quadratic Bezier Curve
                    let controlX, controlY;

                    if (item.curveControlPoint) {
                        controlX = center + item.curveControlPoint.x;
                        controlY = center + item.curveControlPoint.y;
                    } else {
                        // Default fallback logic
                        const midX = (center + endX) / 2;
                        const midY = (center + endY) / 2;
                        const curveOffset = 40;
                        controlX = midX + (Math.random() > 0.5 ? curveOffset : -curveOffset) * 0.5;
                        controlY = midY - curveOffset;
                    }

                    const pathData = `M ${center} ${center} Q ${controlX} ${controlY} ${endX} ${endY}`;

                    return (
                        <g key={`path-${item.id}`}>
                            <path
                                d={pathData}
                                className="radial-nav__curve"
                            />
                            {/* Animated Dot */}
                            <circle r="3" className="radial-nav__blink-dot">
                                <animateMotion
                                    dur={`${3 + index}s`}
                                    repeatCount="indefinite"
                                    path={pathData}
                                    keyPoints="0;1;0"
                                    keyTimes="0;0.5;1"
                                    calcMode="linear"
                                />
                                <animate
                                    attributeName="opacity"
                                    values="0;1;0"
                                    dur={`${3 + index}s`}
                                    repeatCount="indefinite"
                                />
                            </circle>
                        </g>
                    );
                })}
            </svg>

            {items.map((item) => {
                const itemRadius = item.distance || radius;
                const position = calculateItemPosition(item.angle, itemRadius);

                return (
                    <div
                        key={item.id}
                        className="radial-nav__button"
                        style={{
                            // Pass CSS variables for the wind animation
                            '--tx': `${position.x}px`,
                            '--ty': `${position.y}px`,
                            transform: `translate(${position.x}px, ${position.y}px)`
                        } as React.CSSProperties}
                    >
                        <button
                            className="radial-nav__button-inner"
                            onClick={() => handleItemClick(item)}
                            aria-label={item.label}
                        >
                            <div className="radial-nav__icon">
                                {item.icon}
                            </div>
                        </button>
                        <span className="radial-nav__label">
                            {item.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default RadialNavigation;

