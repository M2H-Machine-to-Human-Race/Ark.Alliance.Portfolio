/**
 * ArchitecturalPageLayout Component
 * Page layout for architectural theme internal pages.
 * Provides consistent header, back button, and footer styling.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { ArchitecturalPageLayoutProps } from './ArchitecturalPageLayout.types';
import { cn } from '../../../utils/cn';
import './ArchitecturalPageLayout.styles.css';

/**
 * Page layout component for architectural theme.
 * Renders an overlay page with title, back button, and footer.
 */
export const ArchitecturalPageLayout: React.FC<ArchitecturalPageLayoutProps> = ({
    children,
    title,
    subtitle,
    onBack,
    className
}) => {
    return (
        <div className={cn('arch-page-overlay arch-layout', className)}>
            <div className="arch-layout__container">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="arch-layout__back"
                    aria-label="Return to home"
                >
                    <ChevronLeft
                        size={28}
                        className="arch-layout__back-icon"
                    />
                    <span className="arch-layout__back-text">
                        Return to Center
                    </span>
                </button>

                {/* Header */}
                <header className="arch-layout__header">
                    {subtitle && (
                        <h2 className="arch-layout__subtitle">{subtitle}</h2>
                    )}
                    <h1 className="arch-layout__title">{title}</h1>
                </header>

                {/* Content */}
                <div className="arch-layout__content">
                    {children}
                </div>

                {/* Footer */}
                <footer className="arch-footer">
                    <div className="flex flex-col items-center md:items-start">
                        <span>Armand Richelet-Kleinberg</span>
                        <span style={{ fontSize: '8px', opacity: 0.6 }}>
                            Architect | Designer | Developer
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <a href="#" className="hover:text-black transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-black transition-colors">GitHub</a>
                        <a href="#" className="hover:text-black transition-colors">Email</a>
                    </div>
                    <span style={{ opacity: 0.5 }}>© 2025</span>
                </footer>
            </div>
        </div>
    );
};

export default ArchitecturalPageLayout;

