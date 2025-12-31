import { Request, Response } from 'express';
import { WidgetService } from '../services/widget.service';
import { BaseController } from './base.controller';

export class WidgetController extends BaseController {
    private service: WidgetService;

    constructor() {
        super();
        this.service = new WidgetService();
    }

    getHomeWidgets = async (req: Request, res: Response) => {
        try {
            const widgets = await this.service.getHomeWidgets();
            return this.ok(res, widgets);
        } catch (error) {
            return this.fail(res, error as Error);
        }
    }

    getProjectWidgets = async (req: Request, res: Response) => {
        try {
            const widgets = await this.service.getProjectWidgets(req.params.projectId);
            return this.ok(res, widgets);
        } catch (error) {
            return this.fail(res, error as Error);
        }
    }
}

