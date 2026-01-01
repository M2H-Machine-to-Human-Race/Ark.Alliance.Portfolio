/**
 * @fileoverview ProjectPresentation View Component
 * Main project detail page with sidebar, header, and content rendering.
 * 
 * Responsibilities:
 * - Render project hero section
 * - Display sidebar navigation
 * - Render markdown/mermaid content
 * - Handle admin actions
 * 
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import { ArrowLeft, Edit, ExternalLink, Github } from 'lucide-react';
import { HeaderV2 } from '../../../components/HeaderV2/HeaderV2';
import { ProjectSidebar } from '../../../components/ProjectSidebar';
import { MarkdownRenderer } from '../../../components/MarkdownRenderer/MarkdownRenderer';
import { MermaidDiagramReader } from '../../../components/generic/MermaidDiagramReader/MermaidDiagramReader';
import { TechBadge } from '../../../components/TechBadge/TechBadge';
import { useProjectPresentationModel } from './ProjectPresentation.model';
import { ProjectPresentationProps } from './ProjectPresentation.types';
import './ProjectPresentation.styles.css';

/**
 * ProjectPresentation Component
 * 
 * Full-featured project detail page featuring:
 * - Consistent HeaderV2 navigation
 * - Retractable sidebar for section navigation
 * - Professional markdown rendering
 * - Mermaid diagram support
 * - Technology badges
 * - Admin edit capabilities
 */
export const ProjectPresentation: React.FC<ProjectPresentationProps> = ({
    className = '',
}) => {
    const vm = useProjectPresentationModel();

    // Loading state
    if (vm.isLoading) {
        return (
            <div className="project-presentation">
                <HeaderV2 />
                <div className="project-presentation__loading">
                    <div className="project-presentation__spinner" />
                    <p>Loading project...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (vm.error || !vm.project) {
        return (
            <div className="project-presentation">
                <HeaderV2 />
                <div className="project-presentation__error">
                    <h2>Project Not Found</h2>
                    <p>{vm.error || 'Unable to load project details.'}</p>
                    <button onClick={vm.navigateBack} className="btn btn--primary">
                        <ArrowLeft size={18} />
                        Back to Projects
                    </button>
                </div>
            </div>
        );
    }

    const { project, currentContent } = vm;

    return (
        <div className={`project-presentation ${className}`}>
            {/* Header */}
            <HeaderV2 />

            {/* Sidebar */}
            <ProjectSidebar
                activeSection={vm.activeSection}
                sections={vm.sections}
                onSectionChange={vm.setActiveSection}
                githubUrl={project.repoUrl}
                liveUrl={project.demoUrl}
            />

            {/* Main Content */}
            <main className="project-presentation__main">
                {/* Hero Section */}
                <section className="project-presentation__hero">
                    <div
                        className="project-presentation__hero-bg"
                        style={{ backgroundImage: `url(${project.imageUrl})` }}
                    />
                    <div className="project-presentation__hero-overlay" />
                    <div className="project-presentation__hero-content">
                        <button
                            className="project-presentation__back-link"
                            onClick={vm.navigateBack}
                        >
                            <ArrowLeft size={18} />
                            Back to Projects
                        </button>

                        <h1 className="project-presentation__title">{project.title}</h1>

                        <p className="project-presentation__summary">
                            {project.description}
                        </p>

                        {/* Technology badges */}
                        <div className="project-presentation__technologies">
                            {project.technologies?.map((tech: any, idx: number) => {
                                const name = typeof tech === 'string' ? tech : tech.name;
                                return (
                                    <TechBadge
                                        key={name || idx}
                                        name={name}
                                        size="sm"
                                    />
                                );
                            })}
                        </div>

                        {/* Action buttons */}
                        <div className="project-presentation__actions">
                            {project.repoUrl && (
                                <a
                                    href={project.repoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn--secondary"
                                >
                                    <Github size={18} />
                                    View Source
                                </a>
                            )}
                            {project.demoUrl && (
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn--primary"
                                >
                                    <ExternalLink size={18} />
                                    Live Demo
                                </a>
                            )}
                            {vm.isAdmin && (
                                <button
                                    onClick={vm.handleEdit}
                                    className="btn btn--ghost"
                                >
                                    <Edit size={18} />
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="project-presentation__content">
                    <div className="project-presentation__content-container">
                        {currentContent && (
                            <>
                                <h2 className="project-presentation__section-title">
                                    {currentContent.title}
                                </h2>

                                {/* Markdown content */}
                                {currentContent.content && (
                                    <MarkdownRenderer
                                        content={currentContent.content}
                                        className="project-presentation__markdown"
                                    />
                                )}

                                {/* Mermaid diagrams */}
                                {currentContent.diagrams && currentContent.diagrams.length > 0 && (
                                    <div className="project-presentation__diagrams">
                                        {currentContent.diagrams.map((diagram, idx) => (
                                            <MermaidDiagramReader
                                                key={idx}
                                                diagramSource={diagram}
                                                theme="dark"
                                                enableZoom={true}
                                                enableExport={true}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Gallery images */}
                                {currentContent.images && currentContent.images.length > 0 && (
                                    <div className="project-presentation__gallery">
                                        {currentContent.images.map((image, idx) => (
                                            <img
                                                key={idx}
                                                src={image}
                                                alt={`${currentContent.title} - Image ${idx + 1}`}
                                                loading="lazy"
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {!currentContent && (
                            <div className="project-presentation__no-content">
                                <p>No content available for this section.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProjectPresentation;
