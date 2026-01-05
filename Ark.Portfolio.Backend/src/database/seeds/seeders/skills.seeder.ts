/**
 * @fileoverview Skills Seeder
 * Seeds technical skills categorized by domain with proper category relationships.
 * 
 * @module database/seeds/seeders/skills.seeder
 * @author Armand Richelet-Kleinberg
 */

import { DataSource } from 'typeorm';
import { Skill } from '../../entities/skill.entity';
import { SkillCategory } from '../../entities/skill-category.entity';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Path to the skills seed data JSON file.
 */
const SKILLS_DATA_PATH = path.join(__dirname, '../../InitDbAsset/JsonDatas/skills.json');

/**
 * Category metadata for display purposes.
 */
const CATEGORY_METADATA: Record<string, { icon: string; color: string; description: string }> = {
    languages: {
        icon: 'Code',
        color: '#3B82F6',
        description: 'Programming languages'
    },
    frameworks: {
        icon: 'Layers',
        color: '#8B5CF6',
        description: 'Frameworks and libraries'
    },
    databases: {
        icon: 'Database',
        color: '#10B981',
        description: 'Database systems'
    },
    tools: {
        icon: 'Wrench',
        color: '#F59E0B',
        description: 'Development tools and platforms'
    },
    methodologies: {
        icon: 'GitBranch',
        color: '#EC4899',
        description: 'Development methodologies and practices'
    }
};

/**
 * Formats category key to display name.
 * @example 'languages' -> 'Languages', 'methodologies' -> 'Methodologies'
 */
function formatCategoryName(key: string): string {
    return key.charAt(0).toUpperCase() + key.slice(1);
}

/**
 * Seeds the Skill table with technical competencies and their categories.
 * 
 * @param dataSource - TypeORM DataSource connection
 * @returns Promise resolving when skills are seeded
 * 
 * @remarks
 * - First creates/updates skill categories
 * - Then creates skills linked to their proper categories
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
    const categoryRepo = dataSource.getRepository(SkillCategory);
    const skillsData = JSON.parse(fs.readFileSync(SKILLS_DATA_PATH, 'utf-8'));

    let seededSkillCount = 0;
    let seededCategoryCount = 0;
    let displayOrder = 0;

    // First pass: Create or find categories
    const categoryMap = new Map<string, SkillCategory>();

    for (const categoryKey of Object.keys(skillsData)) {
        const categoryName = formatCategoryName(categoryKey);
        let category = await categoryRepo.findOneBy({ name: categoryName });

        if (!category) {
            const metadata = CATEGORY_METADATA[categoryKey] || {
                icon: 'Circle',
                color: '#6B7280',
                description: `${categoryName} skills`
            };

            category = categoryRepo.create({
                name: categoryName,
                description: metadata.description,
                icon: metadata.icon,
                color: metadata.color,
                displayOrder: displayOrder++
            });
            await categoryRepo.save(category);
            seededCategoryCount++;
        }

        categoryMap.set(categoryKey, category);
    }

    if (seededCategoryCount > 0) {
        console.log(`✓ Skill categories seeded (${seededCategoryCount} new categories)`);
    } else {
        console.log(`○ Skill categories already exist, skipping`);
    }

    // Second pass: Create skills with category links
    let skillDisplayOrder = 0;
    for (const [categoryKey, skills] of Object.entries(skillsData)) {
        const category = categoryMap.get(categoryKey);

        for (const skillName of (skills as string[])) {
            const existing = await skillRepo.findOneBy({ name: skillName });
            if (!existing) {
                const skill = skillRepo.create({
                    name: skillName,
                    level: 'Expert',
                    categoryId: category?.id,
                    displayOrder: skillDisplayOrder++
                });
                await skillRepo.save(skill);
                seededSkillCount++;
            } else if (existing && !existing.categoryId && category) {
                // Update existing skill with category if missing
                existing.categoryId = category.id;
                await skillRepo.save(existing);
            }
        }
    }

    console.log(`✓ Skills seeded (${seededSkillCount} records across ${Object.keys(skillsData).length} categories)`);
}

/**
 * Clears all Skill and SkillCategory records from the database.
 * 
 * @param dataSource - TypeORM DataSource connection
 */
export async function clearSkills(dataSource: DataSource): Promise<void> {
    // Clear skills first (foreign key constraint)
    await dataSource.createQueryBuilder().delete().from(Skill).execute();
    // Then clear categories
    await dataSource.createQueryBuilder().delete().from(SkillCategory).execute();
}
