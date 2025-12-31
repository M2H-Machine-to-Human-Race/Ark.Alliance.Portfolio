import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectDetailsViewModel } from './ProjectDetails.model';
import { Panel } from '../../components/generic/Panel';
import { Button } from '../../components/generic/Button';
import { Icon } from '../../components/generic/Icon';
import { ContentRenderer } from '../../components/ContentRenderer/ContentRenderer'; // Assuming this exists or I will create it
import { TechBadge } from '../../components/TechBadge/TechBadge';
import { ExternalLink, Github, ArrowLeft } from 'lucide-react';
import { cn } from '../../utils/cn';
import './ProjectDetails.styles.css';

export const ProjectDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const vm = useMemo(() => new ProjectDetailsViewModel(id!), [id]);
    const [_, setTick] = useState(0);

    useEffect(() => {
        const update = () => setTick(t => t + 1);
        // Bind VM update if supported, or just rely on state
        // For now, we rely on React state updates if VM was reactive, but here we just init
        vm.onInit().then(update);
    }, [vm]);

    if (vm.isLoading) {
        return <div className="flex h-full items-center justify-center text-slate-500">Loading Project...</div>;
    }

    if (!vm.project) {
        return (
            <div className="flex h-full items-center justify-center flex-col gap-4">
                <h2 className="text-xl text-slate-400">Project Not Found</h2>
                <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
            </div>
        );
    }

    return (
        <div className="project-details animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <button onClick={() => navigate('/projects')} className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                    <ArrowLeft size={20} /> Back to Projects
                </button>
            </div>

            <Panel variant="glass" className="border-t-4 border-t-blue-500">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">{vm.project.title}</h1>
                            <p className="text-lg text-slate-400 max-w-2xl">{vm.project.description}</p>
                        </div>
                        <div className="flex gap-3">
                            {vm.project.repoUrl && (
                                <a href={vm.project.repoUrl} target="_blank" rel="noreferrer" className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors text-white border border-slate-700">
                                    <Github size={24} />
                                </a>
                            )}
                            {vm.project.demoUrl && (
                                <a href={vm.project.demoUrl} target="_blank" rel="noreferrer" className="p-3 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors text-white shadow-lg shadow-blue-900/20">
                                    <ExternalLink size={24} />
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {vm.project.technologies.map((t, idx) => {
                            const name = typeof t === 'string' ? t : t.name;
                            return <TechBadge key={name || idx} name={name} size="md" />;
                        })}
                    </div>
                </div>
            </Panel>

            <div className="project-details__layout">
                {/* Sidebar Navigation */}
                <aside className="project-details__sidebar">
                    <Panel variant="glass" className="h-full">
                        <div className="p-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Presentation</h3>
                            <nav className="flex flex-col">
                                {(vm.project.pages || []).map(page => (
                                    <button
                                        key={page.id}
                                        onClick={() => {
                                            vm.setActivePage(page.id);
                                            setTick(t => t + 1);
                                        }}
                                        className={cn(
                                            "project-details__nav-btn",
                                            vm.activePageId === page.id && "project-details__nav-btn--active"
                                        )}
                                    >
                                        {page.title}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </Panel>
                </aside>

                {/* Main Content Area */}
                <main className="project-details__content min-h-[500px]">
                    {vm.activePageContent ? (
                        <Panel variant="glass" className="h-full">
                            <div className="p-8 markdown-content">
                                <ContentRenderer content={vm.activePageContent.content} />
                            </div>
                        </Panel>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">Select a section</div>
                    )}
                </main>
            </div>
        </div>
    );
};

