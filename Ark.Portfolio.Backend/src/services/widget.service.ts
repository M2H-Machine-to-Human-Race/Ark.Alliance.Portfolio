import { WidgetRepository } from '../database/repositories/widget.repository';
import { Widget } from '../database/entities/widget.entity';

export class WidgetService {
    private widgetRepo: WidgetRepository;

    constructor() {
        this.widgetRepo = new WidgetRepository();
    }

    async getHomeWidgets(): Promise<Widget[]> {
        return this.widgetRepo.findByContext('HOME');
    }

    async getProjectWidgets(projectId: string): Promise<Widget[]> {
        return this.widgetRepo.findByContext(`PROJECT_${projectId}`);
    }

    async createWidget(data: Partial<Widget>): Promise<Widget> {
        return this.widgetRepo.create(data);
    }
}

