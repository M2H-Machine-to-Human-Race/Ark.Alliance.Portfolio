import { BaseComponentModel } from '../../base/BaseComponent.model';
import { GaugeThreshold } from './Gauge.types';

export class GaugeViewModel extends BaseComponentModel {
    public normalizeValue(value: number, min: number, max: number): number {
        return Math.min(Math.max((value - min) / (max - min), 0), 1);
    }

    public getColorForValue(value: number, thresholds?: GaugeThreshold[]): string {
        if (!thresholds || thresholds.length === 0) return 'var(--color-primary)';

        // Sort thresholds asc
        const sorted = [...thresholds].sort((a, b) => a.value - b.value);

        // Find the last threshold that is <= value
        let color = sorted[0].color; // Default to first (lowest)

        for (const t of sorted) {
            if (value >= t.value) {
                color = t.color;
            }
        }

        return color;
    }
}

