/**
 * @fileoverview Business Domains Seeder
 * Seeds business domain knowledge records for the resume/CV.
 * 
 * @module database/seeds/seeders/business-domains.seeder
 * @author Armand Richelet-Kleinberg
 */

import { DataSource } from 'typeorm';
import { BusinessDomain, BUSINESS_DOMAIN_PRESETS } from '../../entities/business-domain.entity';
import * as fs from 'fs';
import * as path from 'path';

const DOMAINS_DATA_PATH = path.join(__dirname, '../../InitDbAsset/JsonDatas/business-domains.json');

/**
 * Validates that domain is from the preset list.
 * Returns the domain if valid, or null if invalid.
 */
function validateDomain(domain: string): string | null {
    const isValid = BUSINESS_DOMAIN_PRESETS.includes(domain as any);
    if (!isValid) {
        console.warn(`⚠ Business domain "${domain}" is not in preset list, but will be added anyway.`);
    }
    return domain;
}

/**
 * Seeds the BusinessDomain table with expertise areas.
 */
export async function seedBusinessDomains(dataSource: DataSource): Promise<void> {
    const domainRepo = dataSource.getRepository(BusinessDomain);
    const domainsData = JSON.parse(fs.readFileSync(DOMAINS_DATA_PATH, 'utf-8'));

    let seededCount = 0;
    let displayOrder = 0;

    for (const domain of domainsData) {
        const existing = await domainRepo.findOneBy({ domain: domain.domain });

        if (!existing) {
            const validDomain = validateDomain(domain.domain);
            if (validDomain) {
                const newDomain = domainRepo.create({
                    domain: validDomain,
                    level: domain.level || 'Intermediate',
                    description: domain.description,
                    yearsOfExperience: domain.yearsOfExperience,
                    icon: domain.icon,
                    displayOrder: displayOrder++
                });
                await domainRepo.save(newDomain);
                seededCount++;
            }
        }
    }

    console.log(`✓ Business Domains seeded (${seededCount} records)`);
}

/**
 * Clears all BusinessDomain records from the database.
 */
export async function clearBusinessDomains(dataSource: DataSource): Promise<void> {
    await dataSource.createQueryBuilder().delete().from(BusinessDomain).execute();
}
