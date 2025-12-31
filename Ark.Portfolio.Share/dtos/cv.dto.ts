/**
 * @fileoverview CV Data Transfer Objects (DEPRECATED)
 * 
 * @deprecated This file is maintained for backwards compatibility only.
 * Please use resume.dto.ts instead. All CvDto types are now ResumeDto.
 * 
 * This file will be removed in version 2.0.0
 * 
 * @author Armand Richelet-Kleinberg
 */

// Re-export everything from resume.dto.ts
export * from './resume.dto';

// Backwards-compatible type aliases
import type {
    AdminResumeDto as _AdminResumeDto,
    AdminProfileDto,
    AdminExperienceDto,
    AdminEducationDto,
    AdminSkillDto,
} from './resume.dto';

/**
 * @deprecated Use AdminResumeDto from resume.dto.ts instead
 */
export type AdminCvDto = _AdminResumeDto;

/**
 * @deprecated Use AdminResumeDto from resume.dto.ts instead
 */
export type CvDto = _AdminResumeDto;
