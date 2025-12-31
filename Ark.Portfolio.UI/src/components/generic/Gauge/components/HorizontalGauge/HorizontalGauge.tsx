import React from 'react';
import { GaugeProps } from '../../Gauge.types';
import { GaugeViewModel } from '../../Gauge.model';
import { cn } from '../../../../../utils/cn';
import './HorizontalGauge.styles.css';

export const HorizontalGauge: React.FC<GaugeProps> = ({
    value,
    min = 0,
    max = 100,
    label,
    className
}) => {
    const vm = new GaugeViewModel();
    const normalizedValue = vm.normalizeValue(value, min, max) * 100;
    const color = vm.getColorForValue(value);

    return (
        <div className={cn("horizontal-gauge w-full", className)}>
            <div className="flex justify-between mb-1">
                {label && <span className="text-sm font-medium text-slate-400">{label}</span>}
                <span className="text-sm font-bold text-white">{value} / {max}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div
                    className="h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${normalizedValue}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
};

