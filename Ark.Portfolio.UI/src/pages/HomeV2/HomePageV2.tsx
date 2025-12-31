/**
 * @fileoverview HomePageV2 View Component
 * Polished homepage with hero carousel, quick nav, and CTAs.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Briefcase, Layers, ArrowRight, Mail } from 'lucide-react';
import { HeaderV2 } from '../../components/HeaderV2';
import { CarouselV2 } from '../../components/CarouselV2';
import { useHomePageV2Model, QuickNavCard } from './HomePageV2.model';
import '../../styles/design-system.css';
import './HomePageV2.styles.css';

/**
 * Icon mapping for quick nav cards
 */
const getCardIcon = (iconName: string) => {
    switch (iconName) {
        case 'FileText': return <FileText size={28} />;
        case 'Briefcase': return <Briefcase size={28} />;
        case 'Layers': return <Layers size={28} />;
        default: return <Layers size={28} />;
    }
};

/**
 * Quick Nav Card Component
 */
const QuickNavCardComponent: React.FC<{ card: QuickNavCard; delay: number }> = ({ card, delay }) => (
    <Link
        to={card.path}
        className={`home-quicknav-card home-animate-in delay-${delay}`}
        style={{ '--card-gradient': card.gradient } as React.CSSProperties}
    >
        <div
            className="home-quicknav-icon"
            style={{ background: card.gradient }}
        >
            {getCardIcon(card.icon)}
        </div>
        <h3 className="home-quicknav-card-title">{card.title}</h3>
        <p className="home-quicknav-card-desc">{card.description}</p>
        <div className="home-quicknav-card-arrow">
            Explore <ArrowRight size={16} />
        </div>
        <div
            className="home-quicknav-card-gradient-bar"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: card.gradient
            }}
        />
    </Link>
);

/**
 * HomePageV2 Component
 * 
 * Polished homepage with:
 * - Sticky header with navigation
 * - Hero carousel with backend data
 * - Quick navigation cards
 * - Call-to-action section
 * - Footer
 */
export const HomePageV2: React.FC = () => {
    const vm = useHomePageV2Model();

    return (
        <div className="home-page">
            {/* Header */}
            <HeaderV2 />

            {/* Hero Carousel */}
            <section className="home-hero" aria-label="Featured content">
                <CarouselV2
                    slides={vm.carouselSlides}
                    autoplayInterval={6000}
                    showNav={true}
                    showDots={true}
                    showPlayback={true}
                    showProgress={true}
                    isLoading={vm.isLoading}
                />
            </section>

            {/* Quick Navigation */}
            <section className="home-quicknav" aria-labelledby="quicknav-title">
                <div className="home-quicknav-inner">
                    <header className="home-quicknav-header">
                        <h2 id="quicknav-title" className="home-quicknav-title">
                            Explore My Work
                        </h2>
                        <p className="home-quicknav-subtitle">
                            Discover my professional experience, projects, and technical expertise
                        </p>
                    </header>

                    <div className="home-quicknav-grid">
                        {vm.quickNavCards.map((card, index) => (
                            <QuickNavCardComponent
                                key={card.id}
                                card={card}
                                delay={index + 1}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="home-cta" aria-labelledby="cta-title">
                <div className="home-cta-inner">
                    <h2 id="cta-title" className="home-cta-title">
                        Ready to Connect?
                    </h2>
                    <p className="home-cta-text">
                        Whether you have a project in mind or just want to chat about technology,
                        I'd love to hear from you.
                    </p>
                    <div className="home-cta-buttons">
                        <Link to="/resume" className="btn btn-primary btn-lg">
                            <FileText size={18} />
                            View Resume
                        </Link>
                        <a
                            href="mailto:contact@example.com"
                            className="btn btn-secondary btn-lg"
                        >
                            <Mail size={18} />
                            Get in Touch
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <p className="home-footer-text">
                    © {new Date().getFullYear()} Ark.Portfolio. Built with React, TypeScript, and ❤️
                </p>
            </footer>
        </div>
    );
};

export default HomePageV2;
