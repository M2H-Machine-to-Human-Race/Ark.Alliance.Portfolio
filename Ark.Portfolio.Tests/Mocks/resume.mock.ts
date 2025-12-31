/**
 * @fileoverview Resume Mock Data
 * Realistic mock data for Resume/CV entity testing.
 * Uses inline types to avoid Share layer compilation issues.
 * 
 * @author Armand Richelet-Kleinberg
 */

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
 * Mock profile
 */
export const MOCK_PROFILE: MockProfileDto = {
    firstName: 'Armand',
    lastName: 'Richelet-Kleinberg',
    title: 'Senior Software Engineer',
    overview: 'Experienced full-stack developer specializing in React, TypeScript, and Node.js.',
    email: 'armand@example.com',
    linkedinUrl: 'https://linkedin.com/in/armand',
    githubUrl: 'https://github.com/armand',
    avatarUrl: '/images/profile.jpg',
    phoneNumber: '+41 79 123 4567',
    location: 'Geneva, Switzerland',
};

/**
 * Mock experience entries
 */
export const MOCK_EXPERIENCES: MockExperienceDto[] = [
    {
        id: 1,
        company: 'Ark Alliance Limited',
        position: 'Senior Software Engineer',
        description: 'Leading development of cryptocurrency trading platforms.',
        technologies: ['TypeScript', 'Node.js', 'React', 'PostgreSQL'],
        startDate: '2022-03-01',
        endDate: null,
        isHighlighted: true,
    },
    {
        id: 2,
        company: 'Tech Innovators SA',
        position: 'Full Stack Developer',
        description: 'Developed enterprise web applications using React and .NET.',
        technologies: ['React', 'C#', '.NET', 'Azure'],
        startDate: '2019-06-15',
        endDate: '2022-02-28',
        isHighlighted: false,
    },
    {
        id: 3,
        company: 'StartupXYZ',
        position: 'Junior Developer',
        description: 'Built MVP for fintech startup.',
        technologies: ['JavaScript', 'Express', 'MongoDB'],
        startDate: '2017-09-01',
        endDate: '2019-06-01',
        isHighlighted: false,
    },
];

/**
 * Mock education entries
 */
export const MOCK_EDUCATION: MockEducationDto[] = [
    {
        id: 1,
        institution: 'Swiss Federal Institute of Technology (ETH Zürich)',
        degree: 'Master of Science',
        fieldOfStudy: 'Computer Science',
        description: 'Specialized in Distributed Systems and Machine Learning.',
        startDate: '2015-09-01',
        endDate: '2017-07-15',
    },
    {
        id: 2,
        institution: 'University of Geneva',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        description: 'Core curriculum in algorithms and data structures.',
        startDate: '2012-09-01',
        endDate: '2015-06-30',
    },
];

/**
 * Mock skills
 */
export const MOCK_SKILLS: MockSkillDto[] = [
    { id: 1, name: 'TypeScript', level: MockSkillLevel.EXPERT, category: 'Languages', yearsOfExperience: 6 },
    { id: 2, name: 'JavaScript', level: MockSkillLevel.EXPERT, category: 'Languages', yearsOfExperience: 8 },
    { id: 3, name: 'Python', level: MockSkillLevel.ADVANCED, category: 'Languages', yearsOfExperience: 4 },
    { id: 4, name: 'C#', level: MockSkillLevel.INTERMEDIATE, category: 'Languages', yearsOfExperience: 3 },
    { id: 5, name: 'React', level: MockSkillLevel.EXPERT, category: 'Frontend', yearsOfExperience: 5 },
    { id: 6, name: 'Vue.js', level: MockSkillLevel.ADVANCED, category: 'Frontend', yearsOfExperience: 2 },
    { id: 7, name: 'Node.js', level: MockSkillLevel.EXPERT, category: 'Backend', yearsOfExperience: 6 },
    { id: 8, name: 'Express', level: MockSkillLevel.EXPERT, category: 'Backend', yearsOfExperience: 6 },
    { id: 9, name: 'PostgreSQL', level: MockSkillLevel.ADVANCED, category: 'Database', yearsOfExperience: 4 },
    { id: 10, name: 'MongoDB', level: MockSkillLevel.ADVANCED, category: 'Database', yearsOfExperience: 3 },
    { id: 11, name: 'Docker', level: MockSkillLevel.ADVANCED, category: 'DevOps', yearsOfExperience: 4 },
    { id: 12, name: 'Kubernetes', level: MockSkillLevel.INTERMEDIATE, category: 'DevOps', yearsOfExperience: 2 },
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
