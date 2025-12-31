import { BaseComponentModel } from '../../base/BaseComponent.model';

export class KpiCardViewModel extends BaseComponentModel {
    public getTrendColor(trend: number): string {
        if (trend > 0) return 'var(--color-success)';
        if (trend < 0) return 'var(--color-error)';
        return 'var(--text-secondary)';
    }

    public getTrendIcon(trend: number): string {
        if (trend > 0) return '↑';
        if (trend < 0) return '↓';
        return '−';
    }
}

