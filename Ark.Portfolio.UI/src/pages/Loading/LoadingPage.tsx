/**
 * @fileoverview LoadingPage View Component
 * BwarkOs-style intro screen with globe animation and phased transitions.
 * Shows logo, app title, profile name (if backend available), and Enter button.
 * 
 * @author Ark.Alliance
 */

import React from 'react';
import { Play } from 'lucide-react';
import { useLoadingPageModel, LoadingPageProps } from './LoadingPage.model';
import LogoArkAlliance from '../../Assets/LogoArkAlliance.png';
import '../../styles/design-system.css';
import './LoadingPage.styles.css';

/**
 * LoadingPage Component
 * 
 * Full-screen intro page with animated globe, data extraction effect,
 * and phased UI reveal. Transitions when user clicks Enter.
 */
export const LoadingPage: React.FC<LoadingPageProps> = ({ onComplete }) => {
    const vm = useLoadingPageModel({ onComplete });

    const strands = Array.from({ length: 12 });

    return (
        <div className="loading-page" role="status" aria-live="polite">
            {/* Background Effects */}
            <div className="loading-page-bg" />
            <div className="loading-page-grid" />

            {/* Logo Watermark (centered, faint) */}
            <div className="loading-page-watermark">
                <img
                    src={LogoArkAlliance}
                    alt=""
                    className="loading-page-watermark-img"
                />
            </div>

            {/* Globe Animation Container */}
            <div className="loading-page-globe-container">
                <div className={`loading-page-globe ${vm.phase >= 2 ? 'loading-page-globe--hidden' : ''}`}>
                    {/* Wireframe Sphere */}
                    <div className="loading-page-globe-ring loading-page-globe-ring--main" />
                    <div className="loading-page-globe-ring loading-page-globe-ring--outer" />

                    {/* Lat/Long Rings */}
                    {[0, 45, 90, 135].map((deg) => (
                        <div
                            key={deg}
                            className="loading-page-globe-lat"
                            style={{ transform: `rotateY(${deg}deg)` }}
                        />
                    ))}

                    {/* Glowing Core */}
                    <div className="loading-page-globe-core" />

                    {/* Data Extraction Strands (Phase 1) */}
                    {vm.phase === 1 && strands.map((_, i) => (
                        <div
                            key={i}
                            className="loading-page-strand"
                            style={{ transform: `rotate(${i * (360 / strands.length)}deg)` }}
                        >
                            <div
                                className="loading-page-strand-particle"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className="loading-page-strand-trail" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* UI Reveal (Phase 3) */}
            <div className={`loading-page-ui ${vm.phase === 3 ? 'loading-page-ui--visible' : ''}`}>
                {/* Title */}
                <h1 className="loading-page-title">
                    Ark.<span>Portfolio</span>
                </h1>

                {/* Profile Name (only if backend available) */}
                {vm.isBackendAvailable && vm.profileName && (
                    <h2 className="loading-page-profile-name">
                        {vm.profileName}
                    </h2>
                )}

                {/* Tagline */}
                <p className="loading-page-tagline">
                    Professional Portfolio & Project Showcase
                </p>

                {/* Status */}
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

                {/* Enter Button */}
                <button
                    onClick={vm.skipIntro}
                    className="loading-page-enter-btn"
                    disabled={vm.isLoading && vm.progress < 50}
                >
                    <span>ENTER</span>
                    <Play className="loading-page-enter-icon" size={16} />
                </button>

                {/* Error */}
                {vm.error && (
                    <div className="loading-page-error" role="alert">
                        {vm.error}
                    </div>
                )}
            </div>

            {/* Skip Button (always visible) */}
            <button
                onClick={vm.skipIntro}
                className="loading-page-skip-btn"
            >
                Skip Intro
            </button>

            {/* Footer */}
            <footer className="loading-page-footer">
                <p>© {new Date().getFullYear()} Ark.Alliance. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LoadingPage;
