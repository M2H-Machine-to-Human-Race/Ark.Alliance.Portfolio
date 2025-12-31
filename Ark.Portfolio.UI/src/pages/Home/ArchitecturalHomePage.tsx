/**
 * ArchitecturalHomePage Component
 * Full-screen architectural home page with radial navigation.
 * Provides elegant presentation for hiring managers in AI/IT domain.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React, { useEffect, useMemo, useState } from 'react';
import { FileText, Briefcase, Code, Linkedin, Github, Mail, ExternalLink, Zap, Award, Menu } from 'lucide-react';
import { ArchitecturalHomePageProps, ArchitecturalPageView } from './ArchitecturalHomePage.types';
import { ArchitecturalHomePageModel } from './ArchitecturalHomePage.model';
import { ConcentricBackground } from '../../components/generic/ConcentricBackground';
import { RadialNavigation, RadialNavItem } from '../../components/generic/RadialNavigation';
import { ArchitecturalPageLayout } from '../../components/generic/ArchitecturalPageLayout';
import { MobileMenu } from '../../components/generic/MobileMenu';
import { cn } from '../../utils/cn';
import '../../styles/architectural-theme.css';
import './ArchitecturalHomePage.styles.css';

/**
 * Architectural home page with minimalist design and radial navigation.
 */
export const ArchitecturalHomePage: React.FC<ArchitecturalHomePageProps> = ({
    initialView = 'home',
    className
}) => {
    const vm = useMemo(() => new ArchitecturalHomePageModel(), []);
    const [, forceUpdate] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        vm.onDataUpdate = () => forceUpdate(n => n + 1);
        vm.onInit();
        if (initialView !== 'home') {
            vm.setActivePage(initialView);
        }
        return () => vm.onDestroy();
    }, [vm, initialView]);

    // Navigation items configuration - Flower Bouquet Abstraction
    const navItems: RadialNavItem[] = useMemo(() => [
        // Resume: Far Left, curving upwards
        {
            id: 'cv',
            label: 'Resume',
            icon: <FileText size={22} strokeWidth={1.5} />,
            angle: -170,
            distance: 380,
            curveControlPoint: { x: -150, y: -100 }
        },
        // Projects: Top Left, curving upwards
        {
            id: 'projects',
            label: 'Projects',
            icon: <Code size={22} strokeWidth={1.5} />,
            angle: -135,
            distance: 280,
            curveControlPoint: { x: -100, y: -150 }
        },
        // Portfolio: Bottom Left, curving downwards/outwards
        {
            id: 'portfolio',
            label: 'Portfolio',
            icon: <Briefcase size={22} strokeWidth={1.5} />,
            angle: 160,
            distance: 320,
            curveControlPoint: { x: -120, y: 80 }
        },
        // Admin: Top Right, curving upwards (long branch)
        {
            id: 'admin',
            label: 'Admin',
            icon: <Zap size={22} strokeWidth={1.5} />,
            angle: -30,
            distance: 450,
            route: '/admin/dashboard',
            curveControlPoint: { x: 150, y: -200 }
        }
    ], []);

    // Title segments
    const titleSegments = useMemo(() => {
        const profile = vm.profile;
        if (profile?.title) {
            // Split title by common separators
            return profile.title.split(/[|,&]/).map(s => s.trim()).filter(Boolean);
        }
        return ['AI Principal Solutions Architect', 'Full Stack Developer', 'Business & Technical Analyst'];
    }, [vm.profile]);

    const handleNavClick = (item: RadialNavItem) => {
        if (item.route) {
            handleMobileNavigate(item.route);
            return;
        }
        vm.setActivePage(item.id as ArchitecturalPageView);
    };

    const handleMobileNavigate = (path: string) => {
        // Map paths to views
        const viewMap: Record<string, ArchitecturalPageView> = {
            '/': 'home',
            '/resume': 'cv',  // Resume path maps to cv view
            '/cv': 'cv',      // Backwards compatibility
            '/portfolio': 'portfolio',
            '/projects': 'projects',
            '/admin/dashboard': 'home' // Admin stays on home but redirects via router
        };

        if (path === '/admin/dashboard') {
            window.location.href = '/admin/dashboard';
            return;
        }
        const view = viewMap[path];
        if (view) {
            vm.setActivePage(view);
        }
    };

    if (vm.isLoading && !vm.profile) {
        return (
            <div className="arch-home__loading">
                Loading Portfolio...
            </div>
        );
    }

    const firstName = vm.profile?.firstName || 'Armand';
    const lastName = vm.profile?.lastName || 'Richelet-Kleinberg';

    return (
        <div className={cn('arch-home', className)}>
            <ConcentricBackground />

            {/* Mobile Menu Button */}
            <button
                className="arch-home__mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(true)}
            >
                <Menu size={24} />
            </button>

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                onNavigate={handleMobileNavigate}
                activeRoute={vm.activePage === 'home' ? '/' : `/${vm.activePage}`}
            />



            {/* Main Orchestrator */}
            <div className={cn(
                'arch-home__orchestrator',
                !vm.isHome && 'arch-home__orchestrator--hidden'
            )}>
                {/* Typographic Core */}
                <div className="arch-home__core">
                    {/* Name */}
                    <div className="arch-home__name-container">
                        <h1 className="arch-name">{firstName}</h1>
                        <h1 className="arch-name">{lastName}</h1>
                    </div>

                    {/* Title Segments */}
                    <div className="arch-home__titles">
                        <div className="arch-home__titles-inner">
                            {titleSegments.map((segment, i) => (
                                <React.Fragment key={i}>
                                    <span className="arch-title-segment">{segment}</span>
                                    {i < titleSegments.length - 1 && (
                                        <span className="arch-home__title-dot" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="arch-home__divider" />
                </div>

                {/* Radial Navigation - Hidden on mobile via CSS */}
                <div className="arch-home__radial-nav-container">
                    <RadialNavigation
                        items={navItems}
                        onItemClick={handleNavClick}
                        isActive={vm.isHome}
                    />
                </div>
            </div>

            {/* CV Page */}
            {vm.activePage === 'cv' && (
                <ArchitecturalPageLayout
                    title="CAREER"
                    subtitle="Architectural Path"
                    onBack={() => vm.goHome()}
                >
                    <CVContent vm={vm} />
                </ArchitecturalPageLayout>
            )}

            {/* Portfolio Page */}
            {vm.activePage === 'portfolio' && (
                <ArchitecturalPageLayout
                    title="WORKS"
                    subtitle="Digital Artifacts"
                    onBack={() => vm.goHome()}
                >
                    <PortfolioContent vm={vm} />
                </ArchitecturalPageLayout>
            )}

            {/* Projects Page */}
            {vm.activePage === 'projects' && (
                <ArchitecturalPageLayout
                    title="ENGINEERING"
                    subtitle="Technical Stacks"
                    onBack={() => vm.goHome()}
                >
                    <ProjectsContent vm={vm} />
                </ArchitecturalPageLayout>
            )}

            {/* Social Links */}
            <nav className={cn(
                'arch-social-nav',
                !vm.isHome && 'arch-social-nav--hidden'
            )}>
                {vm.profile?.linkedinUrl && (
                    <a href={vm.profile.linkedinUrl} className="arch-social-link" target="_blank" rel="noreferrer">
                        <Linkedin size={22} strokeWidth={1.2} />
                    </a>
                )}
                {vm.profile?.githubUrl && (
                    <a href={vm.profile.githubUrl} className="arch-social-link" target="_blank" rel="noreferrer">
                        <Github size={22} strokeWidth={1.2} />
                    </a>
                )}
                {vm.profile?.email && (
                    <a href={`mailto:${vm.profile.email}`} className="arch-social-link">
                        <Mail size={22} strokeWidth={1.2} />
                    </a>
                )}
            </nav>

            {/* Central Visual Anchor */}
            {vm.isHome && <div className="arch-center-dot" />}
        </div>
    );
};

/**
 * CV Content Component
 */
const CVContent: React.FC<{ vm: ArchitecturalHomePageModel }> = ({ vm }) => {
    const skills = vm.cv?.skills || [];
    const experiences = vm.cv?.experiences || [];
    const education = vm.cv?.education || [];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
            {/* Intro */}
            <section>
                <p style={{
                    fontSize: '1.5rem',
                    fontWeight: 300,
                    lineHeight: 1.4,
                    color: '#374151',
                    maxWidth: '56rem',
                    letterSpacing: '-0.01em'
                }}>
                    Mastering the intersection of <span style={{ fontWeight: 700 }}>Artificial Intelligence</span>,{' '}
                    <span style={{ fontWeight: 700, fontStyle: 'italic', color: '#9ca3af' }}>Product Design</span>,{' '}
                    and <span style={{ fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '8px', textDecorationColor: '#e5e7eb' }}>Robust Technical Architecture</span>.
                </p>
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '4rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                    {/* Experience */}
                    <section>
                        <h3 className="arch-section-title">Professional Trajectory</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                            {experiences.slice(0, 3).map((exp, idx) => (
                                <div key={idx} className="group">
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'baseline',
                                        borderBottom: '1px solid #f9fafb',
                                        paddingBottom: '1rem'
                                    }}>
                                        <h4 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em' }}>
                                            {exp.position}
                                        </h4>
                                        <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#d1d5db' }}>
                                            {new Date(exp.startDate).getFullYear()} — {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af', fontWeight: 700, marginTop: '0.5rem' }}>
                                        {exp.company}
                                    </p>
                                    <p style={{ color: '#6b7280', marginTop: '1rem', lineHeight: 1.6, fontWeight: 300 }}>
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <aside style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    {/* Skills */}
                    <section>
                        <h3 className="arch-section-title">Core Engine</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {skills.slice(0, 10).map((skill, idx) => (
                                <span key={idx} className="arch-skill-badge">
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Education */}
                    {education.length > 0 && (
                        <section style={{ backgroundColor: '#f9fafb', padding: '2rem', borderRadius: '2px' }}>
                            <h3 className="arch-section-title" style={{ marginBottom: '1.5rem' }}>Education</h3>
                            <p style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
                                {education[0].degree} {education[0].fieldOfStudy}
                            </p>
                            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                {education[0].institution}
                            </p>
                        </section>
                    )}
                </aside>
            </div>
        </div>
    );
};

/**
 * Portfolio Content Component
 */
const PortfolioContent: React.FC<{ vm: ArchitecturalHomePageModel }> = ({ vm }) => {
    const projects = vm.projects || [];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '5rem' }}>
            {projects.map((project, i) => (
                <div key={i} className="arch-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <span style={{ width: '1.5rem', height: '1px', backgroundColor: '#e5e7eb' }} />
                        <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.4em', color: '#d1d5db', fontWeight: 700 }}>
                            {project.status || 'Project'}
                        </span>
                    </div>
                    <h3 className="arch-card__title">{project.title}</h3>
                    <p style={{ color: '#6b7280', fontWeight: 300, lineHeight: 1.6, fontSize: '1.125rem', marginBottom: '2rem', maxWidth: '28rem' }}>
                        {project.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '9px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#d1d5db' }}>
                            {project.technologies?.slice(0, 2).join(' + ') || 'TypeScript'}
                        </span>
                        <button style={{
                            fontSize: '10px',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                        }}>
                            Detail <ExternalLink size={12} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

/**
 * Projects/Engineering Content Component
 */
const ProjectsContent: React.FC<{ vm: ArchitecturalHomePageModel }> = ({ vm }) => {
    const projects = vm.projects || [];
    const icons = [<Zap size={18} />, <Award size={18} />, <Code size={18} />];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {projects.slice(0, 3).map((project, i) => (
                <div key={i} className="arch-project-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                        <div style={{ color: '#e5e7eb', transition: 'color 0.3s ease' }}>
                            {icons[i % icons.length]}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.025em' }}>
                                {project.title}
                            </h3>
                            <p style={{ color: '#9ca3af', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 700, marginTop: '0.5rem' }}>
                                {project.status || 'In Development'}
                            </p>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, color: '#6b7280' }}>
                            {project.description?.slice(0, 50)}...
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ArchitecturalHomePage;

