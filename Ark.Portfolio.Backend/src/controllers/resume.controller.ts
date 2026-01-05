/**
 * @fileoverview Resume Controller
 * Handles HTTP requests for Resume endpoints.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { Request, Response } from 'express';
import { ResumeService } from '../services/resume.service';
import { BaseController } from './base.controller';

const resumeService = new ResumeService();

/**
 * Controller for Resume endpoints.
 * Provides access to education, experience, and skills data.
 */
export class ResumeController extends BaseController {
    /**
     * GET /api/resume
     * Retrieves complete Resume data including education, experience, and skills.
     */
    getResume = async (req: Request, res: Response) => {
        try {
            const resume = await resumeService.getResume();
            return this.ok(res, resume);
        } catch (error) {
            return this.fail(res, error as Error);
        }
    }
}

