/**
 * @fileoverview IResumeService Interface
 * Defines contract for resume/CV-related operations.
 * 
 * Responsibilities:
 * - Define CRUD operations for resume components
 * - Define experience, education, skills operations
 * - Enable mocking for tests
 * 
 * @author Armand Richelet-Kleinberg
 */

import {
    CvDto,
    AdminExperienceDto,
    AdminEducationDto,
    AdminSkillDto,
    CrudResponseDto
} from '@ark/portfolio-share';

/**
 * Reorder request for timeline items
 */
export interface ReorderTimelineDto {
    itemIds: number[];
}

/**
 * Insert position for timeline items
 */
export interface InsertAtPositionDto<T> {
    data: T;
    position: number;
}

/**
 * Interface for resume service operations
 * Used by both real implementations and test mocks.
 */
export interface IResumeService {
    /**
     * Retrieves complete resume data (public)
     * @returns Promise<CvDto>
     */
    getResume(): Promise<CvDto>;

    // ============================================
    // Experience Operations
    // ============================================

    /**
     * Retrieves all experiences
     * @returns Promise<AdminExperienceDto[]>
     */
    getExperiences(): Promise<AdminExperienceDto[]>;

    /**
     * Creates a new experience
     * @param dto - Experience data
     * @returns Promise<CrudResponseDto<AdminExperienceDto>>
     */
    createExperience(dto: Partial<AdminExperienceDto>): Promise<CrudResponseDto<AdminExperienceDto>>;

    /**
     * Updates an existing experience
     * @param id - Experience ID
     * @param dto - Updated data
     * @returns Promise<CrudResponseDto<AdminExperienceDto>>
     */
    updateExperience(id: number, dto: Partial<AdminExperienceDto>): Promise<CrudResponseDto<AdminExperienceDto>>;

    /**
     * Deletes an experience
     * @param id - Experience ID
     * @returns Promise<CrudResponseDto>
     */
    deleteExperience(id: number): Promise<CrudResponseDto>;

    /**
     * Inserts experience at specific position
     * @param dto - Experience data with position
     * @returns Promise<CrudResponseDto<AdminExperienceDto>>
     */
    insertExperienceAt(dto: InsertAtPositionDto<AdminExperienceDto>): Promise<CrudResponseDto<AdminExperienceDto>>;

    /**
     * Reorders experiences
     * @param dto - New order of experience IDs
     * @returns Promise<CrudResponseDto>
     */
    reorderExperiences(dto: ReorderTimelineDto): Promise<CrudResponseDto>;

    // ============================================
    // Education Operations
    // ============================================

    /**
     * Retrieves all education entries
     * @returns Promise<AdminEducationDto[]>
     */
    getEducation(): Promise<AdminEducationDto[]>;

    /**
     * Creates a new education entry
     * @param dto - Education data
     * @returns Promise<CrudResponseDto<AdminEducationDto>>
     */
    createEducation(dto: Partial<AdminEducationDto>): Promise<CrudResponseDto<AdminEducationDto>>;

    /**
     * Updates an existing education entry
     * @param id - Education ID
     * @param dto - Updated data
     * @returns Promise<CrudResponseDto<AdminEducationDto>>
     */
    updateEducation(id: number, dto: Partial<AdminEducationDto>): Promise<CrudResponseDto<AdminEducationDto>>;

    /**
     * Deletes an education entry
     * @param id - Education ID
     * @returns Promise<CrudResponseDto>
     */
    deleteEducation(id: number): Promise<CrudResponseDto>;

    /**
     * Reorders education entries
     * @param dto - New order of education IDs
     * @returns Promise<CrudResponseDto>
     */
    reorderEducation(dto: ReorderTimelineDto): Promise<CrudResponseDto>;

    // ============================================
    // Skills Operations
    // ============================================

    /**
     * Retrieves all skills
     * @returns Promise<AdminSkillDto[]>
     */
    getSkills(): Promise<AdminSkillDto[]>;

    /**
     * Creates a new skill
     * @param dto - Skill data
     * @returns Promise<CrudResponseDto<AdminSkillDto>>
     */
    createSkill(dto: Partial<AdminSkillDto>): Promise<CrudResponseDto<AdminSkillDto>>;

    /**
     * Updates an existing skill
     * @param id - Skill ID
     * @param dto - Updated data
     * @returns Promise<CrudResponseDto<AdminSkillDto>>
     */
    updateSkill(id: number, dto: Partial<AdminSkillDto>): Promise<CrudResponseDto<AdminSkillDto>>;

    /**
     * Deletes a skill
     * @param id - Skill ID
     * @returns Promise<CrudResponseDto>
     */
    deleteSkill(id: number): Promise<CrudResponseDto>;
}
