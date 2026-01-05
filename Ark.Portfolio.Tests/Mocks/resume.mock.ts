/**
 * @fileoverview Resume Mock Data
 * Realistic mock data for Resume/CV entity testing.
 * Uses seed data from Share layer for consistency.
 * 
 * @author Armand Richelet-Kleinberg
 */

import {
    SEED_PROFILE,
    SEED_EXPERIENCES,
    SEED_SKILLS,
    SEED_EDUCATION,
    SEED_LANGUAGES,
    SEED_HOBBIES,
    SEED_BUSINESS_DOMAINS,
    SeedExperience,
    SeedEducation,
    SeedLanguage,
    SeedHobby,
    SeedBusinessDomain
} from '@ark/portfolio-share';

/**
 * Skill level enum (mirroring Share layer)
 */
export enum MockSkillLevel {
    BEGINNER = 'Beginner',
    INTERMEDIATE = 'Intermediate',
    ADVANCED = 'Advanced',
    EXPERT = 'Expert',
    MASTER = 'Master',
}

/**
 * Mock profile interface
 */
export interface MockProfileDto {
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
 * Mock experience interface
 */
export interface MockExperienceDto {
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
 * Mock education interface
 */
export interface MockEducationDto {
    id?: number;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string | null;
    description?: string;
}

/**
 * Mock skill interface
 */
export interface MockSkillDto {
    id?: number;
    name: string;
    level: MockSkillLevel;
    category: string;
    yearsOfExperience?: number;
}

/**
 * Mock resume interface
 */
export interface MockResumeDto {
    profile: MockProfileDto;
    experiences: MockExperienceDto[];
    education: MockEducationDto[];
    skills: MockSkillDto[];
}

/**
 * Helper to parse period string to start date
 */
function parseStartDate(period: string): string {
    const monthMap: Record<string, string> = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
        'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
        'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    const parts = period.split(' - ')[0].split(' ');
    const month = monthMap[parts[0]] || '01';
    const year = parts[1] || '2020';
    return `${year}-${month}-01`;
}

/**
 * Helper to parse period string to end date
 */
function parseEndDate(period: string): string | null {
    const monthMap: Record<string, string> = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
        'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
        'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    const endPart = period.split(' - ')[1];
    if (!endPart || endPart === 'Present') return null;
    const parts = endPart.split(' ');
    const month = monthMap[parts[0]] || '01';
    const year = parts[1] || '2020';
    return `${year}-${month}-01`;
}

/**
 * Mock profile - using seed data
 */
export const MOCK_PROFILE: MockProfileDto = {
    firstName: SEED_PROFILE.firstName,
    lastName: SEED_PROFILE.lastName,
    title: SEED_PROFILE.title,
    overview: SEED_PROFILE.overview,
    email: SEED_PROFILE.email,
    linkedinUrl: SEED_PROFILE.linkedinUrl,
    githubUrl: SEED_PROFILE.githubUrl,
    avatarUrl: SEED_PROFILE.avatarUrl,
};

/**
 * Mock experience entries - using seed data
 */
export const MOCK_EXPERIENCES: MockExperienceDto[] = SEED_EXPERIENCES.map((exp: SeedExperience, index: number) => ({
    id: index + 1,
    company: exp.company,
    position: exp.role,
    description: exp.desc,
    technologies: exp.tech.split(', '),
    startDate: parseStartDate(exp.period),
    endDate: parseEndDate(exp.period),
    isHighlighted: index === 0,
}));

/**
 * Mock education entries - using seed data
 */
export const MOCK_EDUCATION: MockEducationDto[] = SEED_EDUCATION.map((edu: SeedEducation, index: number) => ({
    id: index + 1,
    institution: edu.institution,
    degree: edu.degree,
    fieldOfStudy: edu.fieldOfStudy,
    description: edu.description,
    startDate: `${edu.startYear}-09-01`,
    endDate: edu.endYear ? `${edu.endYear}-06-30` : null,
}));

/**
 * Mock skills - using seed data
 */
export const MOCK_SKILLS: MockSkillDto[] = [
    // Languages
    ...SEED_SKILLS.languages.map((name: string, i: number) => ({
        id: i + 1,
        name,
        level: MockSkillLevel.EXPERT,
        category: 'Languages',
        yearsOfExperience: 10
    })),
    // Tools
    ...SEED_SKILLS.tools.map((name: string, i: number) => ({
        id: 100 + i,
        name,
        level: MockSkillLevel.EXPERT,
        category: 'Tools',
        yearsOfExperience: 5
    })),
    // Methodologies
    ...SEED_SKILLS.methodologies.map((name: string, i: number) => ({
        id: 200 + i,
        name,
        level: MockSkillLevel.EXPERT,
        category: 'Methodologies',
        yearsOfExperience: 8
    })),
];

/**
 * Complete mock Resume
 */
export const MOCK_RESUME: MockResumeDto = {
    profile: MOCK_PROFILE,
    experiences: MOCK_EXPERIENCES,
    education: MOCK_EDUCATION,
    skills: MOCK_SKILLS,
};

/**
 * Single experience for unit tests
 */
export const MOCK_EXPERIENCE_SINGLE: MockExperienceDto = MOCK_EXPERIENCES[0];

/**
 * New experience creation data
 */
export const MOCK_EXPERIENCE_CREATE: Partial<MockExperienceDto> = {
    company: 'New Company Inc.',
    position: 'Software Developer',
    description: 'New role for testing',
    technologies: ['TypeScript', 'React'],
    startDate: '2025-01-01',
    endDate: null,
};

/**
 * Mock languages - using seed data
 */
export const MOCK_LANGUAGES = SEED_LANGUAGES;

/**
 * Mock hobbies - using seed data
 */
export const MOCK_HOBBIES = SEED_HOBBIES;

/**
 * Mock business domains - using seed data
 */
export const MOCK_BUSINESS_DOMAINS = SEED_BUSINESS_DOMAINS;
