/**
 * @fileoverview Database Seed Orchestrator
 * Main entry point for database seeding operations.
 * Coordinates all domain-specific seeders in the correct order.
 * 
 * @module database/seeds/seed
 * @author Armand Richelet-Kleinberg
 * 
 * @description
 * This module provides the main seeding functionality for initializing the database
 * with default data. It orchestrates multiple domain-specific seeders to populate:
 * 
 * - **Profile**: Portfolio owner's personal information
 * - **Experience**: Professional work history (8 records)
 * - **Skills**: Technical competencies (40+ technologies across 5 categories)
 * - **Carousel**: Homepage slider items (4 featured projects)
 * - **Media**: Asset references for admin management (5 default images)
 * - **Projects**: Portfolio projects with pages, features, and technologies (3 projects)
 * 
 * @example Running as CLI:
 * ```bash
 * npx ts-node src/database/seeds/seed.ts
 * ```
 * 
 * @example Programmatic usage:
 * ```typescript
 * import { seedDatabase, runSeed } from './database/seeds/seed';
 * 
 * // With existing DataSource
 * await seedDatabase(dataSource);
 * 
 * // Full reset and reseed
 * await runSeed();
 * ```
 */

import { DataSource } from 'typeorm';
import { AppDataSource } from '../../config/database';

// Import all seeders
import {
    seedProfile,
    seedExperience,
    seedSkills,
    seedEducation,
    seedLanguages,
    seedHobbies,
    seedBusinessDomains,
    seedCarousel,
    seedMedia,
    seedTechnologies,
    seedProjects,
    seedThemes,
    clearProfile,
    clearExperience,
    clearSkills,
    clearEducation,
    clearLanguages,
    clearHobbies,
    clearBusinessDomains,
    clearCarousel,
    clearMedia,
    clearTechnologies,
    clearProjects,
    clearThemes
} from './seeders';

/**
 * Seeds the database with initial data from all domain seeders.
 * 
 * @param dataSource - TypeORM DataSource connection
 * @returns Promise resolving when all seeding is complete
 * 
 * @remarks
 * Seeding order is important due to potential dependencies:
 * 1. Profile (standalone, no dependencies)
 * 2. Experience (standalone, no dependencies)
 * 3. Skills (standalone, no dependencies)
 * 4. Carousel (references project images)
 * 5. Media (references asset files)
 * 6. Technologies (master data, referenced by projects)
 * 7. Projects (references technologies)
 * 
 * Each seeder checks for existing data before inserting to prevent duplicates.
 */
export const seedDatabase = async (dataSource: DataSource): Promise<void> => {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║           Database Seeding - Ark.Portfolio                 ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');

    // 1. Profile & Identity
    console.log('─── Profile & Identity ───');
    await seedProfile(dataSource);

    // 2. Resume/CV Components
    console.log('');
    console.log('─── Resume Components ───');
    await seedExperience(dataSource);
    await seedSkills(dataSource);
    await seedEducation(dataSource);
    await seedLanguages(dataSource);
    await seedHobbies(dataSource);
    await seedBusinessDomains(dataSource);

    // 3. Content & Media
    console.log('');
    console.log('─── Content & Media ───');
    await seedCarousel(dataSource);
    await seedMedia(dataSource);

    // 4. Master Data
    console.log('');
    console.log('─── Master Data ───');
    await seedTechnologies(dataSource);

    // 5. Themes
    console.log('');
    console.log('─── Themes ───');
    await seedThemes(dataSource);

    // 6. Portfolio Projects
    console.log('');
    console.log('─── Portfolio Projects ───');
    await seedProjects(dataSource);

    console.log('');
    console.log('════════════════════════════════════════════════════════════');
    console.log('  ✅ All seed data loaded successfully');
    console.log('════════════════════════════════════════════════════════════');
};

/**
 * Clears all seeded data from the database.
 * Clears in reverse order of dependencies to respect foreign key constraints.
 * 
 * @param dataSource - TypeORM DataSource connection
 * @returns Promise resolving when all data is cleared
 */
export const clearDatabase = async (dataSource: DataSource): Promise<void> => {
    console.log('Clearing existing data...');

    // Clear in reverse order of dependencies
    await clearProjects(dataSource);       // ProjectTechnology, ProjectFeature, ProjectPage, Project
    await clearThemes(dataSource);         // Theme (standalone)
    await clearTechnologies(dataSource);   // Technology (master data)
    await clearMedia(dataSource);          // Media
    await clearCarousel(dataSource);       // CarouselItem
    await clearBusinessDomains(dataSource); // BusinessDomain
    await clearHobbies(dataSource);        // Hobby
    await clearLanguages(dataSource);      // Language
    await clearEducation(dataSource);      // Education
    await clearSkills(dataSource);         // Skill
    await clearExperience(dataSource);     // Experience
    await clearProfile(dataSource);        // Profile

    console.log('✓ Database cleared');
};

/**
 * Full reset and reseed operation.
 * Initializes DataSource, clears existing data, seeds fresh data, and closes connection.
 * 
 * @returns Promise resolving when operation is complete
 * 
 * @remarks
 * This is the main entry point for CLI execution.
 * It handles:
 * - DataSource initialization
 * - Full data clear (in dependency order)
 * - Fresh seed of all data
 * - Proper connection cleanup
 * 
 * @throws Will throw an error if seeding fails, after logging the error
 */
export const runSeed = async (): Promise<void> => {
    const dataSource = await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
    console.log('');

    try {
        // Clear all existing data
        await clearDatabase(dataSource);
        console.log('');

        // Seed fresh data
        await seedDatabase(dataSource);

        console.log('');
        console.log('Database seeding process finished.');
    } catch (error) {
        console.error('Seeding failed:', error);
        throw error;
    } finally {
        await dataSource.destroy();
    }
};

// Check if file is run directly (CLI)
if (require.main === module) {
    runSeed().catch(error => {
        console.error('Fatal error during seeding:', error);
        process.exit(1);
    });
}
