/**
 * @fileoverview ProjectGrid View Component
 * Responsive grid of project cards with filtering.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import { Search, FolderOpen, Edit2, Trash2, ExternalLink, Layers } from 'lucide-react';
import { useProjectGridModel, ProjectCardData, ProjectStatus } from './ProjectGrid.model';
import './ProjectGrid.styles.css';

/**
 * ProjectGrid Props
 */
export interface ProjectGridProps {
    /** Projects to display */
    projects: ProjectCardData[];
    /** Show admin controls */
    showAdmin?: boolean;
    /** Callback when project is clicked */
    onProjectClick?: (project: ProjectCardData) => void;
    /** Callback for edit */
    onEdit?: (project: ProjectCardData) => void;
    /** Callback for delete */
    onDelete?: (project: ProjectCardData) => void;
    /** Optional class name */
    className?: string;
}

/**
 * Status filter options
 */
const STATUS_OPTIONS: { id: ProjectStatus | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'completed', label: 'Completed' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'planned', label: 'Planned' },
];

/**
 * ProjectGrid Component
 * 
 * Features:
 * - Responsive grid layout (1-3 columns)
 * - Filtering by status and technology
 * - Search functionality
 * - Hover effects with view overlay
 * - Admin edit/delete controls
 * - Staggered animations
 */
export const ProjectGrid: React.FC<ProjectGridProps> = ({
    projects,
    showAdmin = false,
    onProjectClick,
    onEdit,
    onDelete,
    className = '',
}) => {
    const vm = useProjectGridModel({
        projects,
        showAdmin,
        onProjectClick,
        onEdit,
        onDelete,
    });

    return (
        <div className={`project-grid-container ${className}`}>
            {/* Controls */}
            <div className="project-grid-controls">
                {/* Status Filters */}
                <div className="project-grid-status-filters" role="tablist">
                    {STATUS_OPTIONS.map(status => (
                        <button
                            key={status.id}
                            className={`project-status-btn ${vm.statusFilter === status.id ? 'active' : ''}`}
                            onClick={() => vm.setStatusFilter(status.id)}
                            role="tab"
                            aria-selected={vm.statusFilter === status.id}
                        >
                            {status.label}
                        </button>
                    ))}
                </div>

                {/* Technology Filter */}
                {vm.availableTechnologies.length > 0 && (
                    <div className="project-tech-filter">
                        <select
                            className="project-tech-select"
                            value={vm.techFilter || ''}
                            onChange={(e) => vm.setTechFilter(e.target.value || null)}
                            aria-label="Filter by technology"
                        >
                            <option value="">All Technologies</option>
                            {vm.availableTechnologies.map(tech => (
                                <option key={tech} value={tech}>{tech}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Search */}
                <div className="project-grid-search">
                    <Search size={16} className="project-grid-search-icon" aria-hidden="true" />
                    <input
                        type="search"
                        className="project-grid-search-input"
                        placeholder="Search projects..."
                        value={vm.searchQuery}
                        onChange={(e) => vm.setSearchQuery(e.target.value)}
                        aria-label="Search projects"
                    />
                </div>

                {/* Results Count */}
                <span className="project-grid-count">
                    {vm.filteredProjects.length} project{vm.filteredProjects.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Grid */}
            <div className="project-grid" role="list">
                {vm.filteredProjects.length > 0 ? (
                    vm.filteredProjects.map((project, index) => (
                        <article
                            key={project.id}
                            className={`project-card ${project.featured ? 'featured' : ''}`}
                            role="listitem"
                            tabIndex={0}
                            onClick={() => vm.selectProject(project)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    vm.selectProject(project);
                                }
                            }}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Status Badge */}
                            <span
                                className="project-card-status"
                                data-status={project.status}
                            >
                                {project.status.replace('_', ' ')}
                            </span>

                            {/* Image */}
                            <div className="project-card-image">
                                {project.imageUrl ? (
                                    <img
                                        src={project.imageUrl}
                                        alt={project.title}
                                        className="project-card-img"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="project-card-placeholder">
                                        <Layers size={48} />
                                    </div>
                                )}
                                <div className="project-card-overlay">
                                    <button className="project-card-view-btn">
                                        <ExternalLink size={14} />
                                        View Details
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="project-card-content">
                                <h3 className="project-card-title">{project.title}</h3>
                                <p className="project-card-summary">{project.summary}</p>

                                {project.technologies.length > 0 && (
                                    <div className="project-card-tech">
                                        {project.technologies.slice(0, 4).map(tech => (
                                            <span key={tech} className="project-tech-tag">
                                                {tech}
                                            </span>
                                        ))}
                                        {project.technologies.length > 4 && (
                                            <span className="project-tech-tag">
                                                +{project.technologies.length - 4}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {showAdmin && (
                                    <div className="project-card-admin">
                                        <button
                                            className="project-admin-btn edit"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                vm.handleEdit(project);
                                            }}
                                            aria-label={`Edit ${project.title}`}
                                        >
                                            <Edit2 size={14} />
                                            Edit
                                        </button>
                                        <button
                                            className="project-admin-btn delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                vm.handleDelete(project);
                                            }}
                                            aria-label={`Delete ${project.title}`}
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </article>
                    ))
                ) : (
                    <div className="project-grid-empty">
                        <FolderOpen size={64} className="project-grid-empty-icon" />
                        <h3 className="project-grid-empty-title">No projects found</h3>
                        <p className="project-grid-empty-text">
                            {vm.searchQuery
                                ? `No results for "${vm.searchQuery}"`
                                : 'No projects match your filters'}
                        </p>
                        {(vm.statusFilter !== 'all' || vm.techFilter || vm.searchQuery) && (
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={vm.clearFilters}
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectGrid;
