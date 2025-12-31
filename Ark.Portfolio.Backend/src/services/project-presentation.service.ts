import { ProjectRepository } from '../database/repositories/project.repository';
import { Project } from '../database/entities/project.entity';

export class ProjectPresentationService {
    private projectRepo: ProjectRepository;

    constructor() {
        this.projectRepo = new ProjectRepository();
    }

    async getFullProject(id: string): Promise<Project | null> {
        return this.projectRepo.findFullProjectTree(id);
    }

    async getAllProjectsSummary(): Promise<Project[]> {
        return this.projectRepo.findAll({
            select: ['id', 'title', 'imageUrl', 'description', 'status'], // Optimization
            relations: ['technologies']
        });
    }
}

