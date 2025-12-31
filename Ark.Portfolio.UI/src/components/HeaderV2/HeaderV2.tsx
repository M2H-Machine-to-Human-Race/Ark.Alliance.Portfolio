/**
 * @fileoverview HeaderV2 View Component
 * Polished, responsive header with navigation and admin access.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, FileText, Briefcase, Settings } from 'lucide-react';
import { useHeaderV2Model } from './HeaderV2.model';
import './HeaderV2.styles.css';

/**
 * HeaderV2 Props
 */
export interface HeaderV2Props {
    /** Optional additional CSS class */
    className?: string;
}

/**
 * HeaderV2 Component
 * 
 * Polished, accessible header with:
 * - Logo and brand
 * - Primary navigation (Home, Resume, Portfolio)
 * - Admin access button (when authenticated)
 * - Responsive mobile menu with slideout drawer
 * - Keyboard navigation support
 * - ARIA accessibility attributes
 */
export const HeaderV2: React.FC<HeaderV2Props> = ({ className = '' }) => {
    const vm = useHeaderV2Model();

    const getNavIcon = (id: string) => {
        switch (id) {
            case 'home': return <Home size={18} />;
            case 'resume': return <FileText size={18} />;
            case 'portfolio': return <Briefcase size={18} />;
            default: return null;
        }
    };

    return (
        <>
            <header
                className={`header ${vm.isScrolled ? 'scrolled' : ''} ${className}`}
                role="banner"
            >
                {/* Logo */}
                <Link to="/" className="header-logo" aria-label="Home">
                    <div className="header-logo-mark">A</div>
                    <div className="header-logo-text">
                        Ark<span>.Portfolio</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="header-nav" role="navigation" aria-label="Main navigation">
                    {vm.navItems.map(item => (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={`header-nav-link ${vm.activePath === item.path ? 'active' : ''}`}
                            aria-current={vm.activePath === item.path ? 'page' : undefined}
                        >
                            {getNavIcon(item.id)}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Section */}
                <div className="header-right">
                    {/* Admin Button (desktop) */}
                    {vm.isAdmin && (
                        <Link to="/admin/dashboard" className="header-admin-btn">
                            <Settings size={16} />
                            <span>Admin</span>
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="header-mobile-toggle"
                        onClick={vm.toggleMobileMenu}
                        onKeyDown={vm.handleKeyDown}
                        aria-expanded={vm.isMobileMenuOpen}
                        aria-controls="mobile-menu"
                        aria-label={vm.isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                        {vm.isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Overlay */}
            <div
                className={`header-mobile-overlay ${vm.isMobileMenuOpen ? 'open' : ''}`}
                onClick={vm.closeMobileMenu}
                aria-hidden="true"
            />

            {/* Mobile Menu */}
            <nav
                id="mobile-menu"
                className={`header-mobile-menu ${vm.isMobileMenuOpen ? 'open' : ''}`}
                role="navigation"
                aria-label="Mobile navigation"
                aria-hidden={!vm.isMobileMenuOpen}
            >
                <div className="header-mobile-menu-header">
                    <span className="header-mobile-menu-title">Menu</span>
                    <button
                        className="header-mobile-close"
                        onClick={vm.closeMobileMenu}
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="header-mobile-nav">
                    {vm.navItems.map(item => (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={`header-mobile-link ${vm.activePath === item.path ? 'active' : ''}`}
                            onClick={vm.closeMobileMenu}
                            aria-current={vm.activePath === item.path ? 'page' : undefined}
                        >
                            {getNavIcon(item.id)}
                            {item.label}
                        </Link>
                    ))}
                </div>

                {vm.isAdmin && (
                    <div className="header-mobile-admin">
                        <Link
                            to="/admin/dashboard"
                            className="header-mobile-admin-btn"
                            onClick={vm.closeMobileMenu}
                        >
                            <Settings size={18} />
                            Admin Dashboard
                        </Link>
                    </div>
                )}
            </nav>

            {/* Header Offset Spacer */}
            <div className="header-offset" />
        </>
    );
};

export default HeaderV2;
