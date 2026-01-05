/**
 * @fileoverview Resume Tab Types
 * Enum and types for Resume Manager tabs.
 * 
 * @author Armand Richelet-Kleinberg
 */

/**
 * Tab keys for the Resume Manager admin interface.
 */
export enum ResumeTabEnum {
    PROFILE = 'profile',
    EXPERIENCE = 'experience',
    EDUCATION = 'education',
    SKILLS = 'skills',
    LANGUAGES = 'languages',
    HOBBIES = 'hobbies',
    BUSINESS_DOMAINS = 'business-domains',
    AI_SETTINGS = 'ai-settings'
}

/**
 * Type alias for resume tab values.
 * Use this for component props and state.
 */
export type ResumeTab =
    | 'profile'
    | 'experience'
    | 'education'
    | 'skills'
    | 'languages'
    | 'hobbies'
    | 'business-domains'
    | 'ai-settings';

/**
 * Tab configuration interface.
 */
export interface ResumeTabConfig {
    key: ResumeTab;
    label: string;
    icon?: React.ReactNode;
}

/**
 * Check if a string is a valid ResumeTab.
 * @param value - Value to check
 * @returns True if valid tab key
 */
export function isValidResumeTab(value: string): value is ResumeTab {
    return Object.values(ResumeTabEnum).includes(value as ResumeTabEnum);
}
