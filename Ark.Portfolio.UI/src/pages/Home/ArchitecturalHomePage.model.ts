/**
 * ArchitecturalHomePage ViewModel
 * Business logic and state management for the architectural home page.
 * Follows MVVM pattern with data fetching from backend services.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { BaseComponentModel } from '../../components/base/BaseComponent.model';
import { profileService } from '../../services/profile.service';
import { projectService } from '../../services/project.service';
import { cvService } from '../../services/cv.service';
import { ProfileDto, ProjectDto, CvDto } from '@ark/portfolio-share';
import { ArchitecturalPageView } from './ArchitecturalHomePage.types';

/**
 * ViewModel for ArchitecturalHomePage.
 * Manages data fetching and state for the architectural theme home page.
 */
export class ArchitecturalHomePageModel extends BaseComponentModel {
    private _profile: ProfileDto | null = null;
    private _projects: ProjectDto[] = [];
    private _cv: CvDto | null = null;
    private _activePage: ArchitecturalPageView = 'home';

    /** Callback for view updates */
    public onDataUpdate?: () => void;

    constructor() {
        super();
    }

    /**
     * Initialize the model by fetching all required data.
     */
    public async onInit(): Promise<void> {
        this.isLoading = true;
        try {
            const [profileData, projectsData, cvData] = await Promise.all([
                profileService.getProfile(),
                projectService.getProjects(),
                cvService.getCv()
            ]);

            this._profile = profileData;
            this._projects = projectsData;
            this._cv = cvData;
        } catch (e) {
            this.error = (e as Error).message;
            console.error('ArchitecturalHomePage load error:', e);
        } finally {
            this.isLoading = false;
            this.notifyUpdate();
        }
    }

    /**
     * Cleanup on destroy.
     */
    public onDestroy(): void {
        // Cleanup if needed
    }

    /**
     * Set active page view.
     */
    public setActivePage(page: ArchitecturalPageView): void {
        this._activePage = page;
        this.notifyUpdate();
    }

    /**
     * Return to home view.
     */
    public goHome(): void {
        this.setActivePage('home');
    }

    /**
     * Notify view of updates.
     */
    private notifyUpdate(): void {
        if (this.onDataUpdate) {
            this.onDataUpdate();
        }
    }

    // Getters
    get profile(): ProfileDto | null { return this._profile; }
    get projects(): ProjectDto[] { return this._projects; }
    get cv(): CvDto | null { return this._cv; }
    get activePage(): ArchitecturalPageView { return this._activePage; }
    get isHome(): boolean { return this._activePage === 'home'; }
}

