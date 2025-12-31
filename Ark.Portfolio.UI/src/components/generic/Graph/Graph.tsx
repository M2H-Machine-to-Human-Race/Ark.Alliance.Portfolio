import React, { useMemo, useRef } from 'react';
import { Chart } from 'react-chartjs-2';
import { GraphProps } from './Graph.types';
import { GraphViewModel } from './Graph.model';
import { cn } from '../../../utils/cn';
import { Button } from '../Button'; // Reuse generic button
import { Icon } from '../Icon';

export const Graph: React.FC<GraphProps> = ({
    data,
    type = 'line',
    options,
    title,
    height = 400,
    enableZoom = false,
    className,
    onRefresh
}) => {
    const vm = useMemo(() => new GraphViewModel(), []);
    const chartRef = useRef<any>(null);

    const mergedOptions = useMemo(() =>
        vm.getMergedOptions(options, enableZoom),
        [options, enableZoom]);

    const resetZoom = () => {
        if (chartRef.current) {
            chartRef.current.resetZoom();
        }
    };

    return (
        <div className={cn("flex flex-col gap-2 w-full h-full", className)}>
            {(title || enableZoom || onRefresh) && (
                <div className="flex justify-between items-center mb-2">
                    {title && <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>}
                    <div className="flex gap-2">
                        {enableZoom && (
                            <Button size="sm" variant="ghost" onClick={resetZoom} leftIcon={<Icon name="search" size="sm" />}>
                                Reset Zoom
                            </Button>
                        )}
                        {onRefresh && (
                            <Button size="sm" variant="ghost" onClick={onRefresh} leftIcon={<Icon name="refresh-cw" size="sm" />}>
                                Refresh
                            </Button>
                        )}
                    </div>
                </div>
            )}

            <div className="relative w-full" style={{ height: height }}>
                <Chart
                    ref={chartRef}
                    type={type}
                    data={data}
                    options={mergedOptions}
                />
            </div>
        </div>
    );
};

