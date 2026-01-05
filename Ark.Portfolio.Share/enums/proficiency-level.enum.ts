/**
 * @fileoverview Proficiency Level Enum
 * Represents proficiency levels on a 1-5 scale for language skills.
 * 
 * @author Armand Richelet-Kleinberg
 */

/**
 * Language proficiency level enumeration.
 * Used for speaking, writing, and presenting abilities.
 * 
 * @remarks
 * Values are integers from 1-5 for easy storage and comparison.
 * Use PROFICIENCY_LABELS for display text.
 */
export enum ProficiencyLevel {
    /** Basic understanding, limited practical ability */
    BASIC = 1,
    /** Elementary level, can handle simple situations */
    ELEMENTARY = 2,
    /** Intermediate level, can handle most situations */
    INTERMEDIATE = 3,
    /** Advanced level, can handle complex situations */
    ADVANCED = 4,
    /** Native or fully fluent */
    NATIVE = 5
}

/**
 * Human-readable labels for proficiency levels.
 * Use for display in UI.
 */
export const PROFICIENCY_LABELS: Record<ProficiencyLevel, string> = {
    [ProficiencyLevel.BASIC]: 'Basic',
    [ProficiencyLevel.ELEMENTARY]: 'Elementary',
    [ProficiencyLevel.INTERMEDIATE]: 'Intermediate',
    [ProficiencyLevel.ADVANCED]: 'Advanced',
    [ProficiencyLevel.NATIVE]: 'Native/Fluent'
};

/**
 * Get label for a proficiency level value.
 * @param level - Proficiency level (1-5)
 * @returns Human-readable label
 */
export function getProficiencyLabel(level: number): string {
    return PROFICIENCY_LABELS[level as ProficiencyLevel] || 'Unknown';
}

/**
 * Validate that a value is a valid proficiency level.
 * @param value - Value to validate
 * @returns True if valid (1-5), false otherwise
 */
export function isValidProficiencyLevel(value: number): boolean {
    return Number.isInteger(value) && value >= 1 && value <= 5;
}
