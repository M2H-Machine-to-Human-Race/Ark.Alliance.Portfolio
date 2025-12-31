import { BaseComponentModel } from '../../base/BaseComponent.model';
import { Chart as ChartJS, registerables, ChartOptions } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

// Register ChartJS components centrally
ChartJS.register(...registerables, zoomPlugin);

export class GraphViewModel extends BaseComponentModel {

    public getMergedOptions(baseOptions: ChartOptions = {}, enableZoom: boolean = false): ChartOptions {
        const defaultOptions: ChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: 'rgba(156, 163, 175, 1)' // Gray-400
                    }
                },
                title: {
                    display: false,
                },
                zoom: enableZoom ? {
                    zoom: {
                        wheel: { enabled: true },
                        pinch: { enabled: true },
                        mode: 'xy',
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    }
                } : undefined
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(75, 85, 99, 0.2)'
                    },
                    ticks: {
                        color: 'rgba(156, 163, 175, 1)'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(75, 85, 99, 0.2)'
                    },
                    ticks: {
                        color: 'rgba(156, 163, 175, 1)'
                    }
                }
            }
        };

        return { ...defaultOptions, ...baseOptions };
    }
}

