import React from 'react';
import { X, Github, Linkedin, Mail } from 'lucide-react';
import { MobileMenuProps } from './MobileMenu.types';
import './MobileMenu.styles.css';

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onNavigate, activeRoute }) => {
    const menuItems = [
        { label: 'HOME', path: '/' },
        { label: 'PROJECTS', path: '/projects' },
        { label: 'RESUME', path: '/resume' },
        { label: 'PORTFOLIO', path: '/portfolio' }
    ];

    return (
        <>
            <div
                className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />
            <div className={`mobile-menu-drawer ${isOpen ? 'open' : ''}`}>
                <div className="mobile-menu-header">
                    <button className="mobile-menu-close-btn" onClick={onClose}>
                        <X size={32} />
                    </button>
                </div>

                <nav className="mobile-menu-nav">
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            className={`mobile-menu-item ${activeRoute === item.path ? 'active' : ''}`}
                            onClick={() => {
                                onNavigate(item.path);
                                onClose();
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="mobile-menu-footer">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="mobile-social-link">
                        <Github size={24} />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="mobile-social-link">
                        <Linkedin size={24} />
                    </a>
                    <a href="mailto:contact@example.com" className="mobile-social-link">
                        <Mail size={24} />
                    </a>
                </div>
            </div>
        </>
    );
};

