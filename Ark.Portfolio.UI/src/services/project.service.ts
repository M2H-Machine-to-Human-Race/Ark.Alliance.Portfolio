import { apiClient } from '../api/client';
import { ProjectDto } from 'ark-portfolio-share/dtos/project.dto';
import { MOCK_PROJECTS } from '@ark/portfolio-share';

export class ProjectService {
    async getProjects(): Promise<ProjectDto[]> {
        return apiClient.get<ProjectDto[]>('/projects', {}, MOCK_PROJECTS);
    }

    async getFeaturedProjects(): Promise<ProjectDto[]> {
        return apiClient.get<ProjectDto[]>('/projects/featured', {}, MOCK_PROJECTS.filter(p => p.isFeatured));
    }

    async getProjectById(id: string): Promise<ProjectDto | undefined> {
        return apiClient.get<ProjectDto>(`/projects/${id}/presentation`, {}, MOCK_PROJECTS.find((p: ProjectDto) => p.id === id));
    }
}

export const projectService = new ProjectService();

