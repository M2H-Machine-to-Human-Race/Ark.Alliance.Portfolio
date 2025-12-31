import { BaseComponentModel } from '../../components/base/BaseComponent.model';
import { ProjectDto } from '@ark/portfolio-share';
import { projectService } from '../../services/project.service';

export class ProjectDetailsViewModel extends BaseComponentModel {
    public project: ProjectDto | null = null;
    public activeTab: string = 'overview';

    constructor() {
        super();
    }

    async onInit(id?: string): Promise<void> {
        if (!id) return;

        this.isLoading = true;
        try {
            this.project = await projectService.getProjectById(id) || null;
        } catch (error) {
            this.error = this.handleError(error);
        } finally {
            this.isLoading = false;
        }
    }

    public setActiveTab(tab: string) {
        this.activeTab = tab;
    }
}

