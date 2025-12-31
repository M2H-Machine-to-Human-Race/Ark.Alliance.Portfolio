import { apiClient } from '../client/apiClient';
import { ProjectDto } from '@ark/portfolio-share';

export class ProjectApiService {
    private static instance: ProjectApiService;

    private constructor() { }

    public static getInstance(): ProjectApiService {
        if (!this.instance) {
            this.instance = new ProjectApiService();
        }
        return this.instance;
    }

    public async getAllProjects(): Promise<ProjectDto[]> {
        const response = await apiClient.get<ProjectDto[]>('/projects');
        return response.data;
    }

    public async getProjectById(id: string): Promise<ProjectDto> {
        const response = await apiClient.get<ProjectDto>(`/projects/${id}`);
        return response.data;
    }
}

