/**
 * @fileoverview Admin Project Mock Data
 * Mock data for Project Edit Page and Project Manager testing.
 * 
 * Responsibilities:
 * - Provide consistent test data
 * - Define mock project scenarios
 * - Support edge case testing
 * 
 * @author Armand Richelet-Kleinberg
 * @module Frontend/Pages/Admin/Projects
 */

import { ProjectStatus } from '@ark/portfolio-share';
import { IProjectListItem, IProjectFormData } from './interfaces';

// =============================================================================
// MOCK PROJECTS FOR LIST/GRID DISPLAY
// =============================================================================

/**
 * Complete library project with package URL
 */
export const MOCK_PROJECT_WITH_PACKAGE: IProjectListItem = {
    id: '1',
    title: 'React Component Library',
    description: 'A comprehensive React component library with TypeScript support and full documentation.',
    status: ProjectStatus.COMPLETED,
    isFeatured: true,
    imageUrl: '/images/projects/lib-thumb.png',
    repositoryUrl: 'https://github.com/ark-alliance/react-lib',
    packageUrl: 'https://www.npmjs.com/package/@ark-alliance/react-lib',
    liveUrl: undefined,
};

/**
 * Standard application project without package URL
 */
export const MOCK_PROJECT_APP: IProjectListItem = {
    id: '2',
    title: 'Portfolio Application',
    description: 'Full-stack portfolio application with admin dashboard and CMS capabilities.',
    status: ProjectStatus.IN_PROGRESS,
    isFeatured: false,
    imageUrl: '/images/projects/app-thumb.png',
    repositoryUrl: 'https://github.com/ark-alliance/portfolio',
    packageUrl: undefined,
    liveUrl: 'https://portfolio.arkalliance.com',
};

/**
 * Minimal project with required fields only
 */
export const MOCK_PROJECT_MINIMAL: IProjectListItem = {
    id: '3',
    title: 'Minimal Project',
    status: ProjectStatus.IN_PROGRESS,
};

/**
 * Featured project for testing featured badge
 */
export const MOCK_PROJECT_FEATURED: IProjectListItem = {
    id: '4',
    title: 'Featured Project',
    description: 'A project marked as featured to test homepage display.',
    status: ProjectStatus.IN_PROGRESS,
    isFeatured: true,
};

/**
 * Collection of mock projects for list testing
 */
export const MOCK_PROJECT_LIST: IProjectListItem[] = [
    MOCK_PROJECT_WITH_PACKAGE,
    MOCK_PROJECT_APP,
    MOCK_PROJECT_MINIMAL,
];

// =============================================================================
// MOCK FORM DATA FOR EDIT PAGE
// =============================================================================

/**
 * Complete form data for editing existing project
 */
export const MOCK_FORM_DATA_EXISTING: IProjectFormData = {
    title: 'Existing Project',
    description: 'Existing project description for edit testing.',
    status: ProjectStatus.IN_PROGRESS,
    technologies: [{ name: 'React' }, { name: 'TypeScript' }],
    isFeatured: false,
    imageUrl: '/images/existing.png',
    repositoryUrl: 'https://github.com/existing',
    packageUrl: 'https://npmjs.com/package/existing',
    liveUrl: 'https://existing.example.com',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
};

/**
 * New project form data (for create tests)
 */
export const MOCK_FORM_DATA_NEW: Partial<IProjectFormData> = {
    title: 'New Test Project',
    description: 'A new project for creation testing.',
    status: ProjectStatus.IN_PROGRESS,
    technologies: [{ name: 'TypeScript' }],
    isFeatured: false,
    packageUrl: 'https://npmjs.com/package/new-test',
};

// =============================================================================
// API RESPONSE MOCKS
// =============================================================================

/**
 * Mock API response for successful project creation
 */
export const MOCK_CREATE_RESPONSE = {
    id: '123',
    ...MOCK_FORM_DATA_NEW,
};

/**
 * Mock API response for successful project update
 */
export const MOCK_UPDATE_RESPONSE = {
    id: '1',
    ...MOCK_FORM_DATA_EXISTING,
    title: 'Updated Title',
};

/**
 * Mock API error response
 */
export const MOCK_ERROR_RESPONSE = {
    error: 'Internal Server Error',
    message: 'Failed to process request',
    statusCode: 500,
};
