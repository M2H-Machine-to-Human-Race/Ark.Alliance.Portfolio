/**
 * @fileoverview Admin Theme Service
 * Handles administrative operations for theme management.
 * 
 * @module services/admin-theme
 * @author Armand Richelet-Kleinberg
 * 
 * @description
 * Provides CRUD operations for theme management in the admin panel.
 * Includes safeguards to prevent deletion of the default theme.
 * 
 * @see {@link Theme} for entity definition
 * @see {@link ThemeService} for public theme operations
 */

import { AppDataSource } from '../config/database';
import { Theme } from '../database/entities/theme.entity';
import { CrudResponseDto } from '@ark/portfolio-share';

/**
 * DTO for creating/updating themes
 */
export interface AdminThemeDto {
    name: string;
    slug: string;
    description?: string;
    cssContent: string;
    previewColor?: string;
    icon?: string;
    isDefault?: boolean;
    order?: number;
    isActive?: boolean;
}

/**
 * Admin Theme Service
 * 
 * @class AdminThemeService
 * @description Provides administrative operations for theme management
 */
export class AdminThemeService {
    private themeRepo = AppDataSource.getRepository(Theme);

    /**
     * Get all themes with full data
     */
    async getAllThemes(): Promise<Theme[]> {
        return this.themeRepo.find({ order: { order: 'ASC' } });
    }

    /**
     * Get theme by ID
     */
    async getThemeById(id: number): Promise<Theme | null> {
        return this.themeRepo.findOne({ where: { id } });
    }

    /**
     * Create a new theme
     */
    async createTheme(dto: AdminThemeDto): Promise<CrudResponseDto<Theme>> {
        try {
            // Check if slug already exists
            const existing = await this.themeRepo.findOne({ where: { slug: dto.slug } });
            if (existing) {
                return {
                    success: false,
                    message: `Theme with slug '${dto.slug}' already exists`,
                    timestamp: new Date().toISOString()
                };
            }

            // If setting as default, unset current default
            if (dto.isDefault) {
                await this.themeRepo.update({}, { isDefault: false });
            }

            const theme = this.themeRepo.create({
                name: dto.name,
                slug: dto.slug,
                description: dto.description,
                cssContent: dto.cssContent,
                previewColor: dto.previewColor,
                icon: dto.icon,
                isDefault: dto.isDefault ?? false,
                order: dto.order ?? 0,
                isActive: dto.isActive ?? true
            });

            const saved = await this.themeRepo.save(theme);
            return {
                success: true,
                message: 'Theme created successfully',
                data: saved,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to create theme',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Update an existing theme
     */
    async updateTheme(id: number, dto: AdminThemeDto): Promise<CrudResponseDto<Theme>> {
        try {
            const theme = await this.themeRepo.findOne({ where: { id } });
            if (!theme) {
                return {
                    success: false,
                    message: 'Theme not found',
                    timestamp: new Date().toISOString()
                };
            }

            // Check slug uniqueness if changing
            if (dto.slug && dto.slug !== theme.slug) {
                const existing = await this.themeRepo.findOne({ where: { slug: dto.slug } });
                if (existing) {
                    return {
                        success: false,
                        message: `Theme with slug '${dto.slug}' already exists`,
                        timestamp: new Date().toISOString()
                    };
                }
            }

            // If setting as default, unset current default
            if (dto.isDefault && !theme.isDefault) {
                await this.themeRepo.update({}, { isDefault: false });
            }

            this.themeRepo.merge(theme, dto);
            const saved = await this.themeRepo.save(theme);
            return {
                success: true,
                message: 'Theme updated successfully',
                data: saved,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to update theme',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Delete a theme
     * 
     * @remarks Prevents deletion of the default theme
     */
    async deleteTheme(id: number): Promise<CrudResponseDto<void>> {
        try {
            const theme = await this.themeRepo.findOne({ where: { id } });
            if (!theme) {
                return {
                    success: false,
                    message: 'Theme not found',
                    timestamp: new Date().toISOString()
                };
            }

            // Prevent deletion of default theme
            if (theme.isDefault) {
                return {
                    success: false,
                    message: 'Cannot delete the default theme. Set another theme as default first.',
                    timestamp: new Date().toISOString()
                };
            }

            await this.themeRepo.delete(id);
            return {
                success: true,
                message: 'Theme deleted successfully',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to delete theme',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Set a theme as the default
     */
    async setDefaultTheme(id: number): Promise<CrudResponseDto<Theme>> {
        try {
            const theme = await this.themeRepo.findOne({ where: { id } });
            if (!theme) {
                return {
                    success: false,
                    message: 'Theme not found',
                    timestamp: new Date().toISOString()
                };
            }

            // Unset current default
            await this.themeRepo.update({}, { isDefault: false });

            // Set new default
            theme.isDefault = true;
            const saved = await this.themeRepo.save(theme);

            return {
                success: true,
                message: `Theme '${theme.name}' set as default`,
                data: saved,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to set default theme',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Reorder themes
     */
    async reorderThemes(themeIds: number[]): Promise<CrudResponseDto<void>> {
        try {
            for (let i = 0; i < themeIds.length; i++) {
                await this.themeRepo.update(themeIds[i], { order: i });
            }
            return {
                success: true,
                message: 'Themes reordered successfully',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to reorder themes',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }
}
