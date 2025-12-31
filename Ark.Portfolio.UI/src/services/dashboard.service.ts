import { apiClient } from '../api/client';
import { DashboardDataDto } from 'ark-portfolio-share/dtos/dashboard.dto';

const DASHBOARD_MOCK: DashboardDataDto = {
    stats: { totalProjects: 12, totalSkills: 25, totalExperienceYears: 8, activeProjects: 3 },
    activity: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        commits: [10, 25, 15, 40, 35, 50],
        complexity: [20, 35, 25, 45, 40, 60]
    }
};

export class DashboardService {
    async getDashboardData(): Promise<DashboardDataDto> {
        return apiClient.get<DashboardDataDto>('/dashboard', {}, DASHBOARD_MOCK);
    }
}

export const dashboardService = new DashboardService();

