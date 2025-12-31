import { DashboardDataDto } from '@ark/portfolio-share';
import { apiClient } from '../client/apiClient';

export class DashboardApiService {

    public async getDashboardData(): Promise<DashboardDataDto> {
        // Fallback Mock Data if API fails during dev
        const mockData: DashboardDataDto = {
            stats: {
                totalProjects: 12,
                activeProjects: 3,
                totalSkills: 24,
                totalExperienceYears: 5.5
            },
            activity: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                commits: [50, 80, 120, 90, 150, 180],
                complexity: [20, 30, 40, 35, 50, 60]
            }
        };

        try {
            const response = await apiClient.get<DashboardDataDto>('/dashboard');
            return response.data;
        } catch (error) {
            console.warn('Dashboard API failed, using mock data:', error);
            return mockData;
        }
    }
}

