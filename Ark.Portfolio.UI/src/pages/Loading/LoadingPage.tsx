/**
 * @fileoverview LoadingPage View Component
 * System startup loading screen shown until all home page data is loaded.
 * 
 * @author Ark.Alliance
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useLoadingPageModel, LoadingPageProps } from './LoadingPage.model';
import '../../styles/design-system.css';
import './LoadingPage.styles.css';

/**
 * LoadingPage Component
 * 
 * Full-screen loading page displayed at application startup.
 * Shows branding, status messages, and loading animation.
 * Transitions to home page when all data is loaded.
 */
export const LoadingPage: React.FC<LoadingPageProps> = ({ onComplete }) => {
    const vm = useLoadingPageModel({ onComplete });

    return (
        <div className="loading-page" role="status" aria-live="polite">
            {/* Background Effects */}
            <div className="loading-page-bg" />
            <div className="loading-page-gradient" />

            {/* Content Container */}
            <div className="loading-page-content">
                {/* Logo */}
                <div className="loading-page-logo-container">
                    <img
                        src="/Assets/App/LogoArkAlliance.png"
                        alt="Ark Alliance Logo"
                        className="loading-page-logo"
                    />
                </div>

                {/* Title */}
                <h1 className="loading-page-title text-display">
                    Ark.Alliance.Portfolio
                </h1>

                {/* Subtitle */}
                <p className="loading-page-subtitle">
                    Portfolio Content Management System
                </p>

                {/* Loading Indicator */}
                <div className="loading-page-spinner-container">
                    <div className="loading-page-spinner">
                        <Loader2 className="loading-page-spinner-icon animate-spin" size={32} />
                    </div>
                </div>

                {/* Status Message */}
                <p className="loading-page-status">
                    {vm.status}
                </p>

                {/* Progress Bar */}
                <div className="loading-page-progress">
                    <div
                        className="loading-page-progress-bar"
                        style={{ width: `${vm.progress}%` }}
                    />
                </div>

                {/* Error Message */}
                {vm.error && (
                    <div className="loading-page-error" role="alert">
                        {vm.error}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="loading-page-footer">
                <p>© {new Date().getFullYear()} Ark.Alliance. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LoadingPage;
