/**
 * @fileoverview Theme Controller
 * Handles HTTP requests for theme-related endpoints.
 * 
 * @module controllers/theme.controller
 * @author Armand Richelet-Kleinberg
 */

import { Request, Response } from 'express';
import { ThemeService } from '../services/theme.service';
import { BaseController } from './base.controller';

const themeService = new ThemeService();

/**
 * Controller for theme endpoints.
 * Provides read-only access to themes for frontend consumption.
 */
export class ThemeController extends BaseController {
    /**
     * GET /api/themes
     * Retrieves all active themes (without CSS content for performance).
     */
    async listThemes(req: Request, res: Response) {
        try {
            const themes = await themeService.listThemes();
            return this.ok(res, themes);
        } catch (error) {
            return this.fail(res, error as Error);
        }
    }

    /**
     * GET /api/themes/default
     * Retrieves the default theme with full CSS content.
     */
    async getDefaultTheme(req: Request, res: Response) {
        try {
            const theme = await themeService.getDefaultTheme();
            if (!theme) {
                return this.notFound(res, 'No default theme configured');
            }
            return this.ok(res, theme);
        } catch (error) {
            return this.fail(res, error as Error);
        }
    }

    /**
     * GET /api/themes/:slug
     * Retrieves a specific theme by slug with full CSS content.
     */
    async getThemeBySlug(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            const theme = await themeService.getThemeBySlug(slug);
            if (!theme) {
                return this.notFound(res, `Theme '${slug}' not found`);
            }
            return this.ok(res, theme);
        } catch (error) {
            return this.fail(res, error as Error);
        }
    }
}
