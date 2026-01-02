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
 * Seeds the Experience table with professional work history.
 * 
 * @param dataSource - TypeORM DataSource connection
 * @returns Promise resolving when experiences are seeded
 * 
 * @remarks
 * - Checks for duplicates by company + project combination
 * - Maps 'role' field to 'position' for compatibility
 * - Maps 'desc' field to 'description' for compatibility
 * - Experience includes: company, project, position, dates, description
 */
export async function seedExperience(dataSource: DataSource): Promise<void> {
    const expRepo = dataSource.getRepository(Experience);
    const experienceData = JSON.parse(fs.readFileSync(EXPERIENCE_DATA_PATH, 'utf-8'));

    let seededCount = 0;

    for (const exp of experienceData) {
        const existing = await expRepo.findOneBy({ company: exp.company, project: exp.project });
        if (!existing) {
            const newExp = expRepo.create({
                company: exp.company,
                project: exp.project,
                position: exp.role || exp.position || 'Unknown',
                startDate: new Date(),
                endDate: null,
                description: exp.desc || exp.description
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
