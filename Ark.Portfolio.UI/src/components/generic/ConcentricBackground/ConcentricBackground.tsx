/**
 * ConcentricBackground Component
 * Animated SVG background with concentric circles and orbiting particles.
 * Creates an elegant visual anchor for the architectural theme.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import { ConcentricBackgroundProps } from './ConcentricBackground.types';
import {
    generateDefaultCircles,
    generateCircularPath,
    calculateParticleOffsets
} from './ConcentricBackground.helpers';
import { cn } from '../../../utils/cn';
import './ConcentricBackground.styles.css';

/**
 * Animated background with concentric circles and orbiting particles.
 * Used in the architectural theme as the main visual element.
 */
export const ConcentricBackground: React.FC<ConcentricBackgroundProps> = ({
    circles,
    particlesPerCircle = 3,
    color = '#000',
    className
}) => {
    const circleConfigs = circles || generateDefaultCircles();
    const particleOffsets = calculateParticleOffsets(particlesPerCircle);

    // SVG viewBox dimensions - centered at 700,700
    const viewBoxSize = 1400;
    const center = viewBoxSize / 2;

    return (
        <div className={cn('concentric-background', className)} style={{ color }}>
            <svg
                className="concentric-background__svg"
                viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
            >
                {circleConfigs.map((config, idx) => (
                    <React.Fragment key={`circle-${idx}`}>
                        {/* Circle outline */}
                        <circle
                            className="concentric-background__circle"
                            cx={center}
                            cy={center}
                            r={config.radius}
                            strokeOpacity={config.strokeOpacity}
                        />

                        {/* Orbiting particles */}
                        {particleOffsets.map((offset) => (
                            <circle
                                key={`particle-${idx}-${offset}`}
                                className="concentric-background__particle"
                                r="1.5"
                                opacity={0.6}
                            >
                                <animateMotion
                                    dur={`${config.animationDuration}s`}
                                    begin={`${offset / 10}s`}
                                    repeatCount="indefinite"
                                    path={generateCircularPath(center, center, config.radius)}
                                />
                            </circle>
                        ))}
                    </React.Fragment>
                ))}
            </svg>
        </div>
    );
};

export default ConcentricBackground;

