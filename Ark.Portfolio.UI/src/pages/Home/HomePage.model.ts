import { BaseComponentModel } from '../../components/base/BaseComponent.model';
import { dashboardService } from '../../services/dashboard.service';
import { projectService } from '../../services/project.service';
import { profileService } from '../../services/profile.service';
import { DashboardDataDto, ProjectDto, ProfileDto } from '@ark/portfolio-share';
import { ChartData } from 'chart.js';
import { CarouselItem } from '../../components/generic/Carousel/Carousel.types';

export class HomeViewModel extends BaseComponentModel {
    private _data: DashboardDataDto | null = null;
    private _chartData: ChartData | null = null;
    private _featuredProjects: ProjectDto[] = [];
    private _profile: ProfileDto | null = null;

    // Expose callbacks for View to refresh
    public onDataUpdate?: () => void;

    constructor() {
        super();
    }

    public async onInit(): Promise<void> {
        this.isLoading = true;
        try {
            const [dashboardData, featuredParams, profileData] = await Promise.all([
                dashboardService.getDashboardData(),
                projectService.getFeaturedProjects(),
                profileService.getProfile()
            ]);

            this._data = dashboardData;
            this._featuredProjects = featuredParams;
            this._profile = profileData;
            this.prepareChartData();
        } catch (e) {
            this.error = (e as Error).message;
        } finally {
            this.isLoading = false;
            if (this.onDataUpdate) this.onDataUpdate();
        }
    }

    public onDestroy(): void {
        // Cleanup
    }

    private prepareChartData() {
        if (!this._data) return;

        this._chartData = {
            labels: this._data.activity.labels,
            datasets: [
                {
                    label: 'Commits',
                    data: this._data.activity.commits,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Complexity',
                    data: this._data.activity.complexity,
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    fill: true,
                    tension: 0.4
                }
            ]
        };
    }

    get stats() { return this._data?.stats; }
    get chartData() { return this._chartData; }
    get featuredProjects() { return this._featuredProjects; }
    get profile() { return this._profile; }
}

