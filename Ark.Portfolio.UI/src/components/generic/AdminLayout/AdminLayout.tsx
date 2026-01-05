/**
 * @fileoverview AdminLayout Component
 * Main layout wrapper for all Admin pages with sidebar, header, and content area.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import { ADMIN_NAV_ITEMS } from './AdminLayout.config';
import { LogOut, User as UserIcon, Lock, Menu, X, Sparkles } from 'lucide-react';
import { ChangePasswordModal } from '../ChangePasswordModal/ChangePasswordModal';
import './AdminLayout.styles.css';

// Logo is loaded from public assets
const LOGO_PATH = '/Assets/App/LogoArkAlliance.png';

/**
 * Props for AdminLayout component
 */
interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

/**
 * AdminLayout Component
 * 
 * Provides consistent layout structure for all admin pages including:
 * - Collapsible sidebar with navigation
 * - Header with breadcrumb and user info
 * - Content area for page-specific content
 * - Password change modal
 */
export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    /**
     * Handle user logout
     */
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    /**
     * Toggle mobile menu visibility
     */
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                {/* Logo Section */}
                <div className="admin-sidebar-header">
                    <div className="admin-logo-wrapper">
                        <img src={LOGO_PATH} alt="Ark Alliance" className="admin-logo-img" />
                        <div className="admin-logo-text">
                            <span className="admin-logo-name">Ark.Portfolio</span>
                            <span className="admin-logo-badge">Admin</span>
                        </div>
                    </div>
                    <button className="admin-mobile-close" onClick={() => setIsMobileMenuOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="admin-nav">
                    {ADMIN_NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) =>
                                `admin-nav-item ${isActive ? 'active' : ''}`
                            }
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="admin-nav-icon">{item.icon}</span>
                            <span className="admin-nav-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer Section */}
                <div className="admin-sidebar-footer">
                    <div className="admin-user-card">
                        <div className="admin-user-avatar">
                            <UserIcon size={18} />
                        </div>
                        <div className="admin-user-info">
                            <span className="admin-user-name">{user?.username || 'Admin'}</span>
                            <span className="admin-user-role">Administrator</span>
                        </div>
                    </div>

                    <div className="admin-footer-actions">
                        <button
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="admin-footer-btn"
                            title="Change Password"
                        >
                            <Lock size={16} />
                            <span>Password</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="admin-footer-btn admin-footer-btn-danger"
                            title="Sign Out"
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <div className="admin-header-left">
                        <button className="admin-mobile-toggle" onClick={toggleMobileMenu}>
                            <Menu size={24} />
                        </button>
                        <div className="admin-breadcrumb">
                            <span className="admin-breadcrumb-app">Ark.Portfolio</span>
                            <span className="admin-breadcrumb-sep">/</span>
                            <h1 className="admin-page-title">{title || 'Dashboard'}</h1>
                        </div>
                    </div>
                    <div className="admin-header-right">
                        <div className="admin-header-badge">
                            <Sparkles size={14} />
                            <span>2026 Edition</span>
                        </div>
                    </div>
                </header>

                <div className="admin-content">
                    <div className="admin-content-inner">
                        {children}
                    </div>
                </div>
            </main>

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
};

export default AdminLayout;
