import { BaseComponentModel } from '../../components/base/BaseComponent.model';
import { ProjectDto, ProjectPageDto } from '@ark/portfolio-share';
import { projectService } from '../../services/project.service';

export class ProjectDetailsViewModel extends BaseComponentModel {
    public project: ProjectDto | null = null;
    public activePageId: string | null = null;

    constructor(private projectId: string) {
        super();
    }

    public async onInit(): Promise<void> {
        this.isLoading = true;
        try {
            this.project = await projectService.getProjectById(this.projectId) || null;
            const pages = this.project?.pages || [];
            if (pages.length > 0) {
                this.activePageId = pages[0].id;
            }
        } catch (error) {
            this.error = (error as Error).message;
        } finally {
            this.isLoading = false;
        }
    }

    public setActivePage(pageId: string) {
        this.activePageId = pageId;
    }

    get activePageContent(): ProjectPageDto | undefined {
        return (this.project?.pages || []).find(p => p.id === this.activePageId);
    }

    public onDestroy(): void {
        // Cleanup
    }
}

