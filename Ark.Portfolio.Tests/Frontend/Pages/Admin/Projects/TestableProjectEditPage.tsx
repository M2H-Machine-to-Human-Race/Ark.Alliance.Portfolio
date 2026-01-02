/**
 * @fileoverview Testable ProjectEditPage Component
 * Test-specific implementation of ProjectEditPage that uses local mocks
 * to avoid dual React instance issues.
 * 
 * This component mirrors the actual ProjectEditPage structure but:
 * - Uses injected mock functions instead of real hooks
 * - Avoids importing from UI node_modules
 * - Provides testability without affecting production code
 * 
 * @author Armand Richelet-Kleinberg
 * @module Frontend/Pages/Admin/Projects
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectStatus } from '@ark/portfolio-share';
import { IProjectFormData, IMockApiClient } from './interfaces';
import { DEFAULT_FORM_DATA, EDIT_PAGE_TEST_IDS, TOAST_MESSAGES, ROUTE_PROJECT_LIST } from './constants';

// =============================================================================
// COMPONENT PROPS
// =============================================================================

/**
 * Props for TestableProjectEditPage
 * Allows dependency injection for testing
 */
export interface TestableProjectEditPageProps {
    /** Mock API client for data operations */
    apiClient: IMockApiClient;
    /** Mock navigate function */
    navigate: jest.Mock;
    /** Mock showToast function */
    showToast: jest.Mock;
}

// =============================================================================
// COMPONENT IMPLEMENTATION
// =============================================================================

/**
 * Testable version of ProjectEditPage component
 * 
 * Provides identical UI and behavior to the production component
 * but uses injected dependencies for testing.
 * 
 * @param props - Component props with injected mocks
 * @returns JSX.Element
 * 
 * @example
 * ```tsx
 * <TestableProjectEditPage
 *     apiClient={mockApiClient}
 *     navigate={mockNavigate}
 *     showToast={mockShowToast}
 * />
 * ```
 */
export const TestableProjectEditPage: React.FC<TestableProjectEditPageProps> = ({
    apiClient,
    navigate,
    showToast
}) => {
    // Get route params
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);

    // Form state
    const [formData, setFormData] = useState<IProjectFormData>(DEFAULT_FORM_DATA);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    /**
     * Load project data when editing
     */
    useEffect(() => {
        if (id) {
            loadProject(id);
        }
    }, [id]);

    /**
     * Fetches project data from API
     * @param projectId - ID of project to load
     */
    const loadProject = async (projectId: string): Promise<void> => {
        setIsLoading(true);
        try {
            const project = await apiClient.get(`/api/admin/projects/${projectId}`);
            if (project) {
                setFormData({
                    ...project,
                    startDate: project.startDate?.slice(0, 10) || '',
                    endDate: project.endDate?.slice(0, 10) || '',
                });
            } else {
                showToast(TOAST_MESSAGES.LOAD_FAILED, 'error');
                navigate(ROUTE_PROJECT_LIST);
            }
        } catch (error) {
            showToast(TOAST_MESSAGES.LOAD_ERROR, 'error');
            navigate(ROUTE_PROJECT_LIST);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Updates form field value
     * @param field - Field name to update
     * @param value - New value
     */
    const handleChange = (field: keyof IProjectFormData, value: unknown): void => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    /**
     * Submits form data to API
     * @param e - Form event
     */
    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (isEdit && id) {
                await apiClient.put(`/api/admin/projects/${id}`, formData);
            } else {
                await apiClient.post('/api/admin/projects', formData);
            }

            showToast(
                isEdit ? TOAST_MESSAGES.UPDATE_SUCCESS : TOAST_MESSAGES.CREATE_SUCCESS,
                'success'
            );
            navigate(ROUTE_PROJECT_LIST);
        } catch (error) {
            showToast(TOAST_MESSAGES.SAVE_ERROR, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    /**
     * Handles back/cancel navigation
     */
    const handleBack = (): void => {
        navigate(ROUTE_PROJECT_LIST);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="project-edit-page" data-testid={EDIT_PAGE_TEST_IDS.LOADING}>
                <p>Loading project...</p>
            </div>
        );
    }

    // Main render
    return (
        <div className="project-edit-page" data-testid={EDIT_PAGE_TEST_IDS.PAGE}>
            <div className="project-edit-header">
                <button
                    className="back-button"
                    onClick={handleBack}
                    data-testid={EDIT_PAGE_TEST_IDS.BACK_BUTTON}
                >
                    Back to Projects
                </button>
                <h1>{isEdit ? 'Edit Project' : 'Create New Project'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="project-edit-form">
                <div className="admin-form">
                    {/* Title Field */}
                    <div className="admin-form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => handleChange('title', e.target.value)}
                            placeholder="Project name"
                            required
                            data-testid={EDIT_PAGE_TEST_IDS.TITLE_INPUT}
                        />
                    </div>

                    {/* Description Field */}
                    <div className="admin-form-group">
                        <label>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={e => handleChange('description', e.target.value)}
                            placeholder="Project description..."
                            required
                            data-testid={EDIT_PAGE_TEST_IDS.DESCRIPTION_INPUT}
                        />
                    </div>

                    {/* Package URL Field */}
                    <div className="admin-form-group">
                        <label>Package URL</label>
                        <input
                            type="url"
                            value={formData.packageUrl}
                            onChange={e => handleChange('packageUrl', e.target.value)}
                            placeholder="https://www.npmjs.com/package/..."
                            data-testid={EDIT_PAGE_TEST_IDS.PACKAGE_URL_INPUT}
                        />
                    </div>

                    {/* Repository URL Field */}
                    <div className="admin-form-group">
                        <label>Repository URL</label>
                        <input
                            type="url"
                            value={formData.repositoryUrl}
                            onChange={e => handleChange('repositoryUrl', e.target.value)}
                            placeholder="https://github.com/..."
                            data-testid={EDIT_PAGE_TEST_IDS.REPO_URL_INPUT}
                        />
                    </div>
                </div>

                {/* Form Actions */}
                <div className="project-edit-actions">
                    <button
                        type="button"
                        onClick={handleBack}
                        data-testid={EDIT_PAGE_TEST_IDS.CANCEL_BUTTON}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving || !formData.title || !formData.description}
                        data-testid={EDIT_PAGE_TEST_IDS.SUBMIT_BUTTON}
                    >
                        {isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Project'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TestableProjectEditPage;
