/**
 * @fileoverview HeaderV2 View Component
 * Polished, responsive header with navigation and admin access.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, FileText, Briefcase, Settings, LogIn, Download, Loader2 } from 'lucide-react';
import { useHeaderV2Model } from './HeaderV2.model';
import { ConnectionIndicator } from '../ConnectionIndicator';
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
 * - Generate Static Website button (when authenticated)
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
                {/* Profile Name & Current Page */}
                <Link to="/" className="header-logo" aria-label="Home">
                    <img
                        src="/Assets/Site/Icon.png"
                        alt="Logo"
                        className="header-logo-mark"
                    />
                    <div className="header-profile-info">
                        <div className="header-profile-name">
                            {vm.profile.fullName}
                            {vm.currentPageTitle && (
                                <>
                                    <span className="header-page-separator">/</span>
                                    <span className="header-page-title">{vm.currentPageTitle}</span>
                                </>
                            )}
                        </div>
                        <div className="header-profile-title">{vm.profile.title}</div>
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
                    {/* Generate Static Website Button (only for admin) */}
                    {vm.isAdmin && (
                        <button
                            className="header-export-btn"
                            onClick={vm.generateStaticSite}
                            disabled={vm.isExporting}
                            title={vm.exportStatus || "Generate Static Website"}
                        >
                            {vm.isExporting ? (
                                <Loader2 size={16} className="header-export-spinner" />
                            ) : (
                                <Download size={16} />
                            )}
                            <span>{vm.isExporting ? 'Generating...' : 'Export Site'}</span>
                        </button>
                    )}

                    {/* Export Status Toast */}
                    {vm.exportStatus && !vm.isExporting && (
                        <div className="header-export-status">
                            {vm.exportStatus}
                        </div>
                    )}

                    {/* Backend Connection Status Indicator */}
                    <ConnectionIndicator className="header-connection-indicator" />

                    {/* Admin/Login Button (always visible on desktop) */}
                    <Link
                        to={vm.isAdmin ? "/admin/dashboard" : "/login"}
                        className={`header-admin-btn ${!vm.isAdmin ? 'header-login-btn' : ''}`}
                    >
                        {vm.isAdmin ? <Settings size={16} /> : <LogIn size={16} />}
                        <span>{vm.isAdmin ? 'Admin' : 'Login'}</span>
                    </Link>

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

                {/* Mobile Export Button (for admin) */}
                {vm.isAdmin && (
                    <div className="header-mobile-export">
                        <button
                            className="header-mobile-export-btn"
                            onClick={() => {
                                vm.generateStaticSite();
                                vm.closeMobileMenu();
                            }}
                            disabled={vm.isExporting}
                        >
                            {vm.isExporting ? (
                                <Loader2 size={18} className="header-export-spinner" />
                            ) : (
                                <Download size={18} />
                            )}
                            {vm.isExporting ? 'Generating...' : 'Generate Static Site'}
                        </button>
                    </div>
                )}

                {/* Mobile Login/Admin Section (always visible) */}
                <div className="header-mobile-admin">
                    <Link
                        to={vm.isAdmin ? "/admin/dashboard" : "/login"}
                        className={`header-mobile-admin-btn ${!vm.isAdmin ? 'header-mobile-login-btn' : ''}`}
                        onClick={vm.closeMobileMenu}
                    >
                        {vm.isAdmin ? <Settings size={18} /> : <LogIn size={18} />}
                        {vm.isAdmin ? 'Admin Dashboard' : 'Login'}
                    </Link>
                </div>
            </nav>

            {/* Header Offset Spacer */}
            <div className="header-offset" />
        </>
    );
};

export default HeaderV2;
