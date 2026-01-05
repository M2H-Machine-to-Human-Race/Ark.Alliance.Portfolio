/**
 * @fileoverview Theme Repository
 * Repository for theme CRUD operations.
 * 
 * @module database/repositories/theme.repository
 * @author Armand Richelet-Kleinberg
 */

import { GenericRepository } from './generic.repository';
import { Theme } from '../entities/theme.entity';

/**
 * Repository for Theme entity operations.
 * Extends GenericRepository with theme-specific query methods.
 */
export class ThemeRepository extends GenericRepository<Theme> {
    constructor() {
        super(Theme);
    }

    /**
     * Find all active themes ordered by display order.
     * @returns Array of active themes (without CSS content for list view)
     */
    async findAllActive(): Promise<Theme[]> {
        return this.repository.find({
            where: { isActive: true },
            order: { order: 'ASC', name: 'ASC' },
            select: ['id', 'name', 'slug', 'description', 'previewColor', 'icon', 'isDefault', 'order']
        });
    }

    /**
     * Find theme by slug identifier.
     * @param slug - Theme slug (e.g., 'default-cyber')
     * @returns Theme with full CSS content or null
     */
    async findBySlug(slug: string): Promise<Theme | null> {
        return this.repository.findOne({
            where: { slug, isActive: true }
        });
    }

    /**
     * Find the default theme.
     * @returns Default theme with full CSS content or null
     */
    async findDefault(): Promise<Theme | null> {
        return this.repository.findOne({
            where: { isDefault: true, isActive: true }
        });
    }

    /**
     * Check if a theme with the given slug exists.
     * @param slug - Theme slug to check
     * @returns True if theme exists
     */
    async existsBySlug(slug: string): Promise<boolean> {
        const count = await this.repository.count({ where: { slug } });
        return count > 0;
    }
}
