/**
 * @fileoverview Project Manager
 * Admin page for managing portfolio projects.
 * Uses navigation to dedicated edit page instead of modal.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../components/generic/AdminLayout';
import { useProjectManagerModel } from './ProjectManager.model';
import { Plus, Edit2, Trash2, Github, Package, ExternalLink } from 'lucide-react';
import './ProjectManager.styles.css';

export const ProjectManager: React.FC = () => {
    const navigate = useNavigate();
    const {
        projects,
        isLoading,
        error,
        handleDelete
    } = useProjectManagerModel();

    const handleAddProject = () => {
        navigate('/admin/projects/new');
    };

    const handleEditProject = (id: string) => {
        navigate(`/admin/projects/edit/${id}`);
    };

    return (
        <AdminLayout title="Projects">
            <div className="project-manager">
                <div className="pm-header">
                    <h2 className="pm-title">All Projects</h2>
                    <button className="pm-add-btn" onClick={handleAddProject}>
                        <Plus size={16} />
                        <span>Add Project</span>
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {isLoading ? (
                    <div className="pm-loading">Loading projects...</div>
                ) : (
                    <div className="pm-grid">
                        {projects.map(project => (
                            <div key={project.id} className="pm-card">
                                {/* Project Image */}
                                <div
                                    className="pm-card-image"
                                    style={project.imageUrl ? {
                                        backgroundImage: `url(${project.imageUrl})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    } : undefined}
                                />

                                {/* Card Content */}
                                <div className="pm-card-content">
                                    <div className="pm-card-header">
                                        <span className={`pm-card-status pm-status-${project.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                                            {project.status}
                                        </span>
                                        {project.isFeatured && (
                                            <span className="pm-featured-badge">★ Featured</span>
                                        )}
                                    </div>
                                    <h3 className="pm-card-title">{project.title}</h3>
                                    <p className="pm-card-description">
                                        {project.description?.substring(0, 120)}...
                                    </p>

                                    {/* Links */}
                                    <div className="pm-card-links">
                                        {project.repositoryUrl && (
                                            <a
                                                href={project.repositoryUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="pm-link-badge"
                                                title="Repository"
                                            >
                                                <Github size={14} />
                                                <span>Repo</span>
                                            </a>
                                        )}
                                        {project.packageUrl && (
                                            <a
                                                href={project.packageUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="pm-link-badge pm-link-package"
                                                title="Package"
                                            >
                                                <Package size={14} />
                                                <span>Package</span>
                                            </a>
                                        )}
                                        {project.liveUrl && (
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="pm-link-badge pm-link-live"
                                                title="Live Demo"
                                            >
                                                <ExternalLink size={14} />
                                                <span>Demo</span>
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="pm-card-actions">
                                    <button
                                        className="pm-action-btn"
                                        onClick={() => handleEditProject(project.id!)}
                                        title="Edit project"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        className="pm-action-btn delete"
                                        onClick={() => handleDelete(project.id!)}
                                        title="Delete project"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};
