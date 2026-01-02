/**
 * @fileoverview Skills Seeder
 * Seeds technical skills categorized by domain.
 * 
 * @module database/seeds/seeders/skills.seeder
 * @author Armand Richelet-Kleinberg
 */

import { DataSource } from 'typeorm';
import { Skill } from '../../entities/skill.entity';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Path to the skills seed data JSON file.
 */
const SKILLS_DATA_PATH = path.join(__dirname, '../../InitDbAsset/JsonDatas/skills.json');

/**
 * Seeds the Skill table with technical competencies.
 * 
 * @param dataSource - TypeORM DataSource connection
 * @returns Promise resolving when skills are seeded
 * 
 * @remarks
 * - Skills are organized by category (languages, frameworks, databases, etc.)
 * - Defaults all skills to 'Expert' level
 * - Prevents duplicate skill names
 * 
 * @example JSON structure:
 * ```json
 * {
 *   "languages": ["C#", "Python", "TypeScript"],
 *   "frameworks": [".NET", "React", "Node.js"],
 *   "databases": ["PostgreSQL", "MongoDB"]
 * }
 * ```
 */
export async function seedSkills(dataSource: DataSource): Promise<void> {
    const skillRepo = dataSource.getRepository(Skill);
    const skillsData = JSON.parse(fs.readFileSync(SKILLS_DATA_PATH, 'utf-8'));

    let seededCount = 0;

    for (const [categoryName, skills] of Object.entries(skillsData)) {
        for (const skillName of (skills as string[])) {
            const existing = await skillRepo.findOneBy({ name: skillName });
            if (!existing) {
                const skill = skillRepo.create({
                    name: skillName,
                    level: 'Expert'
                    // Note: categoryId would need to be set if categories are created first
                });
                await skillRepo.save(skill);
                seededCount++;
            }
        }
    }

    console.log(`✓ Skills seeded (${seededCount} records across ${Object.keys(skillsData).length} categories)`);
}

/**
 * Clears all Skill records from the database.
 * 
 * @param dataSource - TypeORM DataSource connection
 */
export async function clearSkills(dataSource: DataSource): Promise<void> {
    await dataSource.createQueryBuilder().delete().from(Skill).execute();
}
