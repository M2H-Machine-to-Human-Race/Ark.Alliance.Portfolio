/**
 * @fileoverview ProjectDetailModal View Component
 * Full project details with gallery, description, and admin controls.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React, { useRef, useEffect } from 'react';
import {
    X,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Github,
    Edit2,
    Layers
} from 'lucide-react';
import { useProjectDetailModalModel } from './ProjectDetailModal.model';
import { ProjectCardData } from '../ProjectGrid/ProjectGrid.model';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { MarkdownRenderer } from '../MarkdownRenderer/MarkdownRenderer';
import './ProjectDetailModal.styles.css';

/**
 * ProjectDetailModal Props
 */
export interface ProjectDetailModalProps {
    /** Project to display */
    project: ProjectCardData | null;
    /** Is modal open */
    isOpen: boolean;
    /** Close callback */
    onClose: () => void;
    /** Edit callback (admin) */
    onEdit?: (project: ProjectCardData) => void;
    /** Show admin controls */
    showAdmin?: boolean;
}

/**
 * ProjectDetailModal Component
 * 
 * Features:
 * - Full project details display
 * - Image gallery with navigation
 * - Lightbox for zoomed view
 * - Focus trap for accessibility
 * - Escape key to close
 * - Admin edit controls
 */
export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
    project,
    isOpen,
    onClose,
    onEdit,
    showAdmin = false,
}) => {
    const vm = useProjectDetailModalModel({
        project,
        isOpen,
        onClose,
        onEdit,
        showAdmin,
    });

    // Focus trap with proper options object
    const modalRef = useFocusTrap({
        isActive: isOpen,
        onEscape: onClose
    });

    // Focus first focusable element when modal opens
    useEffect(() => {
        if (isOpen && modalRef.current) {
            const focusable = modalRef.current.querySelector<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            focusable?.focus();
        }
    }, [isOpen]);

    if (!project) return null;

    return (
        <>
            {/* Modal Overlay */}
            <div
                className={`project-modal-overlay ${isOpen ? 'open' : ''}`}
                onClick={vm.close}
                aria-hidden={!isOpen}
            >
                {/* Modal Container */}
                <div
                    ref={modalRef}
                    className="project-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="project-modal-title"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={vm.handleKeyDown}
                >
                    {/* Header */}
                    <header className="project-modal-header">
                        <h2 id="project-modal-title" className="project-modal-title">
                            {project.title}
                        </h2>
                        <button
                            className="project-modal-close"
                            onClick={vm.close}
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>
                    </header>

                    {/* Content */}
                    <div className="project-modal-content">
                        {/* Gallery */}
                        <div className="project-modal-gallery">
                            {vm.galleryImages.length > 0 ? (
                                <>
                                    <img
                                        src={vm.galleryImages[vm.galleryIndex]}
                                        alt={`${project.title} screenshot ${vm.galleryIndex + 1}`}
                                        className="project-modal-gallery-image"
                                        onClick={() => vm.openLightbox(vm.galleryIndex)}
                                    />

                                    {/* Gallery Navigation */}
                                    {vm.galleryImages.length > 1 && (
                                        <>
                                            <button
                                                className="project-modal-gallery-nav prev"
                                                onClick={vm.prevImage}
                                                aria-label="Previous image"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <button
                                                className="project-modal-gallery-nav next"
                                                onClick={vm.nextImage}
                                                aria-label="Next image"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </>
                                    )}

                                    {/* Thumbnails */}
                                    {vm.galleryImages.length > 1 && (
                                        <div className="project-modal-thumbnails">
                                            {vm.galleryImages.map((img, index) => (
                                                <button
                                                    key={index}
                                                    className={`project-modal-thumbnail ${index === vm.galleryIndex ? 'active' : ''}`}
                                                    onClick={() => vm.goToImage(index)}
                                                    aria-label={`View image ${index + 1}`}
                                                >
                                                    <img src={img} alt="" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="project-modal-gallery-placeholder">
                                    <Layers size={64} />
                                </div>
                            )}
                        </div>

                        {/* Status Badge */}
                        <span
                            className="project-modal-status"
                            data-status={project.status}
                        >
                            {project.status.replace('_', ' ')}
                        </span>

                        {/* Description - Rendered as Markdown */}
                        <div className="project-modal-description">
                            <MarkdownRenderer
                                content={project.description || project.summary}
                                className="project-modal-markdown"
                            />
                        </div>

                        {/* Technologies */}
                        {project.technologies.length > 0 && (
                            <div className="project-modal-tech-section">
                                <h3 className="project-modal-section-title">Technologies</h3>
                                <div className="project-modal-tech-list">
                                    {project.technologies.map(tech => (
                                        <span key={tech} className="project-modal-tech-tag">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Links */}
                        {(project.liveUrl || project.githubUrl) && (
                            <div className="project-modal-links">
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="project-modal-link"
                                    >
                                        <ExternalLink size={16} />
                                        View Live
                                    </a>
                                )}
                                {project.githubUrl && (
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="project-modal-link"
                                    >
                                        <Github size={16} />
                                        View Source
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer (Admin) */}
                    {showAdmin && (
                        <footer className="project-modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={vm.close}
                            >
                                Close
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={vm.handleEdit}
                            >
                                <Edit2 size={16} />
                                Edit Project
                            </button>
                        </footer>
                    )}
                </div>
            </div>

            {/* Lightbox */}
            <div
                className={`project-lightbox ${vm.isLightboxOpen ? 'open' : ''}`}
                onClick={vm.closeLightbox}
            >
                {vm.galleryImages[vm.galleryIndex] && (
                    <img
                        src={vm.galleryImages[vm.galleryIndex]}
                        alt={`${project.title} - full size`}
                        className="project-lightbox-image"
                        onClick={(e) => e.stopPropagation()}
                    />
                )}
                <button
                    className="project-lightbox-close"
                    onClick={vm.closeLightbox}
                    aria-label="Close lightbox"
                >
                    <X size={24} />
                </button>
            </div>
        </>
    );
};

export default ProjectDetailModal;
