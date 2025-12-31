/**
 * @fileoverview Skip Link Component
 * Provides "Skip to main content" accessibility feature.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import './SkipLink.styles.css';

export interface SkipLinkProps {
    /** Target element ID (without #) */
    targetId?: string;
    /** Custom label text */
    label?: string;
}

/**
 * Skip Link component for accessibility.
 * Allows keyboard users to skip navigation and go directly to main content.
 * 
 * @example
 * <SkipLink targetId="main-content" />
 * <nav>...</nav>
 * <main id="main-content">...</main>
 */
export const SkipLink: React.FC<SkipLinkProps> = ({
    targetId = 'main-content',
    label = 'Skip to main content'
}) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
            target.focus();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <a
            href={`#${targetId}`}
            className="skip-link"
            onClick={handleClick}
        >
            {label}
        </a>
    );
};

export default SkipLink;
