import { DataSource } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { Profile } from '../entities/profile.entity';
import { Project } from '../entities/project.entity';
import { ProjectTechnology } from '../entities/project-technology.entity';
import { ProjectPage } from '../entities/project-page.entity';
import { ProjectFeature } from '../entities/project-feature.entity';
import { ProjectController } from '../entities/project-controller.entity';
import { ProjectEndpoint } from '../entities/project-endpoint.entity';
import { Experience } from '../entities/experience.entity';
import { Skill } from '../entities/skill.entity';
import * as fs from 'fs';
import * as path from 'path';

export const seedDatabase = async (dataSource: DataSource) => {
    console.log('Seeding database from JSON assets...');

    // Paths
    const jsonPath = path.join(__dirname, '../../database/InitDbAsset/JsonDatas');
    const projectPath = path.join(__dirname, '../../database/InitDbAsset/ProjectData');

    // Read Data
    const profileData = JSON.parse(fs.readFileSync(path.join(jsonPath, 'profile.json'), 'utf-8'));
    const experienceData = JSON.parse(fs.readFileSync(path.join(jsonPath, 'experience.json'), 'utf-8'));
    const skillsData = JSON.parse(fs.readFileSync(path.join(jsonPath, 'skills.json'), 'utf-8'));
    const projectsData = JSON.parse(fs.readFileSync(path.join(projectPath, 'projects.json'), 'utf-8'));

    // 1. Seed Profile
    const profileRepo = dataSource.getRepository(Profile);
    if (await profileRepo.count() === 0) {
        const profile = new Profile();
        Object.assign(profile, profileData);
        await profileRepo.save(profile);
        console.log('Profile seeded');
    }

    // 2. Seed Experience
    const expRepo = dataSource.getRepository(Experience);
    for (const exp of experienceData) {
        const existing = await expRepo.findOneBy({ company: exp.company, project: exp.project });
        if (!existing) {
            const newExp = expRepo.create({
                company: exp.company,
                project: exp.project,
                position: exp.role || exp.position || 'Unknown', // Map role to position
                startDate: new Date(),
                endDate: null,
                description: exp.desc || exp.description
            });
            await expRepo.save(newExp);
        }
    }
    console.log('Experience seeded');

    // 3. Seed Skills
    const skillRepo = dataSource.getRepository(Skill);
    for (const [categoryName, skills] of Object.entries(skillsData)) {
        for (const skillName of (skills as string[])) {
            const existing = await skillRepo.findOneBy({ name: skillName });
            if (!existing) {
                const skill = skillRepo.create({
                    name: skillName,
                    level: 'Expert' // Default level
                    // Note: categoryId would need to be set if categories are created first
                });
                await skillRepo.save(skill);
            }
        }
    }
    console.log('Skills seeded');

    // 4. Seed Projects (Deep)
    const projectRepo = dataSource.getRepository(Project);
    const techRepo = dataSource.getRepository(ProjectTechnology);

    for (const pData of projectsData) {
        let project = await projectRepo.findOneBy({ title: pData.title });
        if (!project) {
            project = projectRepo.create({
                title: pData.title,
                description: pData.description,
                status: pData.status,
                imageUrl: pData.imageUrl,
                repoUrl: pData.repoUrl,
                demoUrl: pData.demoUrl
                // startDate/endDate skipped for now
            });
            await projectRepo.save(project);

            // Pages
            if (pData.pages) {
                const pageRepo = dataSource.getRepository(ProjectPage);
                for (const pg of pData.pages) {
                    const page = pageRepo.create({
                        ...pg,
                        project: project
                    });
                    await pageRepo.save(page);
                }
            }

            // Features
            if (pData.features) {
                const featureRepo = dataSource.getRepository(ProjectFeature);
                for (const feat of pData.features) {
                    const feature = featureRepo.create({
                        ...feat,
                        project: project
                    });
                    await featureRepo.save(feature);
                }
            }

            // Technologies
            if (pData.technologies) {
                for (const tech of pData.technologies) {
                    // Check composite key manually or just insert ignoring dups
                    const newTech = techRepo.create({
                        projectId: project.id, // Now matching string type
                        technology: tech
                    });
                    await techRepo.save(newTech);
                }
            }
        }
    }
    console.log('Projects seeded');
};

// Wrapper function to initialize DataSource and call seedDatabase
// Exported for potential use, but mainly for CLI execution
export const runSeed = async () => {
    const dataSource = await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    try {
        // Clear existing data (in reverse order of dependencies)
        await dataSource.createQueryBuilder().delete().from(ProjectTechnology).execute();
        await dataSource.createQueryBuilder().delete().from(ProjectFeature).execute();
        await dataSource.createQueryBuilder().delete().from(ProjectPage).execute();
        await dataSource.createQueryBuilder().delete().from(Project).execute();
        await dataSource.createQueryBuilder().delete().from(Experience).execute();
        await dataSource.createQueryBuilder().delete().from(Skill).execute();
        await dataSource.createQueryBuilder().delete().from(Profile).execute();

        await seedDatabase(dataSource);
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

