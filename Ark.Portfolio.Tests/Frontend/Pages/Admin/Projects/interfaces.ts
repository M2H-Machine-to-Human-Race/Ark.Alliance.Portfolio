/**
 * @fileoverview Admin Project Test Interfaces
 * Type definitions for Project Edit Page and Project Manager tests.
 * 
 * Responsibilities:
 * - Define form data structures
 * - Define model return types
 * - Enable type-safe mock creation
 * 
 * @author Armand Richelet-Kleinberg
 * @module Frontend/Pages/Admin/Projects
 */

import { ProjectStatus } from '@ark/portfolio-share';

/**
 * Form data interface for project editing
 * Mirrors the form state in ProjectEditPage component
 */
export interface IProjectFormData {
    /** Project title (required) */
    title: string;
    /** Project description (required) */
    description: string;
    /** Current project status */
    status: ProjectStatus;
    /** Associated technologies */
    technologies: { name: string }[];
    /** Whether project is featured on homepage */
    isFeatured: boolean;
    /** URL to project thumbnail/hero image */
    imageUrl: string;
    /** GitHub/GitLab repository URL */
    repositoryUrl: string;
    /** NPM/NuGet package URL */
    packageUrl: string;
    /** Live demo or production URL */
    liveUrl: string;
    /** Project start date (YYYY-MM-DD) */
    startDate: string;
    /** Project end date (YYYY-MM-DD) */
    endDate: string;
}

/**
 * Project data interface for list/grid display
 * Used by ProjectManager component
 */
export interface IProjectListItem {
    /** Unique identifier */
    id: string;
    /** Project title */
    title: string;
    /** Short description */
    description?: string;
    /** Current status */
    status: ProjectStatus;
    /** Featured flag */
    isFeatured?: boolean;
    /** Thumbnail URL */
    imageUrl?: string;
    /** Repository URL */
    repositoryUrl?: string;
    /** Package URL */
    packageUrl?: string;
    /** Live demo URL */
    liveUrl?: string;
}

/**
 * Return type for useProjectManagerModel hook
 */
export interface IProjectManagerModelReturn {
    /** List of projects */
    projects: IProjectListItem[];
    /** Loading state */
    isLoading: boolean;
    /** Error message if any */
    error: string | null;
    /** Delete handler function */
    handleDelete: (id: string) => void;
}

/**
 * Mock API client interface
 */
export interface IMockApiClient {
    /** GET request mock */
    get: jest.Mock;
    /** POST request mock */
    post: jest.Mock;
    /** PUT request mock */
    put: jest.Mock;
    /** DELETE request mock */
    delete?: jest.Mock;
}
