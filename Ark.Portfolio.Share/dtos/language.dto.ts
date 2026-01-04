/**
 * @fileoverview Language DTO
 * Data transfer object for language proficiency.
 * 
 * @author Armand Richelet-Kleinberg
 */

import {
    MIN_PROFICIENCY_LEVEL,
    MAX_PROFICIENCY_LEVEL,
    PROFICIENCY_LEVEL_LABELS,
    getProficiencyLabelByValue
} from '../constants/resume.constants';

/**
 * Represents language proficiency with three dimensions.
 * 
 * @remarks
 * Each dimension (speaking, writing, presenting) uses a 1-5 scale:
 * - 1 = Basic
 * - 2 = Elementary
 * - 3 = Intermediate
 * - 4 = Advanced
 * - 5 = Native/Fluent
 */
export interface LanguageDto {
    /** Unique identifier */
    id?: number;

    /** Language name (e.g., "English", "French") */
    language: string;

    /** Speaking proficiency (1-5 scale) */
    speaking: number;

    /** Writing proficiency (1-5 scale) */
    writing: number;

    /** Presenting proficiency (1-5 scale) */
    presenting: number;

    /** Display order for sorting */
    displayOrder?: number;
}

/**
 * Validate a language proficiency value.
 * @param value - Value to validate
 * @returns True if value is between 1-5
 */
export function isValidLanguageProficiency(value: number): boolean {
    return Number.isInteger(value) &&
        value >= MIN_PROFICIENCY_LEVEL &&
        value <= MAX_PROFICIENCY_LEVEL;
}

/**
 * Validate a complete LanguageDto.
 * @param dto - DTO to validate
 * @returns Object with isValid flag and error messages
 */
export function validateLanguageDto(dto: LanguageDto): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!dto.language || dto.language.trim() === '') {
        errors.push('Language name is required');
    }

    if (!isValidLanguageProficiency(dto.speaking)) {
        errors.push(`Speaking must be between ${MIN_PROFICIENCY_LEVEL} and ${MAX_PROFICIENCY_LEVEL}`);
    }

    if (!isValidLanguageProficiency(dto.writing)) {
        errors.push(`Writing must be between ${MIN_PROFICIENCY_LEVEL} and ${MAX_PROFICIENCY_LEVEL}`);
    }

    if (!isValidLanguageProficiency(dto.presenting)) {
        errors.push(`Presenting must be between ${MIN_PROFICIENCY_LEVEL} and ${MAX_PROFICIENCY_LEVEL}`);
    }

    return { isValid: errors.length === 0, errors };
}

// Re-export constants for convenience
export {
    MIN_PROFICIENCY_LEVEL,
    MAX_PROFICIENCY_LEVEL,
    PROFICIENCY_LEVEL_LABELS,
    getProficiencyLabelByValue
};
