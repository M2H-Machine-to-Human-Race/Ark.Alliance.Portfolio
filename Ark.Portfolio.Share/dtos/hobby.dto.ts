/**
 * @fileoverview Hobby DTO
 * Data transfer object for hobbies and interests.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { HOBBY_ICON_SUGGESTIONS } from '../constants/resume.constants';

/**
 * Represents a hobby or personal interest.
 */
export interface HobbyDto {
    /** Unique identifier */
    id?: number;

    /** Hobby name */
    name: string;

    /** Description of the hobby */
    description?: string;

    /** Lucide icon name for visual representation */
    icon?: string;

    /** Display order for sorting */
    displayOrder?: number;
}

/**
 * Validate a complete HobbyDto.
 * @param dto - DTO to validate
 * @returns Object with isValid flag and error messages
 */
export function validateHobbyDto(dto: HobbyDto): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!dto.name || dto.name.trim() === '') {
        errors.push('Hobby name is required');
    } else if (dto.name.length > 100) {
        errors.push('Hobby name must be 100 characters or less');
    }

    if (dto.description && dto.description.length > 500) {
        errors.push('Description must be 500 characters or less');
    }

    return { isValid: errors.length === 0, errors };
}

// Re-export icon suggestions for convenience
export { HOBBY_ICON_SUGGESTIONS };
