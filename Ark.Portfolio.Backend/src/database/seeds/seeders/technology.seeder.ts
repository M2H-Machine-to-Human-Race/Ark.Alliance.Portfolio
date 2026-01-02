/**
 * @fileoverview Technology Seeder
 * Seeds the master technology table with comprehensive technology data.
 * 
 * @module database/seeds/seeders/technology.seeder
 * @author Armand Richelet-Kleinberg
 * 
 * @description
 * This seeder populates the Technology table with 90+ technologies
 * organized by category. Technologies include rich metadata for UI
 * rendering: icons, colors, descriptions, and website links.
 * 
 * Categories:
 * - frontend: React, Angular, Vue, etc.
 * - languages: TypeScript, Python, C#, etc.
 * - runtimes: Node.js, .NET, Unity, etc.
 * - backend: Express, NestJS, FastAPI, etc.
 * - databases: PostgreSQL, MongoDB, Redis, etc.
 * - cloud: AWS, Azure, GCP, etc.
 * - devops: Docker, Kubernetes, Terraform, etc.
 * - messaging: RabbitMQ, Kafka, etc.
 * - ai: PyTorch, OpenAI, Anthropic, etc.
 * - enterprise: SAP, Salesforce, etc.
 * - patterns: Microservices, CQRS, DDD, etc.
 * - apis: Binance, Stripe, Twilio, etc.
 * - testing: Jest, Cypress, Playwright, etc.
 * - mobile: React Native, Flutter, Swift, etc.
 * - styling: TailwindCSS, Sass, Bootstrap, etc.
 */

import { DataSource } from 'typeorm';
import { Technology } from '../../entities/technology.entity';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Path to the technologies seed data JSON file.
 */
const TECHNOLOGIES_DATA_PATH = path.join(__dirname, '../../InitDbAsset/JsonDatas/technologies.json');

/**
 * Seeds the Technology table with master technology data.
 * 
 * @param dataSource - TypeORM DataSource connection
 * @returns Promise resolving when technologies are seeded
 * 
 * @remarks
 * - Checks if technology key already exists before inserting
 * - Reads from technologies.json in InitDbAsset/JsonDatas
 * - Each technology includes: key, name, label, category, description, icon, color, website
 */
export async function seedTechnologies(dataSource: DataSource): Promise<void> {
    const techRepo = dataSource.getRepository(Technology);

    if (!fs.existsSync(TECHNOLOGIES_DATA_PATH)) {
        console.log('○ Technologies data file not found, skipping');
        return;
    }

    const data = JSON.parse(fs.readFileSync(TECHNOLOGIES_DATA_PATH, 'utf-8'));
    const technologies = data.technologies;

    if (!technologies || technologies.length === 0) {
        console.log('○ No technologies found in data file');
        return;
    }

    let seededCount = 0;
    let skippedCount = 0;

    for (const tech of technologies) {
        const existing = await techRepo.findOneBy({ key: tech.key });

        if (!existing) {
            const technology = techRepo.create({
                key: tech.key,
                name: tech.name,
                label: tech.label || tech.name,
                category: tech.category,
                description: tech.description,
                icon: tech.icon,
                color: tech.color,
                website: tech.website,
                versions: tech.versions,
                order: tech.order || 0,
                isActive: true
            });
            await techRepo.save(technology);
            seededCount++;
        } else {
            skippedCount++;
        }
    }

    console.log(`✓ Technologies seeded (${seededCount} new, ${skippedCount} existing)`);
}

/**
 * Clears all Technology records from the database.
 * 
 * @param dataSource - TypeORM DataSource connection
 * 
 * @remarks
 * ProjectTechnology records referencing technologies will be CASCADE deleted
 * if properly configured with foreign keys.
 */
export async function clearTechnologies(dataSource: DataSource): Promise<void> {
    await dataSource.createQueryBuilder().delete().from(Technology).execute();
}
