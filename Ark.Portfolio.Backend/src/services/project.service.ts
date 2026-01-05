/**
 * @fileoverview Project Service
 * Handles business logic for project-related operations.
 * Uses centralized mappers for consistent entity-to-DTO transformation.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { AppDataSource } from '../config/database';
import { Project } from '../database/entities/project.entity';
import { ProjectDto } from '@ark/portfolio-share';
import { mapProjectToDto, mapProjectsToDtos } from '../mappers';

/**
 * Service class for project-related operations.
 * Provides CRUD operations and queries for portfolio projects.
 */
export class ProjectService {
    /**
     * Retrieves all projects with their relations.
     * Projects are sorted by start date (most recent first).
     * 
     * @returns Promise resolving to array of all project DTOs
     */
    async getAllProjects(): Promise<ProjectDto[]> {
        const projectRepo = AppDataSource.getRepository(Project);
        const projects = await projectRepo.find({
            relations: {
                technologies: true,
                features: true,
                pages: true
            },
            order: {
                startDate: 'DESC'
            }
        });

        return mapProjectsToDtos(projects);
    }

    /**
     * Retrieves featured projects for homepage carousel.
     * Limited to 5 most recent featured projects.
     * 
     * @returns Promise resolving to array of featured project DTOs
     */
    async getFeaturedProjects(): Promise<ProjectDto[]> {
        const projectRepo = AppDataSource.getRepository(Project);
        const projects = await projectRepo.find({
            where: { isFeatured: true },
            relations: {
                technologies: true,
                features: true,
                pages: true
            },
            order: {
                startDate: 'DESC'
            },
            take: 5
        });

        return mapProjectsToDtos(projects);
    }

    /**
     * Retrieves a single project by its ID.
     * 
     * @param id - The project's unique identifier
     * @returns Promise resolving to project DTO or null if not found
     */
    async getProjectById(id: string): Promise<ProjectDto | null> {
        const projectRepo = AppDataSource.getRepository(Project);
        const project = await projectRepo.findOne({
            where: { id },
            relations: {
                technologies: true,
                features: true,
                pages: true
            }
        });

        if (!project) return null;

        return mapProjectToDto(project);
    }

    /**
     * Retrieves a single project by its slug (URL-friendly name).
     * The slug is derived from the project title (lowercase, spaces/dots to hyphens).
     * 
     * @param slug - The project's URL-friendly slug (e.g., 'ark-alliance')
     * @returns Promise resolving to project DTO or null if not found
     */
    async getProjectBySlug(slug: string): Promise<ProjectDto | null> {
        const projectRepo = AppDataSource.getRepository(Project);
        const projects = await projectRepo.find({
            relations: {
                technologies: true,
                features: true,
                pages: true
            }
        });

        // Convert slug back to title pattern and find matching project
        const normalizedSlug = slug.toLowerCase();
        const project = projects.find(p => {
            const projectSlug = p.title
                .toLowerCase()
                .replace(/\./g, '-')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            return projectSlug === normalizedSlug;
        });

        if (!project) return null;

        return mapProjectToDto(project);
    }

    /**
     * Retrieves a project by ID or slug.
     * Automatically detects if the parameter is a UUID or slug.
     * 
     * @param idOrSlug - Either a UUID string or URL-friendly slug
     * @returns Promise resolving to project DTO or null if not found
     */
    async getProjectByIdOrSlug(idOrSlug: string): Promise<ProjectDto | null> {
        // Check if it's a UUID pattern
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if (uuidPattern.test(idOrSlug)) {
            return this.getProjectById(idOrSlug);
        } else {
            return this.getProjectBySlug(idOrSlug);
        }
    }
}

