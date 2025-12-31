/**
 * @fileoverview CV Controller
 * Handles HTTP requests for CV/resume endpoints.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { Request, Response } from 'express';
import { CvService } from '../services/cv.service';
import { BaseController } from './base.controller';

const cvService = new CvService();

/**
 * Controller for CV endpoints.
 * Provides access to education, experience, and skills data.
 */
export class CvController extends BaseController {
    /**
     * GET /api/cv
     * Retrieves complete CV data including education, experience, and skills.
     */
    getCv = async (req: Request, res: Response) => {
        try {
            const cv = await cvService.getCv();
            return this.ok(res, cv);
        } catch (error) {
            return this.fail(res, error as Error);
        }
    }
}

