/**
 * @fileoverview Profile Seeder
 * Seeds the portfolio owner's profile information.
 * 
 * @module database/seeds/seeders/profile.seeder
 * @author Armand Richelet-Kleinberg
 */

import { DataSource } from 'typeorm';
import { Profile } from '../../entities/profile.entity';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Path to the profile seed data JSON file.
 */
const PROFILE_DATA_PATH = path.join(__dirname, '../../InitDbAsset/JsonDatas/profile.json');

/**
 * Seeds the Profile table with initial data.
 * 
 * @param dataSource - TypeORM DataSource connection
 * @returns Promise resolving when profile is seeded
 * 
 * @remarks
 * - Only seeds if the Profile table is empty (prevents duplicate entries)
 * - Reads from profile.json in InitDbAsset/JsonDatas
 * - Profile contains: firstName, lastName, title, overview, email, social URLs, avatarUrl
 */
export async function seedProfile(dataSource: DataSource): Promise<void> {
    const profileRepo = dataSource.getRepository(Profile);

    if (await profileRepo.count() === 0) {
        const profileData = JSON.parse(fs.readFileSync(PROFILE_DATA_PATH, 'utf-8'));
        const profile = new Profile();
        Object.assign(profile, profileData);
        await profileRepo.save(profile);
        console.log('✓ Profile seeded');
    } else {
        console.log('○ Profile already exists, skipping');
    }
}

/**
 * Clears all Profile records from the database.
 * 
 * @param dataSource - TypeORM DataSource connection
 */
export async function clearProfile(dataSource: DataSource): Promise<void> {
    await dataSource.createQueryBuilder().delete().from(Profile).execute();
}
