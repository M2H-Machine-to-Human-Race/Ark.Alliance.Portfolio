/**
 * @fileoverview Resume DTOs
 * Data Transfer Objects for Resume/CV management.
 */

import { SkillLevel } from '../enums/skill-level.enum';
import { LanguageDto, PROFICIENCY_LEVEL_LABELS } from './language.dto';
import { HobbyDto } from './hobby.dto';
import { BusinessDomainDto, BUSINESS_DOMAIN_PRESETS, BUSINESS_DOMAIN_LEVELS } from './business-domain.dto';

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminProfile:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         title:
 *           type: string
 *         overview:
 *           type: string
 *         email:
 *           type: string
 *         linkedinUrl:
 *           type: string
 *         githubUrl:
 *           type: string
 *         avatarUrl:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         location:
 *           type: string
 *     AdminExperience:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         company:
 *           type: string
 *         position:
 *           type: string
 *         description:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         technologies:
 *           type: array
 *           items:
 *             type: string
 *         isHighlighted:
 *           type: boolean
 *     AdminSkill:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         level:
 *           type: string
 *           enum: [Beginner, Intermediate, Advanced, Expert, Master]
 *         category:
 *           type: string
 *         yearsOfExperience:
 *           type: number
 *     AdminEducation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         institution:
 *           type: string
 *         degree:
 *           type: string
 *         fieldOfStudy:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         description:
 *           type: string
 *     AdminResume:
 *       type: object
 *       properties:
 *         profile:
 *           $ref: '#/components/schemas/AdminProfile'
 *         experiences:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AdminExperience'
 *         skills:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AdminSkill'
 *         education:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AdminEducation'
 */
export interface AdminProfileDto {
    firstName: string;
    lastName: string;
    title: string;
    overview: string;
    email: string;
    linkedinUrl?: string;
    githubUrl?: string;
    avatarUrl?: string;
    phoneNumber?: string;
    location?: string;
}

/**
 * Experience entry for CV.
 */
export interface AdminExperienceDto {
    id?: number;
    company: string;
    position: string;
    description: string;
    startDate: string;
    endDate?: string | null;
    technologies: string[];
    isHighlighted?: boolean;
}

/**
 * Skill entry for CV.
 */
export interface AdminSkillDto {
    id?: number;
    name: string;
    level: SkillLevel;
    category: string;
    yearsOfExperience?: number;
}

/**
 * Education entry for CV.
 */
export interface AdminEducationDto {
    id?: number;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string | null;
    description?: string;
}

/**
 * Full Resume management DTO.
 */
export interface AdminResumeDto {
    profile: AdminProfileDto;
    experiences: AdminExperienceDto[];
    skills: AdminSkillDto[];
    education: AdminEducationDto[];
    languages?: LanguageDto[];
    hobbies?: HobbyDto[];
    businessDomains?: BusinessDomainDto[];
}

// Re-export new DTOs for convenience
export type { LanguageDto } from './language.dto';
export { PROFICIENCY_LEVEL_LABELS } from './language.dto';
export type { HobbyDto } from './hobby.dto';
export type { BusinessDomainDto } from './business-domain.dto';
export { BUSINESS_DOMAIN_PRESETS, BUSINESS_DOMAIN_LEVELS } from './business-domain.dto';

// ============================================
// Public Type Aliases
// ============================================
/** @deprecated Use AdminResumeDto for admin operations */
export type ResumeDto = AdminResumeDto;
/** @deprecated Use AdminExperienceDto for admin operations */
export type ExperienceDto = AdminExperienceDto;
/** @deprecated Use AdminEducationDto for admin operations */
export type EducationDto = AdminEducationDto;
/** @deprecated Use AdminSkillDto for admin operations */
export type SkillDto = AdminSkillDto;
