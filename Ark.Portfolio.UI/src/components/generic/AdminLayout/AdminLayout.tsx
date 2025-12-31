import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import { ADMIN_NAV_ITEMS } from './AdminLayout.config';
import { LogOut, User as UserIcon, Lock } from 'lucide-react';
import { ChangePasswordModal } from '../ChangePasswordModal/ChangePasswordModal';
import './AdminLayout.styles.css';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <div className="admin-logo">Ark.Portfolio Admin</div>
                </div>

                <nav className="admin-nav">
                    {ADMIN_NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) =>
                                `admin-nav-item ${isActive ? 'active' : ''}`
                            }
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <div className="admin-user-info">
                        <UserIcon size={16} />
                        <span>{user?.username}</span>
                    </div>
                    <button onClick={() => setIsPasswordModalOpen(true)} className="logout-button" style={{ marginBottom: '0.5rem' }}>
                        <Lock size={16} />
                        <span>Change Password</span>
                    </button>
                    <button onClick={handleLogout} className="logout-button">
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <h1 className="admin-page-title">{title || 'Dashboard'}</h1>
                </header>
                <div className="admin-content">
                    {children}
                </div>
            </main>

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
};

