/**
 * @fileoverview Dashboard Controller
 * Handles HTTP requests for dashboard/statistics endpoints.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { BaseController } from './base.controller';

/**
 * Controller for dashboard endpoints.
 * Provides aggregated statistics and activity data.
 */
export class DashboardController extends BaseController {
    private dashboardService: DashboardService;

    constructor() {
        super();
        this.dashboardService = new DashboardService();
    }

    /**
     * GET /api/dashboard
     * Retrieves dashboard data including statistics and activity graphs.
     */
    public getDashboardData = async (req: Request, res: Response) => {
        try {
            const data = await this.dashboardService.getDashboardData();
            return this.ok(res, data);
        } catch (error) {
            return this.fail(res, error as Error);
        }
    };
}

