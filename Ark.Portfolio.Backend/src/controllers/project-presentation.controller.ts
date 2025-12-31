import { Request, Response } from 'express';
import { ProjectPresentationService } from '../services/project-presentation.service';
import { BaseController } from './base.controller';

export class ProjectPresentationController extends BaseController {
    private service: ProjectPresentationService;

    constructor() {
        super();
        this.service = new ProjectPresentationService();
    }

    getFullProject = async (req: Request, res: Response) => {
        try {
            const projectId = req.params.id;
            const data = await this.service.getFullProject(projectId);
            if (!data) {
                return this.notFound(res, 'Project presentation not found');
            }
            return this.ok(res, data);
        } catch (error) {
            return this.fail(res, error as Error);
        }
    }

    getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await this.service.getAllProjectsSummary();
            res.json(projects);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching projects', error });
        }
    }
}

