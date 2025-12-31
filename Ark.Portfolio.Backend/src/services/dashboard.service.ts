/**
 * @fileoverview Dashboard Service
 * Provides aggregated statistics and activity data for the home page.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { AppDataSource } from '../config/database';
import { Project } from '../database/entities/project.entity';
import { Skill } from '../database/entities/skill.entity';
import { Experience } from '../database/entities/experience.entity';
import { ProjectStatus } from '@ark/portfolio-share';
import { DashboardDataDto } from '@ark/portfolio-share';

/**
 * Service class for dashboard-related operations.
 * Aggregates data from multiple sources for portfolio overview.
 */
export class DashboardService {
    private projectRepo = AppDataSource.getRepository(Project);
    private skillRepo = AppDataSource.getRepository(Skill);
    private expRepo = AppDataSource.getRepository(Experience);

    /**
     * Retrieves complete dashboard data including statistics and activity graphs.
     * 
     * Statistics include:
     * - Total project count
     * - Active projects count
     * - Total skills count
     * - Total years of experience (calculated from experience entries)
     * 
     * Activity data is currently mocked and would require a Commit/Activity table
     * for real implementation.
     * 
     * @returns Promise resolving to complete dashboard data DTO
     */
    public async getDashboardData(): Promise<DashboardDataDto> {
        // Fetch real counts from database
        const totalProjects = await this.projectRepo.count();
        const activeProjects = await this.projectRepo.count({
            where: { status: ProjectStatus.IN_PROGRESS }
        });
        const totalSkills = await this.skillRepo.count();

        // Calculate total experience years from all experience entries
        const experiences = await this.expRepo.find();
        let totalExperienceYears = 0;
        experiences.forEach(exp => {
            const start = new Date(exp.startDate).getTime();
            const end = exp.endDate ? new Date(exp.endDate).getTime() : Date.now();
            const diffYears = (end - start) / (1000 * 60 * 60 * 24 * 365);
            totalExperienceYears += diffYears;
        });

        // Mock activity data (requires Commit/Activity table for real data)
        const activity = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            commits: [120, 150, 180, 90, 200, 240],
            complexity: [45, 60, 75, 40, 85, 95]
        };

        return {
            stats: {
                totalProjects,
                activeProjects,
                totalSkills,
                totalExperienceYears: Math.round(totalExperienceYears * 10) / 10
            },
            activity
        };
    }
}

