import { GenericRepository } from './generic.repository';
import { Project } from '../entities/project.entity';

export class ProjectRepository extends GenericRepository<Project> {
    constructor() {
        super(Project);
    }

    async findFullProjectTree(id: string): Promise<Project | null> {
        return this.repository.findOne({
            where: { id },
            relations: {
                technologies: true,
                pages: true,
                features: true,
                controllers: {
                    endpoints: true
                }
            }
        });
    }
}

