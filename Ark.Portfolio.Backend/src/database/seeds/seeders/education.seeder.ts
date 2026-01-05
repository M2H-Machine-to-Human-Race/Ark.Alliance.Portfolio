/**
 * @fileoverview Education Seeder
 * Seeds educational qualifications for the resume/CV.
 * 
 * @module database/seeds/seeders/education.seeder
 * @author Armand Richelet-Kleinberg
 */

import { DataSource } from 'typeorm';
import { Education } from '../../entities/education.entity';
import * as fs from 'fs';
import * as path from 'path';

const EDUCATION_DATA_PATH = path.join(__dirname, '../../InitDbAsset/JsonDatas/education.json');

/**
 * Seeds the Education table with qualifications.
 */
export async function seedEducation(dataSource: DataSource): Promise<void> {
    const eduRepo = dataSource.getRepository(Education);
    const educationData = JSON.parse(fs.readFileSync(EDUCATION_DATA_PATH, 'utf-8'));

    let seededCount = 0;
    let displayOrder = 0;

    for (const edu of educationData) {
        const existing = await eduRepo.findOneBy({
            institution: edu.institution,
            degree: edu.degree
        });

        if (!existing) {
            const newEdu = eduRepo.create({
                degree: edu.degree,
                institution: edu.institution,
                fieldOfStudy: edu.fieldOfStudy,
                startDate: edu.startYear ? new Date(`${edu.startYear}-09-01`) : new Date(),
                endDate: edu.endYear ? new Date(`${edu.endYear}-06-30`) : undefined,
                description: edu.description,
                displayOrder: displayOrder++
            });
            await eduRepo.save(newEdu);
            seededCount++;
        }
    }

    console.log(`✓ Education seeded (${seededCount} records)`);
}

/**
 * Clears all Education records from the database.
 */
export async function clearEducation(dataSource: DataSource): Promise<void> {
    await dataSource.createQueryBuilder().delete().from(Education).execute();
}
