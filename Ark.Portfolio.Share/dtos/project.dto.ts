/**
 * @fileoverview Project DTOs
 * Data Transfer Objects for Project management.
 */

import { ProjectStatus } from '../enums/project-status.enum';

/**
 * Technology entry for projects.
 */
export interface AdminTechnologyDto {
    name: string;
    category?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminTechnology:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         category:
 *           type: string
 *     AdminProject:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [PLANNED, IN_PROGRESS, COMPLETED, ON_HOLD, ARCHIVED]
 *         technologies:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AdminTechnology'
 *         isFeatured:
 *           type: boolean
 *         imageUrl:
 *           type: string
 *         mermaidDiagram:
 *           type: string
 *         repositoryUrl:
 *           type: string
 *         liveUrl:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 */
export interface AdminProjectDto {
    id?: string;
    title: string;
    description: string;
    status: ProjectStatus;
    technologies: AdminTechnologyDto[];
    isFeatured: boolean;
    imageUrl?: string;
    mermaidDiagram?: string;
    repositoryUrl?: string;
    liveUrl?: string;
    startDate?: string;
    endDate?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateMermaid:
 *       type: object
 *       required:
 *         - projectId
 *         - mermaidCode
 *       properties:
 *         projectId:
 *           type: string
 *           format: uuid
 *         mermaidCode:
 *           type: string
 */
export interface UpdateMermaidDto {
    projectId: string;
    mermaidCode: string;
}

/**
 * Page within a project.
 */
export interface ProjectPageDto {
    id: string;
    type?: string;
    title: string;
    content: string;
    order?: number;
}

/**
 * Feature highlight for a project.
 */
export interface ProjectFeatureDto {
    id?: string;
    title: string;
    description: string;
    icon?: string;
    imageUrl?: string;
}

// ============================================
// Public DTOs (for frontend consumption)
// ============================================

/**
 * Full project DTO for public/display use.
 * Includes features, pages, and alternate property names for compatibility.
 */
export interface ProjectDto {
    id?: string;
    title: string;
    description: string;
    status: ProjectStatus;
    technologies: (AdminTechnologyDto | string)[];
    isFeatured?: boolean;
    imageUrl?: string;
    mermaidDiagram?: string;
    /** Repository URL (alias for repositoryUrl) */
    repoUrl?: string;
    repositoryUrl?: string;
    /** Demo/live URL (alias for liveUrl) */
    demoUrl?: string;
    liveUrl?: string;
    startDate?: Date | string;
    endDate?: Date | string;
    /** Project features/highlights */
    features?: ProjectFeatureDto[];
    /** Project pages/sections */
    pages?: ProjectPageDto[];
}
