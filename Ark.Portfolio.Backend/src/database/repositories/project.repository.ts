import { GenericRepository } from './generic.repository';
import { Project } from '../entities/project.entity';

export class ProjectRepository extends GenericRepository<Project> {
    constructor() {
        super(Project);
    }

    /**
     * Find a project by UUID.
     * @param id - UUID of the project
     * @returns Project with full relations or null
     */
    async findFullProjectTree(id: string): Promise<Project | null> {
        // First try as UUID
        let project = await this.repository.findOne({
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

        // If not found and not a UUID pattern, try as slug
        if (!project) {
            project = await this.findBySlug(id);
        }

        return project;
    }

    /**
     * Find a project by slug (derived from title).
     * Slug conversion: lowercase, dots and spaces to hyphens.
     * 
     * @param slug - URL-friendly slug (e.g., 'ark-alliance')
     * @returns Project with full relations or null
     */
    async findBySlug(slug: string): Promise<Project | null> {
        const projects = await this.repository.find({
            relations: {
                technologies: true,
                pages: true,
                features: true,
                controllers: {
                    endpoints: true
                }
            }
        });

        // Convert slug back to title pattern and find matching project
        const normalizedSlug = slug.toLowerCase();
        const project = projects.find(p => {
            const projectSlug = p.title
                .toLowerCase()
                .replace(/\./g, '-')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            return projectSlug === normalizedSlug;
        });

        return project || null;
    }
}

