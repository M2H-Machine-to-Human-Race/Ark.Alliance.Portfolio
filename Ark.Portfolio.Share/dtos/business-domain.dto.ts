/**
 * @fileoverview Business Domain DTO
 * Data transfer object for business domain knowledge.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { SkillLevel } from '../enums/skill-level.enum';
import {
    BUSINESS_DOMAIN_PRESETS,
    BusinessDomainPreset,
    isValidBusinessDomain,
    BUSINESS_DOMAIN_LEVELS
} from '../constants/resume.constants';

/**
 * Represents business domain expertise.
 * 
 * @remarks
 * Domain must be selected from BUSINESS_DOMAIN_PRESETS.
 * Level uses SkillLevel enum for consistency with skills.
 */
export interface BusinessDomainDto {
    /** Unique identifier */
    id?: number;

    /** Domain name - must be from preset list */
    domain: string;

    /** Proficiency level (uses SkillLevel enum) */
    level?: SkillLevel;

    /** Description of experience in this domain */
    description?: string;

    /** Years of experience in this domain */
    yearsOfExperience?: number;

    /** Lucide icon name for visual representation */
    icon?: string;

    /** Display order for sorting */
    displayOrder?: number;
}

/**
 * Validate a complete BusinessDomainDto.
 * @param dto - DTO to validate
 * @returns Object with isValid flag and error messages
 */
export function validateBusinessDomainDto(dto: BusinessDomainDto): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!dto.domain || dto.domain.trim() === '') {
        errors.push('Domain is required');
    } else if (!isValidBusinessDomain(dto.domain)) {
        errors.push(`"${dto.domain}" is not a valid business domain. Please select from the preset list.`);
    }

    if (dto.yearsOfExperience !== undefined && dto.yearsOfExperience < 0) {
        errors.push('Years of experience cannot be negative');
    }

    return { isValid: errors.length === 0, errors };
}

// Re-export constants for convenience
export {
    BUSINESS_DOMAIN_PRESETS,
    isValidBusinessDomain,
    BUSINESS_DOMAIN_LEVELS
};
export type { BusinessDomainPreset };
