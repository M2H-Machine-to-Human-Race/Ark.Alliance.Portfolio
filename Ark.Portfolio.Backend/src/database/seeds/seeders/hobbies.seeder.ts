/**
 * @fileoverview Hobbies Seeder
 * Seeds hobby records for the resume/CV.
 * 
 * @module database/seeds/seeders/hobbies.seeder
 * @author Armand Richelet-Kleinberg
 */

import { DataSource } from 'typeorm';
import { Hobby } from '../../entities/hobby.entity';
import * as fs from 'fs';
import * as path from 'path';

const HOBBIES_DATA_PATH = path.join(__dirname, '../../InitDbAsset/JsonDatas/hobbies.json');

/**
 * Seeds the Hobby table with personal interests.
 */
export async function seedHobbies(dataSource: DataSource): Promise<void> {
    const hobbyRepo = dataSource.getRepository(Hobby);
    const hobbiesData = JSON.parse(fs.readFileSync(HOBBIES_DATA_PATH, 'utf-8'));

    let seededCount = 0;
    let displayOrder = 0;

    for (const hobby of hobbiesData) {
        const existing = await hobbyRepo.findOneBy({ name: hobby.name });

        if (!existing) {
            const newHobby = hobbyRepo.create({
                name: hobby.name,
                description: hobby.description,
                icon: hobby.icon,
                displayOrder: displayOrder++
            });
            await hobbyRepo.save(newHobby);
            seededCount++;
        }
    }

    console.log(`✓ Hobbies seeded (${seededCount} records)`);
}

/**
 * Clears all Hobby records from the database.
 */
export async function clearHobbies(dataSource: DataSource): Promise<void> {
    await dataSource.createQueryBuilder().delete().from(Hobby).execute();
}
