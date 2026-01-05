/**
 * @fileoverview Theme Service
 * Handles business logic for theme-related operations.
 * 
 * @module services/theme.service
 * @author Armand Richelet-Kleinberg
 */

import { ThemeRepository } from '../database/repositories/theme.repository';
import { Theme } from '../database/entities/theme.entity';

/**
 * DTO for theme list items (without CSS content).
 */
export interface ThemeListItemDto {
    id: number;
    name: string;
    slug: string;
    description?: string;
    previewColor?: string;
    icon?: string;
    isDefault: boolean;
    order: number;
}

/**
 * DTO for theme detail (with CSS content).
 */
export interface ThemeDetailDto extends ThemeListItemDto {
    cssContent: string;
}

/**
 * Service class for theme-related operations.
 * Provides methods for listing themes and retrieving theme CSS content.
 */
export class ThemeService {
    private repository: ThemeRepository;

    constructor() {
        this.repository = new ThemeRepository();
    }

    /**
     * Retrieves all active themes for display in theme selector.
     * CSS content is excluded for list performance.
     * 
     * @returns Promise resolving to array of theme list items
     */
    async listThemes(): Promise<ThemeListItemDto[]> {
        const themes = await this.repository.findAllActive();
        return themes.map(this.mapToListItem);
    }

    /**
     * Retrieves a specific theme by slug with full CSS content.
     * 
     * @param slug - Theme slug identifier
     * @returns Promise resolving to theme detail or null if not found
     */
    async getThemeBySlug(slug: string): Promise<ThemeDetailDto | null> {
        const theme = await this.repository.findBySlug(slug);
        if (!theme) return null;
        return this.mapToDetail(theme);
    }

    /**
     * Retrieves the default theme with full CSS content.
     * 
     * @returns Promise resolving to default theme or null if none set
     */
    async getDefaultTheme(): Promise<ThemeDetailDto | null> {
        const theme = await this.repository.findDefault();
        if (!theme) return null;
        return this.mapToDetail(theme);
    }

    /**
     * Maps Theme entity to ThemeListItemDto (without CSS).
     */
    private mapToListItem(theme: Theme): ThemeListItemDto {
        return {
            id: theme.id,
            name: theme.name,
            slug: theme.slug,
            description: theme.description,
            previewColor: theme.previewColor,
            icon: theme.icon,
            isDefault: theme.isDefault,
            order: theme.order
        };
    }

    /**
     * Maps Theme entity to ThemeDetailDto (with CSS).
     */
    private mapToDetail(theme: Theme): ThemeDetailDto {
        return {
            ...this.mapToListItem(theme),
            cssContent: theme.cssContent
        };
    }
}
