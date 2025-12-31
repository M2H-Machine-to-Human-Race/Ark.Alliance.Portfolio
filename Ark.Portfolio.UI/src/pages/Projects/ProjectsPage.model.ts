import { BaseComponentModel } from '../../components/base/BaseComponent.model';
import { ProjectDto } from '@ark/portfolio-share';
import { projectService } from '../../services/project.service';

export class ProjectsViewModel extends BaseComponentModel {
    public projects: ProjectDto[] = [];

    constructor() {
        super();
    }

    async onInit(): Promise<void> {
        this.isLoading = true;
        try {
            this.projects = await projectService.getProjects();
        } catch (error) {
            this.error = this.handleError(error);
        } finally {
            this.isLoading = false;
        }
    }

    onDestroy(): void { }
}

