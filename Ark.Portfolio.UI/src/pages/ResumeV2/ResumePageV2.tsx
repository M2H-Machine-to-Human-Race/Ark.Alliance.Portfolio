/**
 * @fileoverview ResumePageV2 View Component
 * Polished resume page with timeline, skills visualization, and admin controls.
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
    RefreshCw
} from 'lucide-react';
import { HeaderV2 } from '../../components/HeaderV2';
import { TimelineV2 } from '../../components/TimelineV2';
import { useResumePageV2Model, SkillCategory } from './ResumePageV2.model';
import '../../styles/design-system.css';
import './ResumePageV2.styles.css';

/**
 * Get icon component for skill category
 */
const getCategoryIcon = (iconName: string, size: number = 20) => {
    switch (iconName) {
        case 'Server': return <Server size={size} />;
        case 'Monitor': return <Monitor size={size} />;
        case 'Cloud': return <Cloud size={size} />;
        case 'Database': return <Database size={size} />;
        case 'Cpu': return <Cpu size={size} />;
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
                {getCategoryIcon(category.icon)}
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
 * ResumePageV2 Component
 * 
 * Polished resume page with:
 * - Header with navigation
 * - Profile summary
 * - Experience timeline with TimelineV2
 * - Education timeline with TimelineV2
 * - Skills visualization by category
 * - Admin edit controls
 * - Responsive layout
 */
export const ResumePageV2: React.FC = () => {
    const vm = useResumePageV2Model();

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
                    <p className="resume-subtitle">
                        Professional journey, technical expertise, and educational background
                    </p>

                    {vm.profileSummary && (
                        <div className="resume-summary">
                            {vm.profileSummary}
                        </div>
                    )}
                </header>

                {/* Main Content */}
                <div className="resume-content">
                    {/* Left Column: Timelines */}
                    <div className="resume-timeline-section">
                        {/* Experience Section */}
                        <section
                            className="resume-animate-in delay-1"
                            aria-labelledby="experience-title"
                        >
                            <header className="resume-section-header">
                                <div
                                    className="resume-section-icon"
                                    style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}
                                >
                                    <Briefcase size={24} />
                                </div>
                                <h2 id="experience-title" className="resume-section-title">
                                    Experience
                                </h2>
                            </header>

                            {vm.experienceItems.length > 0 ? (
                                <TimelineV2
                                    items={vm.experienceItems}
                                    initialCategory="all"
                                    showAdmin={vm.isAdmin}
                                    onEdit={vm.handleEditTimeline}
                                />
                            ) : (
                                <p style={{ color: 'var(--text-secondary)', padding: 'var(--space-4)' }}>
                                    No experience entries yet.
                                </p>
                            )}
                        </section>

                        {/* Education Section */}
                        <section
                            className="resume-animate-in delay-2"
                            aria-labelledby="education-title"
                            style={{ marginTop: 'var(--space-12)' }}
                        >
                            <header className="resume-section-header">
                                <div
                                    className="resume-section-icon"
                                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' }}
                                >
                                    <GraduationCap size={24} />
                                </div>
                                <h2 id="education-title" className="resume-section-title">
                                    Education
                                </h2>
                            </header>

                            {vm.educationItems.length > 0 ? (
                                <TimelineV2
                                    items={vm.educationItems}
                                    initialCategory="all"
                                    showAdmin={vm.isAdmin}
                                    onEdit={vm.handleEditTimeline}
                                />
                            ) : (
                                <p style={{ color: 'var(--text-secondary)', padding: 'var(--space-4)' }}>
                                    No education entries yet.
                                </p>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Skills */}
                    <aside className="resume-skills-section" aria-label="Skills">
                        <header className="resume-section-header resume-animate-in delay-1">
                            <div
                                className="resume-section-icon"
                                style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' }}
                            >
                                <Cpu size={24} />
                            </div>
                            <h2 className="resume-section-title">Skills</h2>
                        </header>

                        <div className="resume-skills-grid">
                            {vm.skillCategories.length > 0 ? (
                                vm.skillCategories.map((category, index) => (
                                    <SkillCategoryCard
                                        key={category.id}
                                        category={category}
                                        delay={Math.min(index + 2, 3)}
                                    />
                                ))
                            ) : (
                                <p style={{ color: 'var(--text-secondary)', padding: 'var(--space-4)' }}>
                                    No skills listed yet.
                                </p>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default ResumePageV2;
