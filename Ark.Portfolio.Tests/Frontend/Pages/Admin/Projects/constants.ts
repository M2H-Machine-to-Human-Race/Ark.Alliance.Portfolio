/**
 * @fileoverview Admin Project Test Constants
 * Static values and configuration for Project Edit/Manager tests.
 * 
 * Responsibilities:
 * - Define API endpoint constants
 * - Define test data identifiers
 * - Define default form values
 * 
 * @author Armand Richelet-Kleinberg
 * @module Frontend/Pages/Admin/Projects
 */

import { ProjectStatus } from '@ark/portfolio-share';
import { IProjectFormData } from './interfaces';

// =============================================================================
// API ENDPOINTS
// =============================================================================

/** Base URL for admin project API */
export const API_BASE_URL = '/api/admin/projects';

/** Create project endpoint */
export const API_CREATE_PROJECT = API_BASE_URL;

/** 
 * Get/Update/Delete single project endpoint
 * @param id - Project identifier
 */
export const getProjectEndpoint = (id: string): string => `${API_BASE_URL}/${id}`;

// =============================================================================
// ROUTE PATHS
// =============================================================================

/** Route for creating new project */
export const ROUTE_PROJECT_NEW = '/admin/projects/new';

/** Route for editing existing project */
export const ROUTE_PROJECT_EDIT = '/admin/projects/edit';

/** Route for project list */
export const ROUTE_PROJECT_LIST = '/admin/projects';

/**
 * Get edit route for specific project
 * @param id - Project identifier
 */
export const getEditRoute = (id: string): string => `${ROUTE_PROJECT_EDIT}/${id}`;

// =============================================================================
// DEFAULT VALUES
// =============================================================================

/** Default form data for new project */
export const DEFAULT_FORM_DATA: IProjectFormData = {
    title: '',
    description: '',
    status: ProjectStatus.IN_PROGRESS,
    technologies: [],
    isFeatured: false,
    imageUrl: '',
    repositoryUrl: '',
    packageUrl: '',
    liveUrl: '',
    startDate: '',
    endDate: '',
};

// =============================================================================
// TEST IDENTIFIERS (data-testid values)
// =============================================================================

/** Test IDs for ProjectEditPage */
export const EDIT_PAGE_TEST_IDS = {
    PAGE: 'project-edit-page',
    LOADING: 'loading-state',
    TITLE_INPUT: 'title-input',
    DESCRIPTION_INPUT: 'description-input',
    PACKAGE_URL_INPUT: 'package-url-input',
    REPO_URL_INPUT: 'repo-url-input',
    SUBMIT_BUTTON: 'submit-button',
    CANCEL_BUTTON: 'cancel-button',
    BACK_BUTTON: 'back-button',
} as const;

/** Test IDs for ProjectManager */
export const MANAGER_TEST_IDS = {
    LAYOUT: 'admin-layout',
    MANAGER: 'project-manager',
    LOADING: 'loading-state',
    ERROR: 'error-message',
    GRID: 'projects-grid',
    ADD_BUTTON: 'add-project-btn',
    projectCard: (id: string) => `project-card-${id}`,
    editButton: (id: string) => `edit-btn-${id}`,
    deleteButton: (id: string) => `delete-btn-${id}`,
    packageLink: (id: string) => `package-link-${id}`,
} as const;

// =============================================================================
// TOAST MESSAGES
// =============================================================================

/** Success/error messages used by components */
export const TOAST_MESSAGES = {
    CREATE_SUCCESS: 'Project created successfully!',
    UPDATE_SUCCESS: 'Project updated successfully!',
    LOAD_ERROR: 'Error loading project',
    SAVE_ERROR: 'Error saving project',
    LOAD_FAILED: 'Failed to load project',
} as const;
