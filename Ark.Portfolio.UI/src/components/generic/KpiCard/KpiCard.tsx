import React, { useMemo } from 'react';
import { KpiCardProps } from './KpiCard.types';
import { KpiCardViewModel } from './KpiCard.model';
import { cn } from '../../../utils/cn';
import './KpiCard.styles.css';

// Simple SVG Sparkline
const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
    if (!data || data.length < 2) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((val, idx) => {
        const x = (idx / (data.length - 1)) * 100;
        const y = 100 - ((val - min) / range) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                points={points}
            />
        </svg>
    );
};

export const KpiCard: React.FC<KpiCardProps> = ({
    label,
    value,
    trend,
    trendLabel,
    icon,
    chartData,
    color,
    className
}) => {
    const vm = useMemo(() => new KpiCardViewModel(), []);

    return (
        <div className={cn("ark-kpi-card", className)}>
            <div className="ark-kpi-header">
                <span className="ark-kpi-label">{label}</span>
                {icon && <span className="ark-kpi-icon">{icon}</span>}
            </div>

            <div className="ark-kpi-value-container">
                <span className="ark-kpi-value">{value}</span>
            </div>

            {trend !== undefined && (
                <div className="ark-kpi-trend" style={{ color: vm.getTrendColor(trend) }}>
                    <span>{vm.getTrendIcon(trend)}</span>
                    <span>{Math.abs(trend)}%</span>
                    {trendLabel && <span className="ark-kpi-trend-label">{trendLabel}</span>}
                </div>
            )}

            {chartData && (
                <div className="ark-kpi-sparkline">
                    <Sparkline
                        data={chartData}
                        color={color || (trend && trend >= 0 ? '#10b981' : '#ef4444') || 'currentColor'}
                    />
                </div>
            )}
        </div>
    );
};

