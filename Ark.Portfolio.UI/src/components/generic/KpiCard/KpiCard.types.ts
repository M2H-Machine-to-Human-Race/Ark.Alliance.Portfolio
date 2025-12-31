export interface KpiCardProps {
    label: string;
    value: string | number;
    trend?: number; // percentage
    trendLabel?: string;
    icon?: React.ReactNode;
    chartData?: number[]; // Simple array for sparkline
    color?: string; // Main color
    className?: string;
}

