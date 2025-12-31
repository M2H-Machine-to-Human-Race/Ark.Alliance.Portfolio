/**
 * @fileoverview Admin Controller
 * Handles all administrative API endpoints.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { AdminProjectService } from '../services/admin-project.service';
import { AdminCvService } from '../services/admin-cv.service';
import { AdminWidgetService } from '../services/admin-widget.service';
import { AdminMenuService } from '../services/admin-menu.service';
import { AdminStyleService } from '../services/admin-style.service';
import { AdminMediaService } from '../services/admin-media.service';
import { AdminCarouselService } from '../services/admin-carousel.service';
import { AiService } from '../services/ai.service';
import {
    AdminProjectDto, AdminCvDto, AdminWidgetDto, AdminMenuItemDto,
    AdminStyleConfigDto, UploadMediaDto, ReorderWidgetsDto, ReorderMenuItemsDto,
    AdminCarouselItemDto, ReorderCarouselDto, AdminExperienceDto, AdminEducationDto,
    AdminSkillDto, SkillCategoryDto, ReorderSkillsDto, AiSettingsDto
} from '@ark/portfolio-share';

export class AdminController extends BaseController {
    private projectService: AdminProjectService;
    private cvService: AdminCvService;
    private widgetService: AdminWidgetService;
    private menuService: AdminMenuService;
    private styleService: AdminStyleService;
    private mediaService: AdminMediaService;
    private carouselService: AdminCarouselService;
    private aiService: AiService;

    constructor() {
        super();
        this.projectService = new AdminProjectService();
        this.cvService = new AdminCvService();
        this.widgetService = new AdminWidgetService();
        this.menuService = new AdminMenuService();
        this.styleService = new AdminStyleService();
        this.mediaService = new AdminMediaService();
        this.carouselService = new AdminCarouselService();
        this.aiService = new AiService();
    }

    // ============================================
    // Project Endpoints
    // ============================================

    async getProjects(req: Request, res: Response) {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const search = req.query.search as string;
        const result = await this.projectService.getAllProjects(page, pageSize, search);
        return this.ok(res, result);
    }

    async getProject(req: Request, res: Response) {
        const result = await this.projectService.getProjectById(req.params.id);
        if (!result) return this.notFound(res, 'Project not found');
        return this.ok(res, result);
    }

    async createProject(req: Request, res: Response) {
        const dto = req.body as AdminProjectDto;
        const result = await this.projectService.createProject(dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async updateProject(req: Request, res: Response) {
        const dto = req.body as AdminProjectDto;
        const result = await this.projectService.updateProject(req.params.id, dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async deleteProject(req: Request, res: Response) {
        const result = await this.projectService.deleteProject(req.params.id);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    // ============================================
    // CV Endpoints
    // ============================================

    async getCv(req: Request, res: Response) {
        const result = await this.cvService.getFullCv();
        return this.ok(res, result);
    }

    async updateProfile(req: Request, res: Response) {
        const dto = req.body as AdminCvDto['profile'];
        const result = await this.cvService.updateProfile(dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    // Experience CRUD
    async createExperience(req: Request, res: Response) {
        const dto = req.body as AdminExperienceDto;
        const result = await this.cvService.createExperience(dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async updateExperience(req: Request, res: Response) {
        const dto = req.body as AdminExperienceDto;
        const result = await this.cvService.updateExperience(parseInt(req.params.id), dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async deleteExperience(req: Request, res: Response) {
        const result = await this.cvService.deleteExperience(parseInt(req.params.id));
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    // Education CRUD
    async createEducation(req: Request, res: Response) {
        const dto = req.body as AdminEducationDto;
        const result = await this.cvService.createEducation(dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async updateEducation(req: Request, res: Response) {
        const dto = req.body as AdminEducationDto;
        const result = await this.cvService.updateEducation(parseInt(req.params.id), dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async deleteEducation(req: Request, res: Response) {
        const result = await this.cvService.deleteEducation(parseInt(req.params.id));
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async reorderExperiences(req: Request, res: Response) {
        const { experienceIds } = req.body as { experienceIds: number[] };
        const result = await this.cvService.reorderExperiences(experienceIds);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async reorderEducation(req: Request, res: Response) {
        const { educationIds } = req.body as { educationIds: number[] };
        const result = await this.cvService.reorderEducation(educationIds);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    // Skills CRUD
    async createSkill(req: Request, res: Response) {
        const dto = req.body as AdminSkillDto;
        const result = await this.cvService.createSkill(dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async updateSkill(req: Request, res: Response) {
        const dto = req.body as AdminSkillDto;
        const result = await this.cvService.updateSkill(parseInt(req.params.id), dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async deleteSkill(req: Request, res: Response) {
        const result = await this.cvService.deleteSkill(parseInt(req.params.id));
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async reorderSkills(req: Request, res: Response) {
        const dto = req.body as ReorderSkillsDto;
        const result = await this.cvService.reorderSkills(dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    // Skill Categories CRUD
    async getSkillCategories(req: Request, res: Response) {
        const result = await this.cvService.getSkillCategories();
        return this.ok(res, result);
    }

    async createSkillCategory(req: Request, res: Response) {
        const dto = req.body as SkillCategoryDto;
        const result = await this.cvService.createSkillCategory(dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async updateSkillCategory(req: Request, res: Response) {
        const dto = req.body as SkillCategoryDto;
        const result = await this.cvService.updateSkillCategory(parseInt(req.params.id), dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async deleteSkillCategory(req: Request, res: Response) {
        const result = await this.cvService.deleteSkillCategory(parseInt(req.params.id));
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    // ============================================
    // AI Endpoints
    // ============================================

    async getAiSettings(req: Request, res: Response) {
        const result = await this.aiService.getSettings();
        return this.ok(res, result);
    }

    async updateAiSettings(req: Request, res: Response) {
        const dto = req.body as AiSettingsDto;
        const result = await this.aiService.updateSettings(dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async testAiConnection(req: Request, res: Response) {
        const result = await this.aiService.testConnection();
        return this.ok(res, result);
    }

    async getAiProviderModels(req: Request, res: Response) {
        const provider = req.params.provider;
        const models = await this.aiService.getProviderModels(provider);
        return this.ok(res, models);
    }

    async organizeSkillsWithAi(req: Request, res: Response) {
        const skills = req.body.skills;
        const result = await this.aiService.organizeSkills(skills);
        return this.ok(res, result);
    }

    async improveTextWithAi(req: Request, res: Response) {
        const { text, context } = req.body;
        const result = await this.aiService.improveDescription(text, context);
        return this.ok(res, { result });
    }

    // ============================================
    // Widget Endpoints
    // ============================================

    async getWidgets(req: Request, res: Response) {
        const pageId = req.query.pageId as string;
        const result = await this.widgetService.getWidgets(pageId);
        return this.ok(res, result);
    }

    async createWidget(req: Request, res: Response) {
        const dto = req.body as AdminWidgetDto;
        const result = await this.widgetService.createWidget(dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async updateWidget(req: Request, res: Response) {
        const dto = req.body as AdminWidgetDto;
        const result = await this.widgetService.updateWidget(req.params.id, dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async deleteWidget(req: Request, res: Response) {
        const result = await this.widgetService.deleteWidget(req.params.id);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async reorderWidgets(req: Request, res: Response) {
        const dto = req.body as ReorderWidgetsDto;
        const result = await this.widgetService.reorderWidgets(dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    // ============================================
    // Menu Endpoints
    // ============================================

    async getMenu(req: Request, res: Response) {
        const position = req.query.position as any;
        const result = await this.menuService.getMenuByPosition(position);
        return this.ok(res, result);
    }

    async createMenuItem(req: Request, res: Response) {
        const dto = req.body as AdminMenuItemDto;
        const result = await this.menuService.createMenuItem(dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async updateMenuItem(req: Request, res: Response) {
        const dto = req.body as AdminMenuItemDto;
        const result = await this.menuService.updateMenuItem(parseInt(req.params.id), dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async deleteMenuItem(req: Request, res: Response) {
        const result = await this.menuService.deleteMenuItem(parseInt(req.params.id));
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async reorderMenu(req: Request, res: Response) {
        const dto = req.body as ReorderMenuItemsDto;
        const result = await this.menuService.reorderMenuItems(dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    // ============================================
    // Style Endpoints
    // ============================================

    async getStyles(req: Request, res: Response) {
        const result = await this.styleService.getAllStyles();
        return this.ok(res, result);
    }

    async getActiveStyle(req: Request, res: Response) {
        const result = await this.styleService.getActiveStyle();
        return this.ok(res, result);
    }

    async createStyle(req: Request, res: Response) {
        const dto = req.body as AdminStyleConfigDto;
        const result = await this.styleService.createStyle(dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async updateStyle(req: Request, res: Response) {
        const dto = req.body as AdminStyleConfigDto;
        const result = await this.styleService.updateStyle(parseInt(req.params.id), dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async deleteStyle(req: Request, res: Response) {
        const result = await this.styleService.deleteStyle(parseInt(req.params.id));
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async activateStyle(req: Request, res: Response) {
        const result = await this.styleService.activateStyle(parseInt(req.params.id));
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    // ============================================
    // Media Endpoints
    // ============================================

    /**
     * Get all media with optional filtering.
     * @param req - Express request with query params (type, search, tags, page, pageSize)
     * @param res - Express response
     */
    async getMedia(req: Request, res: Response) {
        const params = {
            type: req.query.type as any,
            search: req.query.search as string,
            tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
            page: parseInt(req.query.page as string) || 1,
            pageSize: parseInt(req.query.pageSize as string) || 50
        };
        const result = await this.mediaService.getAllMedia(params);
        return this.ok(res, result);
    }

    /**
     * Get media by unique key.
     * @param req - Express request with key param
     * @param res - Express response
     */
    async getMediaByKey(req: Request, res: Response) {
        const result = await this.mediaService.getByKey(req.params.key);
        if (!result) return this.notFound(res, 'Media not found');
        return this.ok(res, result);
    }

    /**
     * Get all available tags.
     * @param req - Express request
     * @param res - Express response
     */
    async getMediaTags(req: Request, res: Response) {
        const result = await this.mediaService.getAllTags();
        return this.ok(res, result);
    }

    /**
     * Upload a new media file.
     * @param req - Express request with file and body data
     * @param res - Express response
     */
    async uploadMedia(req: Request, res: Response) {
        if (!req.file) {
            return this.fail(res, new Error('No file uploaded'));
        }
        const data = {
            name: req.body.name || req.file.originalname,
            key: req.body.key,
            altText: req.body.altText,
            description: req.body.description,
            tags: req.body.tags ? JSON.parse(req.body.tags) : [],
            metadata: req.body.metadata ? JSON.parse(req.body.metadata) : undefined,
            isPublic: req.body.isPublic !== 'false'
        };
        const result = await this.mediaService.createFromUpload(req.file, data);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    /**
     * Create media from external URL.
     * @param req - Express request with URL and metadata
     * @param res - Express response
     */
    async createMediaFromUrl(req: Request, res: Response) {
        const { url, type, name, key, altText, description, tags, metadata } = req.body;
        if (!url || !type || !name) {
            return this.fail(res, new Error('url, type, and name are required'));
        }
        const result = await this.mediaService.createFromUrl(url, type, {
            name, key, altText, description, tags, metadata
        });
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    /**
     * Update media metadata.
     * @param req - Express request with id param and body data
     * @param res - Express response
     */
    async updateMedia(req: Request, res: Response) {
        const { name, key, altText, description, tags, metadata, isPublic } = req.body;
        const result = await this.mediaService.updateMedia(req.params.id, {
            name, key, altText, description, tags, metadata, isPublic
        });
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    /**
     * Delete media by ID.
     * @param req - Express request with id param
     * @param res - Express response
     */
    async deleteMedia(req: Request, res: Response) {
        const result = await this.mediaService.deleteMedia(req.params.id);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    // ============================================
    // Carousel Endpoints
    // ============================================

    async getCarousel(req: Request, res: Response) {
        const result = await this.carouselService.getAllCarouselItems();
        return this.ok(res, result);
    }

    async createCarouselItem(req: Request, res: Response) {
        const dto = req.body as AdminCarouselItemDto;
        const result = await this.carouselService.createCarouselItem(dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async updateCarouselItem(req: Request, res: Response) {
        const dto = req.body as AdminCarouselItemDto;
        const result = await this.carouselService.updateCarouselItem(parseInt(req.params.id), dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async deleteCarouselItem(req: Request, res: Response) {
        const result = await this.carouselService.deleteCarouselItem(parseInt(req.params.id));
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }

    async reorderCarousel(req: Request, res: Response) {
        const dto = req.body as ReorderCarouselDto;
        const result = await this.carouselService.reorderCarouselItems(dto);
        if (!result.success) return this.fail(res, new Error(result.message));
        return this.ok(res, result);
    }
}

