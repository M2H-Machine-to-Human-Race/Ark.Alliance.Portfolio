/**
 * @fileoverview Project entity to DTO mappers
 * Provides centralized mapping functions to convert TypeORM entities to DTOs.
 * Eliminates code duplication across service methods.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { ProjectDto, ProjectFeatureDto, ProjectPageDto, ProjectStatus, Technology } from '@ark/portfolio-share';
import { Project } from '../database/entities/project.entity';
import { ProjectFeature } from '../database/entities/project-feature.entity';
import { ProjectPage } from '../database/entities/project-page.entity';

/**
 * Maps a ProjectFeature entity to ProjectFeatureDto.
 * 
 * @param feature - The feature entity from the database
 * @returns The feature DTO for API response
 */
export function mapFeatureToDto(feature: ProjectFeature): ProjectFeatureDto {
    return {
        id: feature.id,
        title: feature.title,
        description: feature.description,
        icon: feature.icon,
        imageUrl: feature.imageUrl
    };
}

/**
 * Maps a ProjectPage entity to ProjectPageDto.
 * 
 * @param page - The page entity from the database
 * @returns The page DTO for API response
 */
export function mapPageToDto(page: ProjectPage): ProjectPageDto {
    return {
        id: page.id,
        type: page.type as ProjectPageDto['type'],
        title: page.title,
        content: page.content
    };
}

/**
 * Maps a Project entity to ProjectDto.
 * Includes mapping of all nested relations (technologies, features, pages).
 * 
 * @param project - The project entity from the database with loaded relations
 * @returns The complete project DTO for API response
 * 
 * @example
 * ```typescript
 * const project = await projectRepo.findOne({
 *   where: { id },
 *   relations: { technologies: true, features: true, pages: true }
 * });
 * const dto = mapProjectToDto(project);
 * ```
 */
export function mapProjectToDto(project: Project): ProjectDto {
    return {
        id: project.id,
        title: project.title,
        description: project.description,
        isFeatured: project.isFeatured,
        status: project.status as ProjectStatus,
        technologies: project.technologies
            ? project.technologies.map((t: any) => t.technology as Technology)
            : [],
        imageUrl: project.imageUrl,
        repoUrl: project.repoUrl,
        packageUrl: project.packageUrl,
        demoUrl: project.demoUrl,
        startDate: project.startDate,
        endDate: project.endDate,
        features: project.features
            ? project.features.map(mapFeatureToDto)
            : [],
        pages: project.pages
            ? project.pages.map(mapPageToDto)
            : []
    };
}

/**
 * Maps an array of Project entities to ProjectDto array.
 * 
 * @param projects - Array of project entities
 * @returns Array of project DTOs
 */
export function mapProjectsToDtos(projects: Project[]): ProjectDto[] {
    return projects.map(mapProjectToDto);
}

