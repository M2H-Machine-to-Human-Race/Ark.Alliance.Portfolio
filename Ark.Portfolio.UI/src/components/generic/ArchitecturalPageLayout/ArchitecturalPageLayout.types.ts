/**
 * ArchitecturalPageLayout Types
 * Type definitions for the architectural page layout component.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { ReactNode } from 'react';

/**
 * Props for ArchitecturalPageLayout component.
 */
export interface ArchitecturalPageLayoutProps {
    /** Page content */
    children?: ReactNode;
    /** Page title (large text) */
    title: string;
    /** Page subtitle (small text above title) */
    subtitle?: string;
    /** Handler for back/close action */
    onBack: () => void;
    /** CSS class name */
    className?: string;
}

/**
 * Footer link configuration.
 */
export interface FooterLink {
    label: string;
    href: string;
}

