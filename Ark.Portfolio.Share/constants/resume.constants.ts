/**
 * @fileoverview Resume Constants
 * Centralized constants for resume-related data.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { SkillLevel } from '../enums/skill-level.enum';

// =============================================================================
// BUSINESS DOMAIN PRESETS
// =============================================================================

/**
 * Preset list of valid business domains.
 * Used for dropdown selection and backend validation.
 * 
 * @remarks
 * Add new domains to this list as needed.
 * Backend will validate against this list.
 */
export const BUSINESS_DOMAIN_PRESETS = [
    'Logistics',
    'Finance',
    'Trading',
    'Insurance',
    'Steel Manufacturing',
    'Theatre',
    'Entertainment',
    'Music Playing',
    'Music Composing',
    'Movie Making',
    'Retail',
    'Banking',
    'Asset Management',
    'Supply Chain',
    'Healthcare',
    'E-Commerce',
    'Telecommunications',
    'Real Estate',
    'Energy',
    'Automotive',
    'Gaming',
    'Education',
    'Government',
    'Non-Profit'
] as const;

/**
 * Type for business domain values.
 */
export type BusinessDomainPreset = typeof BUSINESS_DOMAIN_PRESETS[number];

/**
 * Check if a domain is valid (in preset list).
 * @param domain - Domain to check
 * @returns True if valid
 */
export function isValidBusinessDomain(domain: string): boolean {
    return BUSINESS_DOMAIN_PRESETS.includes(domain as BusinessDomainPreset);
}

// =============================================================================
// BUSINESS DOMAIN LEVELS
// =============================================================================

/**
 * Proficiency levels for business domains.
 * Reuses SkillLevel enum for consistency.
 */
export const BUSINESS_DOMAIN_LEVELS = [
    SkillLevel.BEGINNER,
    SkillLevel.INTERMEDIATE,
    SkillLevel.ADVANCED,
    SkillLevel.EXPERT
] as const;

// =============================================================================
// LANGUAGE PROFICIENCY
// =============================================================================

/**
 * Minimum proficiency level value.
 */
export const MIN_PROFICIENCY_LEVEL = 1;

/**
 * Maximum proficiency level value.
 */
export const MAX_PROFICIENCY_LEVEL = 5;

/**
 * Labels for proficiency levels (1-5).
 */
export const PROFICIENCY_LEVEL_LABELS: Record<number, string> = {
    1: 'Basic',
    2: 'Elementary',
    3: 'Intermediate',
    4: 'Advanced',
    5: 'Native/Fluent'
};

/**
 * Get proficiency label by value.
 * @param level - Level value (1-5)
 * @returns Human-readable label
 */
export function getProficiencyLabelByValue(level: number): string {
    return PROFICIENCY_LEVEL_LABELS[level] || 'Unknown';
}

// =============================================================================
// HOBBY ICONS
// =============================================================================

/**
 * Suggested icons for hobbies (Lucide icon names).
 */
export const HOBBY_ICON_SUGGESTIONS = [
    'Music',
    'Camera',
    'Gamepad2',
    'Palette',
    'Book',
    'Dumbbell',
    'Bike',
    'Plane',
    'Coffee',
    'Film',
    'Monitor',
    'Heart',
    'Star',
    'Sun',
    'Mountain',
    'Globe',
    'Code',
    'Brush',
    'Mic',
    'Headphones'
] as const;
