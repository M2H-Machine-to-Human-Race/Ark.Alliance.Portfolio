/**
 * @fileoverview Static Export API Routes
 * Backend endpoints for static site generation using the new engine.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { Router, Request, Response } from 'express';
import { staticGenerationService } from '../services/static-generation.service';

const router = Router();

/**
 * POST /api/admin/export-static
 * Generate and download complete static React/TSX website as ZIP.
 */
router.post('/export-static', async (req: Request, res: Response) => {
    try {
        console.log('[StaticExport] Starting static site generation...');

        const config = req.body?.config;
        await staticGenerationService.generateStaticSite(res, config);

    } catch (error) {
        console.error('[StaticExport] Generation error:', error);
        if (!res.headersSent) {
            res.status(500).json({
                error: 'Failed to generate static export',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
});

/**
 * GET /api/admin/export-static/preview
 * Get preview data for static export.
 */
router.get('/export-static/preview', async (req: Request, res: Response) => {
    try {
        const preview = await staticGenerationService.getExportPreview();
        res.json({
            success: true,
            data: preview
        });
    } catch (error) {
        console.error('[StaticExport] Preview error:', error);
        res.status(500).json({
            error: 'Failed to get export preview',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;

