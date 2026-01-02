/**
 * @fileoverview Testable ProjectManager Component
 * Test-specific implementation of ProjectManager that uses local mocks
 * to avoid dual React instance issues.
 * 
 * This component mirrors the actual ProjectManager structure but:
 * - Uses injected mock functions instead of real hooks
 * - Avoids importing from UI node_modules
 * - Provides testability without affecting production code
 * 
 * @author Armand Richelet-Kleinberg
 * @module Frontend/Pages/Admin/Projects
 */

import React from 'react';
import { IProjectListItem, IProjectManagerModelReturn } from './interfaces';
import { MANAGER_TEST_IDS, ROUTE_PROJECT_NEW, getEditRoute } from './constants';

// =============================================================================
// COMPONENT PROPS
// =============================================================================

/**
 * Props for TestableProjectManager
 * Allows dependency injection for testing
 */
export interface TestableProjectManagerProps {
    /** Model return value (from hook mock) */
    model: IProjectManagerModelReturn;
    /** Mock navigate function */
    navigate: jest.Mock;
}

// =============================================================================
// COMPONENT IMPLEMENTATION
// =============================================================================

/**
 * Testable version of ProjectManager component
 * 
 * Provides identical UI and behavior to the production component
 * but uses injected dependencies for testing.
 * 
 * @param props - Component props with injected mocks
 * @returns JSX.Element
 * 
 * @example
 * ```tsx
 * <TestableProjectManager
 *     model={mockModelReturn}
 *     navigate={mockNavigate}
 * />
 * ```
 */
export const TestableProjectManager: React.FC<TestableProjectManagerProps> = ({
    model,
    navigate
}) => {
    const { projects, isLoading, error, handleDelete } = model;

    /**
     * Navigates to project creation page
     */
    const handleAddProject = (): void => {
        navigate(ROUTE_PROJECT_NEW);
    };

    /**
     * Navigates to project edit page
     * @param id - Project ID to edit
     */
    const handleEditProject = (id: string): void => {
        navigate(getEditRoute(id));
    };

    return (
        <div data-testid={MANAGER_TEST_IDS.LAYOUT}>
            <h1>Projects</h1>
            <div className="project-manager" data-testid={MANAGER_TEST_IDS.MANAGER}>
                {/* Header */}
                <div className="pm-header">
                    <h2 className="pm-title">All Projects</h2>
                    <button
                        className="pm-add-btn"
                        onClick={handleAddProject}
                        data-testid={MANAGER_TEST_IDS.ADD_BUTTON}
                    >
                        Add Project
                    </button>
                </div>

                {/* Error State */}
                {error && (
                    <div className="error-message" data-testid={MANAGER_TEST_IDS.ERROR}>
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {isLoading ? (
                    <div className="pm-loading" data-testid={MANAGER_TEST_IDS.LOADING}>
                        Loading projects...
                    </div>
                ) : (
                    /* Project Grid */
                    <div className="pm-grid" data-testid={MANAGER_TEST_IDS.GRID}>
                        {projects.map((project: IProjectListItem) => (
                            <div
                                key={project.id}
                                className="pm-card"
                                data-testid={MANAGER_TEST_IDS.projectCard(project.id)}
                            >
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
                                                Repo
                                            </a>
                                        )}
                                        {project.packageUrl && (
                                            <a
                                                href={project.packageUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="pm-link-badge pm-link-package"
                                                title="Package"
                                                data-testid={MANAGER_TEST_IDS.packageLink(project.id)}
                                            >
                                                Package
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
                                                Demo
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="pm-card-actions">
                                    <button
                                        className="pm-action-btn"
                                        onClick={() => handleEditProject(project.id)}
                                        title="Edit project"
                                        data-testid={MANAGER_TEST_IDS.editButton(project.id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="pm-action-btn delete"
                                        onClick={() => handleDelete(project.id)}
                                        title="Delete project"
                                        data-testid={MANAGER_TEST_IDS.deleteButton(project.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestableProjectManager;
