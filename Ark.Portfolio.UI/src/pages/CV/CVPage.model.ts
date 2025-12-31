import { BaseComponentModel } from '../../components/base/BaseComponent.model';
import { cvService } from '../../services/cv.service';
import { CvDto, ExperienceDto, EducationDto, SkillDto } from '@ark/portfolio-share';
import { TimelineEntry } from '../../components/generic/Timeline/Timeline.types';

export class CVPageViewModel extends BaseComponentModel {
    private _cvData: CvDto | null = null;
    private _experienceTimeline: TimelineEntry[] = [];
    private _educationTimeline: TimelineEntry[] = [];

    constructor() {
        super();
    }

    public async onInit(): Promise<void> {
        this.isLoading = true;
        try {
            this._cvData = await cvService.getCv();
            this.mapTimelineData();
        } catch (e) {
            this.error = (e as Error).message;
        } finally {
            this.isLoading = false;
        }
    }

    private mapTimelineData(): void {
        if (!this._cvData) return;

        this._experienceTimeline = this._cvData.experiences.map((exp: ExperienceDto) => ({
            id: Math.random().toString(36).substr(2, 9),
            date: `${new Date(exp.startDate).getFullYear()} - ${exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}`,
            title: exp.position,
            subtitle: exp.company,
            description: exp.description,
            icon: 'briefcase',
            color: 'blue'
        })).sort((a: TimelineEntry, b: TimelineEntry) => b.date.localeCompare(a.date));

        this._educationTimeline = this._cvData.education.map((edu: EducationDto) => ({
            id: Math.random().toString(36).substr(2, 9),
            date: `${new Date(edu.startDate).getFullYear()} - ${edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}`,
            title: edu.degree,
            subtitle: edu.institution,
            description: edu.description || edu.fieldOfStudy, // Fallback
            icon: 'graduation-cap',
            color: 'green'
        })).sort((a: TimelineEntry, b: TimelineEntry) => b.date.localeCompare(a.date));
    }

    get cv() { return this._cvData; }
    get experienceTimeline() { return this._experienceTimeline; }
    get educationTimeline() { return this._educationTimeline; }

    // Categorized Skills
    get backendSkills() { return this._cvData?.skills.filter((s: SkillDto) => s.category === 'Backend') || []; }
    get frontendSkills() { return this._cvData?.skills.filter((s: SkillDto) => s.category === 'Frontend') || []; }
    get specializedSkills() { return this._cvData?.skills.filter((s: SkillDto) => s.category === 'Specialized') || []; }
}

