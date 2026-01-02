/**
 * @fileoverview Media Seeder
 * Seeds media assets for the portfolio (images, documents, etc.).
 * 
 * @module database/seeds/seeders/media.seeder
 * @author Armand Richelet-Kleinberg
 */

import { DataSource } from 'typeorm';
import { Media, MediaType } from '../../entities/media.entity';
import { DEFAULT_MEDIA_SEED } from '@ark/portfolio-share';

/**
 * Seeds the Media table with default asset references.
 * 
 * @param dataSource - TypeORM DataSource connection
 * @returns Promise resolving when media assets are seeded
 * 
 * @remarks
 * - Uses DEFAULT_MEDIA_SEED from the shared layer for type-safe seed data
 * - Media entries reference files in /Assets folder
 * - Each entry includes: name, key, url, type, mimeType, fileSize, tags
 * - Media can be managed via the admin interface after seeding
 * 
 * @example Media entry:
 * ```typescript
 * {
 *   name: 'Project Hero Image',
 *   key: 'project-portfolio-hero',
 *   url: '/Assets/Projects/Ark.Portfolio/portfolio-hero.png',
 *   type: 'image',
 *   mimeType: 'image/png',
 *   fileSize: 605232,
 *   tags: ['project', 'hero', 'carousel']
 * }
 * ```
 */
export async function seedMedia(dataSource: DataSource): Promise<void> {
    const mediaRepo = dataSource.getRepository(Media);

    if (await mediaRepo.count() === 0) {
        for (const item of DEFAULT_MEDIA_SEED) {
            const mediaItem = mediaRepo.create({
                name: item.name,
                key: item.key,
                url: item.url,
                type: item.type as unknown as MediaType,
                mimeType: item.mimeType,
                originalFileName: item.originalFileName,
                fileSize: item.fileSize,
                altText: item.altText,
                description: item.description,
                tags: item.tags,
                isPublic: item.isPublic !== false
            });
            await mediaRepo.save(mediaItem);
        }

        console.log(`✓ Media assets seeded (${DEFAULT_MEDIA_SEED.length} items)`);
    } else {
        console.log('○ Media already populated, skipping');
    }
}

/**
 * Clears all Media records from the database.
 * 
 * @param dataSource - TypeORM DataSource connection
 */
export async function clearMedia(dataSource: DataSource): Promise<void> {
    await dataSource.createQueryBuilder().delete().from(Media).execute();
}
