/**
 * @fileoverview ResumePageV2 View Component
 * Polished resume page with tab-based navigation, timeline, skills visualization,
 * languages, hobbies, business domains and admin controls.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import {
    Briefcase,
    GraduationCap,
    Server,
    Monitor,
    Cloud,
    Database,
    Cpu,
    Wrench,
    AlertCircle,
    RefreshCw,
    Languages,
    Heart,
    Landmark,
    Star,
    Code,
    TrendingUp,
    Truck,
    ShoppingCart,
    Building2,
    Wallet,
    Stethoscope,
    Plane,
    Factory,
    Shield,
    Zap,
    Music,
    Box,
    Gamepad2,
    Camera,
    Brain,
    Layers,
    GitBranch
} from 'lucide-react';
import { HeaderV2 } from '../../components/HeaderV2';
import { TimelineV2 } from '../../components/TimelineV2';
import { TabControl, TabItem } from '../../components/generic/TabControl';
import { useResumePageV2Model, SkillCategory, ResumeTabType } from './ResumePageV2.model';
import { PROFICIENCY_LEVEL_LABELS } from '@ark/portfolio-share';
import LogoArkAlliance from '../../Assets/LogoArkAlliance.png';
import '../../styles/design-system.css';
import './ResumePageV2.styles.css';

/**
 * Get icon component by name (Lucide icon name)
 * Used for skill categories, hobbies, and other dynamic icon rendering
 */
const getIconByName = (iconName: string, size: number = 20) => {
    switch (iconName) {
        // Skill category icons
        case 'Server': return <Server size={size} />;
        case 'Monitor': return <Monitor size={size} />;
        case 'Cloud': return <Cloud size={size} />;
        case 'Database': return <Database size={size} />;
        case 'Cpu': return <Cpu size={size} />;
        case 'Code': return <Code size={size} />;
        case 'Layers': return <Layers size={size} />;
        case 'GitBranch': return <GitBranch size={size} />;
        // Hobby icons
        case 'Music': return <Music size={size} />;
        case 'Box': return <Box size={size} />;
        case 'Gamepad2': return <Gamepad2 size={size} />;
        case 'Camera': return <Camera size={size} />;
        case 'Brain': return <Brain size={size} />;
        case 'Heart': return <Heart size={size} />;
        // Default
        default: return <Wrench size={size} />;
    }
};

/**
 * Skill Category Card Component
 */
const SkillCategoryCard: React.FC<{ category: SkillCategory; delay: number }> = ({ category, delay }) => (
    <div className={`resume-skill-category resume-animate-in delay-${delay}`}>
        <header className="resume-skill-category-header">
            <div
                className="resume-skill-category-icon"
                style={{ background: category.gradient }}
            >
                {getIconByName(category.icon)}
            </div>
            <h3 className="resume-skill-category-name">{category.name}</h3>
            <span className="resume-skill-category-count">
                {category.skills.length}
            </span>
        </header>
        <div className="resume-skill-list">
            {category.skills.map(skill => (
                <div
                    key={skill.id}
                    className="resume-skill-item"
                    title={skill.proficiency ? `Proficiency: ${skill.proficiency}%` : undefined}
                >
                    {skill.name}
                    {skill.proficiency && (
                        <div
                            className="resume-skill-proficiency"
                            style={{ width: `${skill.proficiency}%` }}
                        />
                    )}
                </div>
            ))}
        </div>
    </div>
);

/**
 * Star Rating Display Component
 */
const StarRating: React.FC<{ value: number; label?: string }> = ({ value, label }) => (
    <div className="resume-star-rating">
        {[1, 2, 3, 4, 5].map(n => (
            <Star
                key={n}
                size={14}
                className={n <= value ? 'star-filled' : 'star-empty'}
                fill={n <= value ? 'currentColor' : 'none'}
            />
        ))}
        {label && <span className="star-label">{label}</span>}
    </div>
);

/**
 * ResumePageV2 Component
 * 
 * Tab-based resume page with:
 * - Header with navigation
 * - Profile summary
 * - Tab navigation for sections
 * - Experience timeline with TimelineV2
 * - Education timeline with TimelineV2
 * - Skills visualization by category
 * - Languages section with proficiency ratings
 * - Business domains section
 * - Hobbies section
 * - Admin edit controls
 * - Responsive layout
 */
export const ResumePageV2: React.FC = () => {
    const vm = useResumePageV2Model();

    // Define tabs based on available data
    const resumeTabs: TabItem[] = [
        ...(vm.experienceItems.length > 0 ? [{ id: 'experience', label: 'Experience', iconElement: <Briefcase size={18} /> }] : []),
        ...(vm.educationItems.length > 0 ? [{ id: 'education', label: 'Education', iconElement: <GraduationCap size={18} /> }] : []),
        ...(vm.skillCategories.length > 0 ? [{ id: 'skills', label: 'Skills', iconElement: <Code size={18} /> }] : []),
        ...(vm.languages.length > 0 ? [{ id: 'languages', label: 'Languages', iconElement: <Languages size={18} /> }] : []),
        ...(vm.businessDomains.length > 0 ? [{ id: 'domains', label: 'Domains', iconElement: <Landmark size={18} /> }] : []),
        ...(vm.hobbies.length > 0 ? [{ id: 'hobbies', label: 'Hobbies', iconElement: <Heart size={18} /> }] : []),
    ];

    // Loading state
    if (vm.isLoading) {
        return (
            <div className="resume-page">
                <HeaderV2 />
                <div className="resume-loading">
                    <div className="resume-loading-spinner" />
                    <p className="resume-loading-text">Loading resume...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (vm.error) {
        return (
            <div className="resume-page">
                <HeaderV2 />
                <div className="resume-error">
                    <AlertCircle size={64} className="resume-error-icon" />
                    <h2 className="resume-error-title">Unable to Load Resume</h2>
                    <p className="resume-error-text">{vm.error}</p>
                    <button className="btn btn-primary" onClick={vm.refetch}>
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="resume-page">
            {/* Header */}
            <HeaderV2 />

            <div className="resume-container">
                {/* Page Header */}
                <header className="resume-header resume-animate-in">
                    <h1 className="resume-title">
                        My <span>Resume</span>
                    </h1>

                    {/* Profile Name & Title */}
                    <div className="resume-profile-header">
                        <h2 className="resume-profile-name">{vm.profileName}</h2>
                        <p className="resume-profile-job-title">{vm.profileTitle}</p>
                    </div>

                    <p className="resume-subtitle">
                        Professional journey, technical expertise, and educational background
                    </p>

                    {vm.profileSummary && (
                        <div
                            className="resume-summary"
                            style={{ '--logo-watermark-url': `url(${LogoArkAlliance})` } as React.CSSProperties}
                        >
                            {vm.profileSummary}
                        </div>
                    )}
                </header>

                {/* Tab Navigation */}
                <div className="resume-tabs-container resume-animate-in delay-1">
                    <TabControl
                        tabs={resumeTabs}
                        activeTab={vm.activeTab}
                        onTabChange={(id) => vm.setActiveTab(id as ResumeTabType)}
                        variant="default"
                        ariaLabel="Resume sections"
                    />
                </div>

                {/* Tab Content */}
                <div className="resume-tab-content resume-animate-in delay-2">
                    {/* Experience Tab */}
                    {vm.activeTab === 'experience' && (
                        <section aria-labelledby="experience-title">
                            <TimelineV2
                                items={vm.experienceItems}
                                initialCategory="all"
                                showAdmin={vm.isAdmin}
                                onEdit={vm.handleEditTimeline}
                            />
                        </section>
                    )}

                    {/* Education Tab */}
                    {vm.activeTab === 'education' && (
                        <section aria-labelledby="education-title">
                            <TimelineV2
                                items={vm.educationItems}
                                initialCategory="all"
                                showAdmin={vm.isAdmin}
                                onEdit={vm.handleEditTimeline}
                            />
                        </section>
                    )}

                    {/* Skills Tab */}
                    {vm.activeTab === 'skills' && (
                        <section aria-label="Skills">
                            <div className="resume-skills-grid">
                                {vm.skillCategories.map((category, index) => (
                                    <SkillCategoryCard
                                        key={category.id}
                                        category={category}
                                        delay={Math.min(index + 1, 3)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Languages Tab */}
                    {vm.activeTab === 'languages' && (
                        <section aria-label="Languages">
                            <div className="resume-languages-grid">
                                {vm.languages.map(lang => (
                                    <div key={lang.id} className="resume-language-card">
                                        <h4 className="language-name">{lang.language}</h4>
                                        <div className="language-skills">
                                            <div className="language-skill">
                                                <span className="skill-label">Speaking</span>
                                                <StarRating value={lang.speaking} label={PROFICIENCY_LEVEL_LABELS[lang.speaking]} />
                                            </div>
                                            <div className="language-skill">
                                                <span className="skill-label">Writing</span>
                                                <StarRating value={lang.writing} label={PROFICIENCY_LEVEL_LABELS[lang.writing]} />
                                            </div>
                                            <div className="language-skill">
                                                <span className="skill-label">Presenting</span>
                                                <StarRating value={lang.presenting} label={PROFICIENCY_LEVEL_LABELS[lang.presenting]} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Domains Tab */}
                    {vm.activeTab === 'domains' && (
                        <section aria-label="Business Domains">
                            <div className="resume-domains-list">
                                {vm.businessDomains.map(domain => {
                                    // Map domain names to appropriate icons
                                    const getDomainIcon = (name: string) => {
                                        const lower = name.toLowerCase();
                                        if (lower.includes('fintech') || lower.includes('finance') || lower.includes('banking')) return <Wallet size={24} />;
                                        if (lower.includes('trading') || lower.includes('crypto')) return <TrendingUp size={24} />;
                                        if (lower.includes('logistics') || lower.includes('supply')) return <Truck size={24} />;
                                        if (lower.includes('retail') || lower.includes('ecommerce') || lower.includes('commerce')) return <ShoppingCart size={24} />;
                                        if (lower.includes('healthcare') || lower.includes('medical')) return <Stethoscope size={24} />;
                                        if (lower.includes('travel') || lower.includes('airline')) return <Plane size={24} />;
                                        if (lower.includes('manufacturing') || lower.includes('industrial')) return <Factory size={24} />;
                                        if (lower.includes('security') || lower.includes('cyber')) return <Shield size={24} />;
                                        if (lower.includes('energy') || lower.includes('power')) return <Zap size={24} />;
                                        if (lower.includes('tech') || lower.includes('software') || lower.includes('ai')) return <Cpu size={24} />;
                                        return <Building2 size={24} />;
                                    };
                                    return (
                                        <div key={domain.id} className="resume-domain-card">
                                            <div className="domain-header">
                                                <div className="domain-icon">
                                                    {getDomainIcon(domain.domain)}
                                                </div>
                                                <div className="domain-info">
                                                    <h4 className="domain-name">{domain.domain}</h4>
                                                    {domain.yearsOfExperience && (
                                                        <span className="domain-years">{domain.yearsOfExperience} years experience</span>
                                                    )}
                                                </div>
                                                <span className="domain-level">{domain.level}</span>
                                            </div>
                                            {domain.description && (
                                                <p className="domain-description">{domain.description}</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Hobbies Tab */}
                    {vm.activeTab === 'hobbies' && (
                        <section aria-label="Hobbies">
                            <div className="resume-hobbies-grid">
                                {vm.hobbies.map(hobby => (
                                    <div key={hobby.id} className="resume-hobby-card">
                                        {hobby.icon && (
                                            <span className="hobby-icon">
                                                {getIconByName(hobby.icon, 24)}
                                            </span>
                                        )}
                                        <h4 className="hobby-name">{hobby.name}</h4>
                                        {hobby.description && (
                                            <p className="hobby-description">{hobby.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumePageV2;

