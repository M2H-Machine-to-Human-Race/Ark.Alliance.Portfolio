/**
 * @fileoverview Profile Controller
 * Handles HTTP requests for profile/contact info endpoints.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { Request, Response } from 'express';
import { ProfileService } from '../services/profile.service';
import { BaseController } from './base.controller';

const profileService = new ProfileService();

/**
 * Controller for profile endpoints.
 * Provides access to portfolio owner's personal information.
 */
export class ProfileController extends BaseController {
    /**
     * GET /api/profile
     * Retrieves the portfolio owner's profile information.
     */
    async getProfile(req: Request, res: Response) {
        try {
            const profile = await profileService.getProfile();
            if (!profile) {
                return this.notFound(res, 'Profile not found');
            }
            return this.ok(res, profile);
        } catch (error) {
            return this.fail(res, error as Error);
        }
    }
}

