import React from 'react';
import { Layout } from '../../components/Layout/Layout';
import { Panel } from '../../components/generic/Panel';
import { Header } from '../../components/generic/Header';
import { TreeView } from '../../components/generic/TreeView';
import { DataGrid } from '../../components/generic/DataGrid';
import { MermaidDiagramReader } from '../../components/generic/MermaidDiagramReader';
// Analytics
import { KpiCard } from '../../components/generic/KpiCard';
import { Graph } from '../../components/generic/Graph';
// Gauges
import { CircularGauge, HorizontalGauge, Podometer } from '../../components/generic/Gauge';
// Forms
import { InputBox } from '../../components/generic/InputBox';
import { CheckBox } from '../../components/generic/CheckBox';
import { Toggle } from '../../components/generic/Toggle';
import { Icon } from '../../components/generic/Icon'; // Helper
import { ArchitecturePageViewModel } from './ArchitecturePage.model';
import './ArchitecturePage.styles.css';

export const ArchitecturePage = () => {
    const vm = new ArchitecturePageViewModel();

    return (
        <Layout>
            <div className="architecture-page space-y-6 animate-in fade-in duration-500">
                <Header
                    title="Component Registry"
                    subtitle="Advanced MVVM Component Suite"
                    variant="page"
                />

                {/* Row 1: KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard label="Code Coverage" value="84%" trend={12} trendLabel="vs last month" chartData={[20, 40, 30, 70, 50, 84]} />
                    <KpiCard label="Open Issues" value="23" trend={-5} trendLabel="improving" chartData={[50, 45, 40, 30, 25, 23]} color="#ef4444" />
                    <KpiCard label="Active Users" value="1.2k" trend={8} chartData={[800, 900, 1000, 1100, 1150, 1200]} />
                    <KpiCard label="Build Time" value="1.4s" trend={0} chartData={[1.5, 1.4, 1.4, 1.5, 1.4, 1.4]} color="#f59e0b" />
                </div>

                {/* Row 2: Diagrams & Graphs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
                    <Panel variant="glass" header={<h3 className="text-white font-bold">System Architecture</h3>} className="lg:col-span-1 flex flex-col">
                        <div className="flex-1 overflow-auto rounded bg-white/5 p-1 relative min-h-[300px]">
                            <MermaidDiagramReader
                                diagramSource={vm.getArchitectureDiagram()}
                                theme="dark" enableZoom={true} enablePan={true}
                            />
                        </div>
                    </Panel>

                    <Panel variant="glass" header={<h3 className="text-white font-bold">Velocity Graph (Zoomable)</h3>} className="lg:col-span-2 flex flex-col">
                        <div className="flex-1 p-2">
                            <Graph data={vm.graphData} type="line" enableZoom={true} height={320} />
                        </div>
                    </Panel>
                </div>

                {/* Row 3: Gauges & Forms */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Panel variant="glass" header={<h3 className="text-white font-bold">Live Gauges</h3>}>
                        <div className="flex flex-col items-center gap-6 p-4">
                            <div className="flex gap-4">
                                <CircularGauge value={75} size={100} label="CPU" units="%" />
                                <Podometer value={210} min={0} max={300} size={100} label="Speed" units="km/h"
                                    thresholds={[{ value: 0, color: '#10b981' }, { value: 200, color: '#ef4444' }]}
                                />
                            </div>
                            <HorizontalGauge value={45} label="Memory" units="GB" />
                        </div>
                    </Panel>

                    <Panel variant="glass" header={<h3 className="text-white font-bold">Interactive Forms</h3>}>
                        <div className="flex flex-col gap-4 p-4">
                            <InputBox label="Username" placeholder="Enter user..." leftIcon={<Icon name="user" size="sm" />} />
                            <InputBox label="Password" type="password" placeholder="••••••" validate={(v) => v.length < 6 ? 'Too short' : null} />
                            <div className="flex justify-between items-center">
                                <CheckBox label="Remember me" />
                                <Toggle label="2FA" size="sm" checked={true} />
                            </div>
                        </div>
                    </Panel>

                    <Panel variant="glass" header={<h3 className="text-white font-bold">TreeView</h3>} className="flex flex-col">
                        <div className="flex-1 overflow-auto p-2 h-[250px]">
                            <TreeView data={vm.getTreeData()} />
                        </div>
                    </Panel>
                </div>

                {/* Row 4: DataGrid */}
                <div className="h-[400px]">
                    <Panel variant="glass" header={<h3 className="text-white font-bold">Component Inventory</h3>} className="h-full flex flex-col">
                        <div className="flex-1 overflow-hidden p-4">
                            <DataGrid
                                columns={vm.componentColumns}
                                data={vm.componentData}
                                enableSorting={true}
                                enableFiltering={true}
                                theme="dark"
                            />
                        </div>
                    </Panel>
                </div>

            </div>
        </Layout>
    );
};

