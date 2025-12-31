/**
 * @fileoverview IProjectService Interface
 * Defines contract for project-related operations.
 * 
 * Responsibilities:
 * - Define CRUD operations for projects
 * - Define query/filter operations
 * - Enable mocking for tests
 * 
 * @author Armand Richelet-Kleinberg
 */

import { ProjectDto, AdminProjectDto, CrudResponseDto, PaginatedResponseDto } from '@ark/portfolio-share';

/**
 * Project query filters
 */
export interface ProjectQueryFilters {
    status?: string;
    featured?: boolean;
    technology?: string;
    search?: string;
}

/**
 * Project pagination options
 */
export interface ProjectPaginationOptions {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

/**
 * Interface for project service operations
 * Used by both real implementations and test mocks.
 */
export interface IProjectService {
    /**
     * Retrieves all projects (public)
     * @param filters - Optional query filters
     * @returns Promise<ProjectDto[]>
     */
    getAll(filters?: ProjectQueryFilters): Promise<ProjectDto[]>;

    /**
     * Retrieves a single project by ID
     * @param id - Project ID
     * @returns Promise<ProjectDto | null>
     */
    getById(id: number): Promise<ProjectDto | null>;

    /**
     * Retrieves a project by slug
     * @param slug - Project slug
     * @returns Promise<ProjectDto | null>
     */
    getBySlug(slug: string): Promise<ProjectDto | null>;

    /**
     * Retrieves featured projects
     * @param limit - Maximum number of projects
     * @returns Promise<ProjectDto[]>
     */
    getFeatured(limit?: number): Promise<ProjectDto[]>;

    /**
     * Creates a new project (admin)
     * @param dto - Project data
     * @returns Promise<CrudResponseDto<AdminProjectDto>>
     */
    create(dto: Partial<AdminProjectDto>): Promise<CrudResponseDto<AdminProjectDto>>;

    /**
     * Updates an existing project (admin)
     * @param id - Project ID
     * @param dto - Updated data
     * @returns Promise<CrudResponseDto<AdminProjectDto>>
     */
    update(id: number, dto: Partial<AdminProjectDto>): Promise<CrudResponseDto<AdminProjectDto>>;

    /**
     * Deletes a project (admin)
     * @param id - Project ID
     * @returns Promise<CrudResponseDto>
     */
    delete(id: number): Promise<CrudResponseDto>;

    /**
     * Retrieves paginated projects (admin)
     * @param options - Pagination options
     * @returns Promise<PaginatedResponseDto<AdminProjectDto>>
     */
    getPaginated(options: ProjectPaginationOptions): Promise<PaginatedResponseDto<AdminProjectDto>>;
}
