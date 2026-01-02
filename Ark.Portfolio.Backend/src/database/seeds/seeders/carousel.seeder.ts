/**
 * @fileoverview Carousel Seeder
 * Seeds homepage carousel/slider items.
 * 
 * @module database/seeds/seeders/carousel.seeder
 * @author Armand Richelet-Kleinberg
 */

import { DataSource } from 'typeorm';
import { CarouselItem } from '../../entities/carousel-item.entity';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Path to the carousel seed data JSON file.
 */
const CAROUSEL_DATA_PATH = path.join(__dirname, '../../InitDbAsset/JsonDatas/carousel.json');

/**
 * Seeds the CarouselItem table with homepage slider content.
 * 
 * @param dataSource - TypeORM DataSource connection
 * @returns Promise resolving when carousel items are seeded
 * 
 * @remarks
 * - Only seeds if the CarouselItem table is empty
 * - Each item includes: title, subtitle, description, imageUrl, linkUrl, order, isActive
 * - Items are displayed on the homepage in order specified
 * - Image URLs should reference assets in /Assets/Projects/
 */
export async function seedCarousel(dataSource: DataSource): Promise<void> {
    const carouselPath = CAROUSEL_DATA_PATH;

    if (!fs.existsSync(carouselPath)) {
        console.log('○ Carousel data file not found, skipping');
        return;
    }

    const carouselRepo = dataSource.getRepository(CarouselItem);

    if (await carouselRepo.count() === 0) {
        const carouselData = JSON.parse(fs.readFileSync(carouselPath, 'utf-8'));

        for (const item of carouselData) {
            const carouselItem = carouselRepo.create({
                title: item.title,
                subtitle: item.subtitle,
                description: item.description,
                imageUrl: item.imageUrl,
                linkUrl: item.linkUrl,
                linkText: item.linkText,
                order: item.order,
                isActive: item.isActive
            });
            await carouselRepo.save(carouselItem);
        }

        console.log(`✓ Carousel seeded (${carouselData.length} items)`);
    } else {
        console.log('○ Carousel already populated, skipping');
    }
}

/**
 * Clears all CarouselItem records from the database.
 * 
 * @param dataSource - TypeORM DataSource connection
 */
export async function clearCarousel(dataSource: DataSource): Promise<void> {
    await dataSource.createQueryBuilder().delete().from(CarouselItem).execute();
}
