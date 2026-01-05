/**
 * @fileoverview Projects Seeder
 * Seeds portfolio projects with full relational data (pages, features, technologies).
 * 
 * @module database/seeds/seeders/projects.seeder
 * @author Armand Richelet-Kleinberg
 */

import { DataSource } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { ProjectTechnology } from '../../entities/project-technology.entity';
import { ProjectPage } from '../../entities/project-page.entity';
import { ProjectFeature } from '../../entities/project-feature.entity';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Path to the projects seed data JSON file.
 */
const PROJECTS_DATA_PATH = path.join(__dirname, '../../InitDbAsset/ProjectData/projects.json');

/**
 * Seeds the Project table with portfolio projects and related entities.
 * 
 * @param dataSource - TypeORM DataSource connection
 * @returns Promise resolving when projects are seeded
 * 
 * @remarks
 * This seeder handles the complete project hierarchy:
 * - **Project**: Main project entity (title, description, status, imageUrl, repoUrl)
 * - **ProjectPage**: Multi-page documentation (overview, architecture, technical, etc.)
 * - **ProjectFeature**: Feature highlights with icons
 * - **ProjectTechnology**: Technology tags (React, TypeScript, etc.)
 * 
 * @example Project JSON structure:
 * ```json
 * {
 *   "title": "Project Name",
 *   "description": "...",
 *   "status": "Featured",
 *   "imageUrl": "/Assets/Projects/...",
 *   "technologies": ["React", "TypeScript"],
 *   "features": [{ "title": "...", "description": "...", "icon": "..." }],
 *   "pages": [{ "title": "Overview", "type": "OVERVIEW", "content": "..." }]
 * }
 * ```
 */
export async function seedProjects(dataSource: DataSource): Promise<void> {
    const projectRepo = dataSource.getRepository(Project);
    const techRepo = dataSource.getRepository(ProjectTechnology);
    const pageRepo = dataSource.getRepository(ProjectPage);
    const featureRepo = dataSource.getRepository(ProjectFeature);

    // Load individual project JSON files for better maintainability
    const projectFiles = [
        'ark-alliance.json',
        'ark-portfolio.json',
        'react-component-ui.json',
        'trading-providers-lib.json',
        'trends-calculator.json'
    ];

    const projectsData = projectFiles.map(filename => {
        const filePath = path.join(__dirname, '../../InitDbAsset/ProjectData', filename);
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        return null;
    }).filter(p => p !== null);

    let seededCount = 0;

    for (const pData of projectsData) {
        let project = await projectRepo.findOneBy({ title: pData.title });

        if (!project) {
            // Create main project
            project = projectRepo.create({
                title: pData.title,
                description: pData.description,
                status: pData.status,
                imageUrl: pData.imageUrl,
                repoUrl: pData.repoUrl,
                demoUrl: pData.demoUrl,
                packageUrl: pData.packageUrl
            });
            await projectRepo.save(project);

            // Seed Project Pages
            if (pData.pages) {
                for (const pg of pData.pages) {
                    const page = pageRepo.create({
                        ...pg,
                        project: project
                    });
                    await pageRepo.save(page);
                }
            }

            // Seed Project Features
            if (pData.features) {
                for (const feat of pData.features) {
                    const feature = featureRepo.create({
                        ...feat,
                        project: project
                    });
                    await featureRepo.save(feature);
                }
            }

            // Seed Project Technologies
            if (pData.technologies) {
                for (const tech of pData.technologies) {
                    const newTech = techRepo.create({
                        projectId: project.id,
                        technology: tech
                    });
                    await techRepo.save(newTech);
                }
            }

            seededCount++;
        }
    }

    console.log(`✓ Projects seeded (${seededCount} projects with pages, features, technologies)`);
}

/**
 * Clears all Project-related records from the database.
 * Clears in reverse order of dependencies.
 * 
 * @param dataSource - TypeORM DataSource connection
 */
export async function clearProjects(dataSource: DataSource): Promise<void> {
    await dataSource.createQueryBuilder().delete().from(ProjectTechnology).execute();
    await dataSource.createQueryBuilder().delete().from(ProjectFeature).execute();
    await dataSource.createQueryBuilder().delete().from(ProjectPage).execute();
    await dataSource.createQueryBuilder().delete().from(Project).execute();
}
