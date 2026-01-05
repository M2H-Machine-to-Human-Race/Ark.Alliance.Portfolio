/**
 * @fileoverview Project Controller
 * Handles HTTP requests for project-related endpoints.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { Request, Response } from 'express';
import { ProjectService } from '../services/project.service';
import { BaseController } from './base.controller';

const projectService = new ProjectService();

/**
 * Controller for project endpoints.
 * Provides CRUD operations for portfolio projects.
 */
export class ProjectController extends BaseController {
    /**
     * GET /api/projects
     * Retrieves all projects with relations.
     */
    async getAllProjects(req: Request, res: Response) {
        try {
            const projects = await projectService.getAllProjects();
            return this.ok(res, projects);
        } catch (error) {
            return this.fail(res, error as Error);
        }
    }

    /**
     * GET /api/projects/featured
     * Retrieves featured projects for homepage carousel.
     */
    async getFeaturedProjects(req: Request, res: Response) {
        try {
            const projects = await projectService.getFeaturedProjects();
            return this.ok(res, projects);
        } catch (error) {
            return this.fail(res, error as Error);
        }
    }

    /**
     * GET /api/projects/:id
     * Retrieves a single project by ID or slug.
     * Supports both UUID format and URL-friendly slugs (e.g., 'ark-alliance').
     */
    async getProjectById(req: Request, res: Response) {
        try {
            const idOrSlug = req.params.id;
            const project = await projectService.getProjectByIdOrSlug(idOrSlug);
            if (!project) {
                return this.notFound(res, 'Project not found');
            }
            return this.ok(res, project);
        } catch (error) {
            return this.fail(res, error as Error);
        }
    }
}

