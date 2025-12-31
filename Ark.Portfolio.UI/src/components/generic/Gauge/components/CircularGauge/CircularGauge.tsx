import React from 'react';
import { GaugeProps } from '../../Gauge.types';
import { GaugeViewModel } from '../../Gauge.model';
import { cn } from '../../../../../utils/cn';
import './CircularGauge.styles.css';

export const CircularGauge: React.FC<GaugeProps> = ({
    value,
    min = 0,
    max = 100,
    label,
    className
}) => {
    const vm = new GaugeViewModel();
    const normalizedValue = vm.normalizeValue(value, min, max) * 100;
    const color = vm.getColorForValue(value);

    // SVG calculations
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (normalizedValue / 100) * circumference;

    return (
        <div className={cn("circular-gauge", className)}>
            <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        className="stroke-slate-700 fill-none"
                        strokeWidth="8"
                    />
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        className="fill-none transition-all duration-1000 ease-out"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        stroke={color}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">{value}</span>
                </div>
            </div>
            {label && <span className="circular-gauge-label">{label}</span>}
        </div>
    );
};

