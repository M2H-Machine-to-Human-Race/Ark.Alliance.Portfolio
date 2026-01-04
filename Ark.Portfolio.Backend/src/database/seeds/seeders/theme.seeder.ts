/**
 * @fileoverview Theme Seeder
 * Seeds the themes table with CSS content for dynamic theme switching.
 * 
 * @module database/seeds/seeders/theme.seeder
 * @author Armand Richelet-Kleinberg
 * 
 * @description
 * This seeder populates the Theme table with pre-defined themes.
 * Each theme includes full CSS content that is dynamically loaded
 * and injected by the frontend for runtime theme switching.
 * 
 * Themes:
 * - normal: Balanced neon glow (default)
 * - neon: Maximum intensity glow effects
 * - minimal: Reduced effects, clean appearance
 * - glass: Ultra glassmorphism with soft glow
 */

import { DataSource } from 'typeorm';
import { Theme } from '../../entities/theme.entity';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Path to the themes manifest JSON file.
 */
const THEMES_MANIFEST_PATH = path.join(__dirname, '../../InitDbAsset/JsonDatas/themes.json');

/**
 * Path to the themes CSS content directory.
 */
const THEMES_CSS_DIR = path.join(__dirname, '../../InitDbAsset/JsonDatas/themes');

/**
 * Theme manifest entry interface.
 */
interface ThemeManifestEntry {
    name: string;
    slug: string;
    description: string;
    previewColor: string;
    icon: string;
    isDefault: boolean;
    order: number;
    cssFile: string;
}

/**
 * Seeds the Theme table with theme data from manifest and CSS files.
 * 
 * @param dataSource - TypeORM DataSource connection
 * @returns Promise resolving when themes are seeded
 * 
 * @remarks
 * - Checks if theme slug already exists before inserting
 * - Reads manifest from themes.json
 * - Loads CSS content from individual theme files
 */
export async function seedThemes(dataSource: DataSource): Promise<void> {
    const themeRepo = dataSource.getRepository(Theme);

    if (!fs.existsSync(THEMES_MANIFEST_PATH)) {
        console.log('○ Themes manifest not found, skipping');
        return;
    }

    const manifest = JSON.parse(fs.readFileSync(THEMES_MANIFEST_PATH, 'utf-8'));
    const themes: ThemeManifestEntry[] = manifest.themes;

    if (!themes || themes.length === 0) {
        console.log('○ No themes found in manifest');
        return;
    }

    let seededCount = 0;
    let skippedCount = 0;

    for (const entry of themes) {
        const existing = await themeRepo.findOne({ where: { slug: entry.slug } });

        if (!existing) {
            // Load CSS content from individual theme file
            const cssFilePath = path.join(THEMES_CSS_DIR, entry.cssFile);
            let cssContent = '';

            if (fs.existsSync(cssFilePath)) {
                const cssData = JSON.parse(fs.readFileSync(cssFilePath, 'utf-8'));
                cssContent = cssData.cssContent || '';
            } else {
                console.warn(`  ⚠ CSS file not found for theme '${entry.slug}': ${entry.cssFile}`);
            }

            const theme = themeRepo.create({
                name: entry.name,
                slug: entry.slug,
                description: entry.description,
                previewColor: entry.previewColor,
                icon: entry.icon,
                isDefault: entry.isDefault,
                order: entry.order,
                cssContent: cssContent,
                isActive: true
            });

            await themeRepo.save(theme);
            seededCount++;
        } else {
            skippedCount++;
        }
    }

    console.log(`✓ Themes seeded (${seededCount} new, ${skippedCount} existing)`);
}

/**
 * Clears all Theme records from the database.
 * 
 * @param dataSource - TypeORM DataSource connection
 */
export async function clearThemes(dataSource: DataSource): Promise<void> {
    await dataSource.createQueryBuilder().delete().from(Theme).execute();
}
