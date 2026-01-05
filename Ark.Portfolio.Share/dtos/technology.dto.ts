/**
 * @fileoverview Technology DTOs
 * Data transfer objects for technology/framework information
 * 
 * @module dtos/technology.dto
 * @author Armand Richelet-Kleinberg
 */

/**
 * Technology DTO
 * Represents a single technology/framework with its metadata
 */
export interface TechnologyDto {
    /** Unique identifier key (e.g., "react", "typescript") */
    key: string;

    /** Display name (e.g., "React", "TypeScript") */
    name: string;

    /** Full label (e.g., "React.js", "TypeScript") */
    label: string;

    /** Category ID this technology belongs to */
    category: string;

    /** Brief description of the technology */
    description: string;

    /** Icon class name (Font Awesome or Devicon) */
    icon: string;

    /** Brand color in hex format */
    color: string;

    /** Official website URL (optional) */
    website?: string;

    /** Supported/used versions (optional) */
    versions?: string[];
}

/**
 * Technology Category DTO
 * Represents a category grouping multiple technologies
 */
export interface TechnologyCategoryDto {
    /** Unique category ID (e.g., "frontend", "backend") */
    id: string;

    /** Display name (e.g., "Frontend Frameworks & Libraries") */
    name: string;

    /** Category description */
    description: string;

    /** Display order */
    order: number;

    /** Technologies in this category */
    technologies: TechnologyDto[];
}

/**
 * Technologies Response DTO
 * Full response containing all categories and technologies
 */
export interface TechnologiesResponseDto {
    /** All technology categories with their technologies */
    categories: TechnologyCategoryDto[];

    /** Flat array of all technologies for quick lookup */
    technologies: TechnologyDto[];
}
