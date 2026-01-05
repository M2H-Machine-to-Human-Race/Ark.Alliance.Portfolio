/**
 * @fileoverview Languages Seeder
 * Seeds language proficiency records for the resume/CV.
 * 
 * @module database/seeds/seeders/languages.seeder
 * @author Armand Richelet-Kleinberg
 */

import { DataSource } from 'typeorm';
import { Language } from '../../entities/language.entity';
import * as fs from 'fs';
import * as path from 'path';

const LANGUAGES_DATA_PATH = path.join(__dirname, '../../InitDbAsset/JsonDatas/languages.json');

/**
 * Validates proficiency value is between 1 and 5.
 */
function validateProficiency(value: number): number {
    return Math.max(1, Math.min(5, value || 1));
}

/**
 * Seeds the Language table with proficiency records.
 */
export async function seedLanguages(dataSource: DataSource): Promise<void> {
    const langRepo = dataSource.getRepository(Language);
    const languagesData = JSON.parse(fs.readFileSync(LANGUAGES_DATA_PATH, 'utf-8'));

    let seededCount = 0;
    let displayOrder = 0;

    for (const lang of languagesData) {
        const existing = await langRepo.findOneBy({ language: lang.language });

        if (!existing) {
            const newLang = langRepo.create({
                language: lang.language,
                speaking: validateProficiency(lang.speaking),
                writing: validateProficiency(lang.writing),
                presenting: validateProficiency(lang.presenting),
                displayOrder: displayOrder++
            });
            await langRepo.save(newLang);
            seededCount++;
        }
    }

    console.log(`✓ Languages seeded (${seededCount} records)`);
}

/**
 * Clears all Language records from the database.
 */
export async function clearLanguages(dataSource: DataSource): Promise<void> {
    await dataSource.createQueryBuilder().delete().from(Language).execute();
}
