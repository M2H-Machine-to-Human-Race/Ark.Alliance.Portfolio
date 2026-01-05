/**
 * @fileoverview Experience Seeder
 * Seeds professional work experience records for the resume/CV.
 * 
 * @module database/seeds/seeders/experience.seeder
 * @author Armand Richelet-Kleinberg
 */

import { DataSource } from 'typeorm';
import { Experience } from '../../entities/experience.entity';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Path to the experience seed data JSON file.
 */
const EXPERIENCE_DATA_PATH = path.join(__dirname, '../../InitDbAsset/JsonDatas/experience.json');

/**
 * Month name to number mapping.
 */
const MONTH_MAP: Record<string, string> = {
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
    'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
    'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
};

/**
 * Parses a period string to extract start and end dates.
 * 
 * @param period - Period string (e.g., "Dec 2022 - Present", "Jan 2021 - Feb 2025")
 * @returns Object with startDate and endDate (null if "Present")
 * 
 * @example
 * parsePeriod("Dec 2022 - Present") -> { startDate: "2022-12-01", endDate: null }
 * parsePeriod("Jan 2021 - Feb 2025") -> { startDate: "2021-01-01", endDate: "2025-02-01" }
 */
function parsePeriod(period: string): { startDate: string; endDate: string | null } {
    const parts = period.split(' - ');

    // Parse start date
    const startParts = parts[0].trim().split(' ');
    const startMonth = MONTH_MAP[startParts[0]] || '01';
    const startYear = startParts[1] || '2020';
    const startDate = `${startYear}-${startMonth}-01`;

    // Parse end date
    let endDate: string | null = null;
    if (parts[1] && parts[1].trim() !== 'Present') {
        const endParts = parts[1].trim().split(' ');
        const endMonth = MONTH_MAP[endParts[0]] || '01';
        const endYear = endParts[1] || '2020';
        endDate = `${endYear}-${endMonth}-01`;
    }

    return { startDate, endDate };
}

/**
 * Parses technologies string to array.
 * 
 * @param tech - Comma-separated technology string
 * @returns Array of technology names, trimmed
 */
function parseTechnologies(tech: string): string[] {
    if (!tech) return [];
    return tech.split(',').map(t => t.trim()).filter(t => t.length > 0);
}

/**
 * Seeds the Experience table with professional work history.
 * 
 * @param dataSource - TypeORM DataSource connection
 * @returns Promise resolving when experiences are seeded
 * 
 * @remarks
 * - Checks for duplicates by company + project combination
 * - Parses 'period' field to extract startDate and endDate
 * - Parses 'tech' field to create technologies array
 * - Maps 'role' field to 'position' for compatibility
 * - Maps 'desc' field to 'description' for compatibility
 */
export async function seedExperience(dataSource: DataSource): Promise<void> {
    const expRepo = dataSource.getRepository(Experience);
    const experienceData = JSON.parse(fs.readFileSync(EXPERIENCE_DATA_PATH, 'utf-8'));

    let seededCount = 0;
    let displayOrder = 0;

    for (const exp of experienceData) {
        const existing = await expRepo.findOneBy({ company: exp.company, project: exp.project });
        if (!existing) {
            // Parse period to dates
            const { startDate, endDate } = parsePeriod(exp.period || 'Jan 2020 - Present');

            // Parse technologies
            const technologies = parseTechnologies(exp.tech || '');

            const newExp = expRepo.create({
                company: exp.company,
                project: exp.project,
                position: exp.role || exp.position || 'Unknown',
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                description: exp.desc || exp.description,
                technologies: technologies,
                displayOrder: displayOrder++,
                isHighlighted: displayOrder === 1 // Highlight first experience
            });
            await expRepo.save(newExp);
            seededCount++;
        }
    }

    console.log(`✓ Experience seeded (${seededCount} records)`);
}

/**
 * Clears all Experience records from the database.
 * 
 * @param dataSource - TypeORM DataSource connection
 */
export async function clearExperience(dataSource: DataSource): Promise<void> {
    await dataSource.createQueryBuilder().delete().from(Experience).execute();
}
