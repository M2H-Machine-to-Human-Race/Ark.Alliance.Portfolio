/**
 * @fileoverview Skill Category DTOs
 * Data Transfer Objects for skill category management.
 */

/**
 * Skill category DTO for CRUD operations.
 */
export interface SkillCategoryDto {
    id?: number;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    displayOrder?: number;
}

/**
 * Reorder skill categories request.
 */
export interface ReorderSkillCategoriesDto {
    categoryIds: number[];
}

/**
 * Reorder skills within category request.
 */
export interface ReorderSkillsDto {
    categoryId: number;
    skillIds: number[];
}

/**
 * Move skill to category request.
 */
export interface MoveSkillToCategoryDto {
    skillId: number;
    targetCategoryId: number;
}
