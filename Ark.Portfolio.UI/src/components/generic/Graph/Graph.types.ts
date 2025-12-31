import { ChartData, ChartOptions } from 'chart.js';

export interface GraphProps {
    data: ChartData;
    type?: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar';
    options?: ChartOptions;
    title?: string;
    height?: number;
    enableZoom?: boolean;
    className?: string;
    onRefresh?: () => void;
}

