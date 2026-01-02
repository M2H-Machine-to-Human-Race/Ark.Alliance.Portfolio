/**
 * @fileoverview ProjectsPageV2 View Component
 * Polished projects page with HeaderV2 navigation and clickable project cards.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { HeaderV2 } from '../../components/HeaderV2';
import { GlassCard } from '../../components/generic/GlassCard';
import { TechBadge } from '../../components/TechBadge/TechBadge';
import { useProjectsPageV2Model } from './ProjectsPageV2.model';
import './ProjectsPageV2.styles.css';

/**
 * ProjectsPageV2 Component
 * 
 * Polished projects page with:
 * - Sticky header with navigation (HeaderV2)
 * - Page title in content area (not header)
 * - Clickable project cards linking to detail pages
 * - Grid layout for projects
 */
export const ProjectsPageV2: React.FC = () => {
    const vm = useProjectsPageV2Model();

    return (
        <div className="projects-page">
            {/* Header with Navigation */}
            <HeaderV2 />

            {/* Page Content */}
            <main className="projects-content">
                {/* Page Header */}
                <header className="projects-header">
                    <h1 className="projects-title">Projects</h1>
                    <p className="projects-subtitle">Selected High-Impact Work</p>
                </header>

                {/* Projects Grid */}
                {vm.isLoading ? (
                    <div className="projects-loading">
                        <div className="projects-loading-spinner" />
                        <p>Loading projects...</p>
                    </div>
                ) : vm.error ? (
                    <div className="projects-error">
                        <h2 className="projects-error-title">Unable to Load Projects</h2>
                        <p className="projects-error-message">{vm.error}</p>
                    </div>
                ) : (
                    <div className="projects-grid">
                        {vm.projects.map((project) => (
                            <div
                                key={project.id}
                                className="project-card-link relative group"
                            >
                                <GlassCard className="project-card h-full">
                                    {/* Main Overlay Link */}
                                    <Link
                                        to={`/projects/${project.id}`}
                                        className="absolute inset-0 z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl"
                                        aria-label={`View ${project.title}`}
                                    >
                                        <span className="sr-only">View Details</span>
                                    </Link>

                                    {/* Image */}
                                    <div className="project-card-image-container">
                                        {project.imageUrl ? (
                                            <img
                                                src={project.imageUrl}
                                                alt={project.title}
                                                className="project-card-image"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="project-card-placeholder">
                                                <span>NO IMAGE</span>
                                            </div>
                                        )}
                                        <div className="project-card-overlay" />
                                    </div>

                                    {/* Content */}
                                    <div className="project-card-content">
                                        <div className="project-card-header">
                                            <div>
                                                <h3 className="project-card-title">
                                                    {project.title}
                                                    <ExternalLink size={16} className="project-card-link-icon" />
                                                </h3>
                                                <span className="project-card-status">{project.status}</span>
                                            </div>
                                            <div className="project-card-actions relative z-20">
                                                {project.repoUrl && (
                                                    <a
                                                        href={project.repoUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="action-btn"
                                                        title="View Repository"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Github size={20} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <p className="project-card-description">{project.description}</p>

                                        <div className="project-card-footer">
                                            <p className="tech-label">TECHNOLOGIES</p>
                                            <div className="tech-list">
                                                {project.technologies.slice(0, 5).map((t, idx) => {
                                                    const techKey = typeof t === 'string' ? t : t.name;
                                                    return <TechBadge key={techKey || idx} techKey={techKey} size="sm" showIcon />;
                                                })}
                                                {project.technologies.length > 5 && (
                                                    <span className="tech-more">+{project.technologies.length - 5}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* View Details CTA */}
                                        <div className="project-card-cta">
                                            <span className="project-card-cta-text">
                                                View Details
                                                <ArrowRight size={16} />
                                            </span>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="projects-footer">
                <p>© {new Date().getFullYear()} Ark.Portfolio. Built with React, TypeScript, and ❤️</p>
            </footer>
        </div>
    );
};

export default ProjectsPageV2;
