import { apiClient } from '../api/client';
// Widget DTO might not exist in share yet, defining interface here for now or assuming check later.
// Ideally should be in share.

export interface WidgetDto {
    id: string;
    type: string;
    title: string;
    config: any;
    order: number;
}

const HOME_WIDGETS_MOCK: WidgetDto[] = [
    {
        id: '1',
        type: 'FEATURED_PROJECT',
        title: 'Ark.Alliance Ecosystem',
        config: {
            subtitle: 'AI-Driven High Frequency Trading',
            projectId: '1',
            imageUrl: '/assets/Bot10.PNG',
            description: 'A cyberpunk trading bot featuring real-time analytics and neural network trend detection.'
        },
        order: 1
    },
    {
        id: '2',
        type: 'PROJECT_CARD',
        title: 'Logistics Platform',
        config: {
            subtitle: 'Global Supply Chain',
            projectId: '2',
            imageUrl: '/assets/Bot13.PNG'
        },
        order: 2
    },
    {
        id: '3',
        type: 'PROJECT_CARD',
        title: 'Live Show Control',
        config: {
            subtitle: 'Immersive AV Sync',
            projectId: '3',
            imageUrl: '/assets/Bot6.PNG'
        },
        order: 3
    }
];

export class WidgetService {
    async getHomeWidgets(): Promise<WidgetDto[]> {
        return apiClient.get<WidgetDto[]>('/widgets/home', {}, HOME_WIDGETS_MOCK);
    }
}

export const widgetService = new WidgetService();

