/**
 * @fileoverview Admin Project Service
 * Handles administrative operations for projects (CRUD).
 * 
 * @author Armand Richelet-Kleinberg
 */

import { AppDataSource } from '../config/database';
import { Project } from '../database/entities/project.entity';
import { ProjectTechnology } from '../database/entities/project-technology.entity';
import { AdminProjectDto, CrudResponseDto, PaginatedResponseDto } from '@ark/portfolio-share';
import { Like } from 'typeorm';
import { EventService } from './event.service';

/**
 * Service for managing projects in the admin panel.
 */
export class AdminProjectService {
    private projectRepo = AppDataSource.getRepository(Project);
    private techRepo = AppDataSource.getRepository(ProjectTechnology);
    private eventService = new EventService();

    /**
     * Get all projects with pagination and optional search.
     * @param page - Page number (1-indexed)
     * @param pageSize - Items per page
     * @param search - Optional search term for title
     * @returns Paginated response with projects
     */
    async getAllProjects(page: number = 1, pageSize: number = 10, search?: string): Promise<PaginatedResponseDto<Project>> {
        const skip = (page - 1) * pageSize;
        const where = search ? { title: Like(`%${search}%`) } : {};

        const [items, total] = await this.projectRepo.findAndCount({
            where,
            relations: { technologies: true },
            order: { startDate: 'DESC' },
            skip,
            take: pageSize
        });

        return {
            items,
            total,
            page,
            pageSize,
            hasNext: total > skip + pageSize,
            hasPrevious: page > 1
        };
    }

    /**
     * Get a single project by ID.
     * @param id - Project UUID
     * @returns Project with all relations or null
     */
    async getProjectById(id: string): Promise<Project | null> {
        return this.projectRepo.findOne({
            where: { id },
            relations: { technologies: true, features: true, pages: true }
        });
    }

    /**
     * Create a new project.
     * @param dto - Project data
     * @returns CRUD response with created project
     */
    async createProject(dto: AdminProjectDto): Promise<CrudResponseDto<Project>> {
        try {
            const project = this.projectRepo.create({
                title: dto.title,
                description: dto.description,
                imageUrl: dto.imageUrl,
                status: dto.status as any,
                isFeatured: dto.isFeatured ?? false,
                startDate: dto.startDate ? new Date(dto.startDate) : undefined,
                endDate: dto.endDate ? new Date(dto.endDate) : undefined,
                // Map DTO fields to entity fields
                repoUrl: dto.repositoryUrl,
                demoUrl: dto.liveUrl
            });

            const savedProject = await this.projectRepo.save(project);

            // Handle technologies (array of technology objects or strings)
            if (dto.technologies && dto.technologies.length > 0) {
                const techs = dto.technologies.map(t => {
                    const tech = new ProjectTechnology();
                    tech.projectId = savedProject.id;
                    tech.technology = typeof t === 'string' ? t : t.name;
                    tech.project = savedProject;
                    return tech;
                });
                await this.techRepo.save(techs);
                savedProject.technologies = techs;
            }

            await this.eventService.publish('ProjectCreated', { id: savedProject.id });

            return {
                success: true,
                message: 'Project created successfully',
                data: savedProject,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to create project',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Update an existing project.
     * @param id - Project UUID
     * @param dto - Updated project data
     * @returns CRUD response with updated project
     */
    async updateProject(id: string, dto: AdminProjectDto): Promise<CrudResponseDto<Project>> {
        try {
            const project = await this.projectRepo.findOne({
                where: { id },
                relations: { technologies: true }
            });

            if (!project) {
                return {
                    success: false,
                    message: 'Project not found',
                    timestamp: new Date().toISOString()
                };
            }

            // Update fields
            if (dto.title !== undefined) project.title = dto.title;
            if (dto.description !== undefined) project.description = dto.description;
            if (dto.imageUrl !== undefined) project.imageUrl = dto.imageUrl;
            if (dto.status !== undefined) project.status = dto.status as any;
            if (dto.isFeatured !== undefined) project.isFeatured = dto.isFeatured;
            if (dto.startDate !== undefined) project.startDate = new Date(dto.startDate);
            if (dto.endDate !== undefined) project.endDate = dto.endDate ? new Date(dto.endDate) : undefined as any;
            // Map DTO fields to entity fields
            if (dto.repositoryUrl !== undefined) project.repoUrl = dto.repositoryUrl;
            if (dto.liveUrl !== undefined) project.demoUrl = dto.liveUrl;

            await this.projectRepo.save(project);

            // Update technologies if provided
            if (dto.technologies) {
                // Remove existing
                await this.techRepo.delete({ projectId: id });

                // Add new
                const techs = dto.technologies.map(t => {
                    const tech = new ProjectTechnology();
                    tech.projectId = id;
                    tech.technology = typeof t === 'string' ? t : t.name;
                    tech.project = project;
                    return tech;
                });
                await this.techRepo.save(techs);
                project.technologies = techs;
            }

            await this.eventService.publish('ProjectUpdated', { id: project.id });

            return {
                success: true,
                message: 'Project updated successfully',
                data: project,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to update project',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Delete a project.
     * @param id - Project UUID
     * @returns CRUD response
     */
    async deleteProject(id: string): Promise<CrudResponseDto<void>> {
        try {
            const result = await this.projectRepo.delete(id);
            if (result.affected === 0) {
                return {
                    success: false,
                    message: 'Project not found',
                    timestamp: new Date().toISOString()
                };
            }
            await this.eventService.publish('ProjectDeleted', { id });

            return {
                success: true,
                message: 'Project deleted successfully',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to delete project',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }
}

