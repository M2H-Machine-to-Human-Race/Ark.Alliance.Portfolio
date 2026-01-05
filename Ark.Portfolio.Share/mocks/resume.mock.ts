/**
 * @fileoverview Resume Mock Data
 * Mock data for Resume matching backend seed data.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { ResumeDto } from '../dtos/resume.dto';
import { SkillLevel } from '../enums/skill-level.enum';
import { SEED_PROFILE, SEED_EXPERIENCES, SEED_SKILLS } from './seed-data';

/**
 * Helper to parse period string to start date.
 * E.g., "Dec 2022 - Present" -> "2022-12-01"
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
 * Helper to parse period string to end date.
 * Returns undefined if "Present"
 */
function parseEndDate(period: string): string | undefined {
    const monthMap: Record<string, string> = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
        'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
        'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    const endPart = period.split(' - ')[1];
    if (!endPart || endPart === 'Present') return undefined;
    const parts = endPart.split(' ');
    const month = monthMap[parts[0]] || '01';
    const year = parts[1] || '2020';
    return `${year}-${month}-01`;
}

/**
 * Resume mock using centralized seed data.
 * Matches: InitDbAsset/JsonDatas/profile.json, experience.json, skills.json
 */
export const RESUME_MOCK: ResumeDto = {
    profile: {
        firstName: SEED_PROFILE.firstName,
        lastName: SEED_PROFILE.lastName,
        title: SEED_PROFILE.title,
        overview: SEED_PROFILE.overview,
        email: SEED_PROFILE.email,
        linkedinUrl: SEED_PROFILE.linkedinUrl,
        githubUrl: SEED_PROFILE.githubUrl
    },
    experiences: SEED_EXPERIENCES.map(exp => ({
        company: exp.company,
        position: exp.role,
        startDate: parseStartDate(exp.period),
        endDate: parseEndDate(exp.period),
        description: exp.desc,
        technologies: exp.tech.split(', ')
    })),
    skills: [
        // Languages
        ...SEED_SKILLS.languages.map(name => ({ name, category: 'Languages', level: SkillLevel.EXPERT })),
        // Frameworks
        ...SEED_SKILLS.frameworks.map(name => ({ name, category: 'Frameworks', level: SkillLevel.EXPERT })),
        // Databases
        ...SEED_SKILLS.databases.map(name => ({ name, category: 'Databases', level: SkillLevel.EXPERT })),
        // Tools
        ...SEED_SKILLS.tools.map(name => ({ name, category: 'Tools', level: SkillLevel.EXPERT })),
        // Methodologies
        ...SEED_SKILLS.methodologies.map(name => ({ name, category: 'Methodologies', level: SkillLevel.EXPERT }))
    ],
    education: [
        {
            degree: "Master in Computer Science",
            institution: "ULB (Université Libre de Bruxelles)",
            startDate: "1999-09-01",
            endDate: "2004-06-30",
            fieldOfStudy: "Computer Science",
            description: "Specialization in Algorithmic and Software Engineering."
        }
    ]
};

// Backwards compatibility if needed, but per request we avoid obsolete elements.
