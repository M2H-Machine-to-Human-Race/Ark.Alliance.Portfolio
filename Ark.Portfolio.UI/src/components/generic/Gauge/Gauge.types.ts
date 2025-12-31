export interface GaugeProps {
    value: number;
    min?: number;
    max?: number;
    label?: string;
    units?: string;
    size?: number | string;
    thresholds?: GaugeThreshold[];
    showValue?: boolean;
    className?: string;
}

export interface GaugeThreshold {
    value: number;
    color: string;
}

export type GaugeVariant = 'circular' | 'horizontal' | 'podometer';

