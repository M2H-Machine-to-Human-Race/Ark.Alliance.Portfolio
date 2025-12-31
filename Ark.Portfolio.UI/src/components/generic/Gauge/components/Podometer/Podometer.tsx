import React from 'react';
import { GaugeProps } from '../../Gauge.types';
import { GaugeViewModel } from '../../Gauge.model';
import { cn } from '../../../../../utils/cn';
import './Podometer.styles.css';

export const Podometer: React.FC<GaugeProps> = ({
    value,
    min = 0,
    max = 100,
    label,
    className
}) => {
    const vm = new GaugeViewModel();
    const normalizedValue = vm.normalizeValue(value, min, max) * 100;
    const color = vm.getColorForValue(value);

    // Angle: -90 (left) to 90 (right), normalized from 0-100 input
    const angle = (normalizedValue / 100) * 180 - 90;

    return (
        <div className={cn("podometer flex flex-col items-center", className)}>
            <div className="relative w-32 h-16 overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[12px] border-slate-700 box-border z-0" />

                {/* Needle */}
                <div
                    className="absolute bottom-0 left-1/2 w-1 h-14 bg-red-500 origin-bottom z-10 transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
                />
                <div className="absolute bottom-0 left-1/2 w-4 h-4 rounded-full bg-white transform -translate-x-1/2 translate-y-1/2 z-20" />
            </div>

            <div className="mt-4 text-center">
                <span className="text-2xl font-bold text-white block" style={{ color }}>{value}</span>
                {label && <span className="text-xs text-slate-500 uppercase">{label}</span>}
            </div>
        </div>
    );
};

