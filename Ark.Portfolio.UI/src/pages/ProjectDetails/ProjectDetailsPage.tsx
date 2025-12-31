import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProjectDetailsViewModel } from './ProjectDetailsPage.model';
import { Layout } from '../../components/Layout/Layout';
import { TechBadge } from '../../components/TechBadge/TechBadge';
import { Icon } from '../../components/generic/Icon';
import { ContentRenderer } from '../../components/ContentRenderer/ContentRenderer';
import { Carousel } from '../../components/Carousel/Carousel';
import './ProjectDetailsPage.styles.css';

export const ProjectDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const vm = useMemo(() => new ProjectDetailsViewModel(), []);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const init = async () => {
            if (id) {
                await vm.onInit(id);
                setTick(t => t + 1);
            }
        };
        init();
    }, [id, vm]);

    if (vm.isLoading) {
        return <Layout><div className="flex justify-center items-center h-screen">Loading Project...</div></Layout>;
    }

    if (!vm.project) {
        return <Layout><div className="flex justify-center items-center h-screen">Project not found</div></Layout>;
    }

    // Dynamic Pages Logic
    // We treat 'functional' as a special tab that renders the Carousel
    const isFunctional = vm.activeTab === 'functional';

    // For other tabs, we look for a matching page in the project data
    const activePage = vm.project.pages?.find(p => p.type?.toLowerCase() === vm.activeTab)
        || vm.project.pages?.find(p => p.type === 'OVERVIEW');

    return (
        <Layout>
            <div className="project-details-page animate-in fade-in duration-500">
                {/* Hero Section */}
                <div className="project-hero container mx-auto">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${vm.project.imageUrl})` }} />
                    <div className="project-hero-overlay">
                        <div className="w-full">
                            <Link to="/projects" className="text-slate-400 hover:text-white mb-4 inline-flex items-center gap-2">
                                <Icon name="arrow-left" size="sm" /> Back to Projects
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{vm.project.title}</h1>
                            <div className="flex flex-wrap gap-3">
                                {vm.project.technologies.map((tech, idx) => {
                                    const name = typeof tech === 'string' ? tech : tech.name;
                                    return <TechBadge key={name || idx} name={name} size="sm" className="bg-slate-900/80 border-slate-700" />;
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="container mx-auto project-content-grid">
                    {/* Sidebar Nav */}
                    <aside>
                        <nav className="glass-nav space-y-2">
                            {['Overview', 'Functional', 'Technical'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => { vm.setActiveTab(tab.toLowerCase()); setTick(t => t + 1); }}
                                    className={`nav-item w-full text-left ${vm.activeTab === tab.toLowerCase() ? 'active' : ''}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>

                        <div className="mt-6 space-y-3">
                            {vm.project.repoUrl && (
                                <a href={vm.project.repoUrl} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-2 text-slate-400 hover:text-white p-2 rounded hover:bg-slate-800/50 transition-colors">
                                    <Icon name="github" size="sm" /> Source Code
                                </a>
                            )}
                            {vm.project.demoUrl && (
                                <a href={vm.project.demoUrl} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-2 text-slate-400 hover:text-white p-2 rounded hover:bg-slate-800/50 transition-colors">
                                    <Icon name="external-link" size="sm" /> Live Demo
                                </a>
                            )}
                        </div>
                    </aside>

                    {/* Content Area */}
                    <main className="space-y-8 min-h-[500px]">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
                            <h2 className="text-2xl font-bold text-white mb-6 capitalize border-b border-slate-700 pb-4">
                                {isFunctional ? 'Functional Gallery' : activePage?.title || 'Overview'}
                            </h2>

                            {isFunctional ? (
                                <Carousel items={vm.project.features || []} />
                            ) : (
                                <div className="prose prose-invert max-w-none text-slate-300">
                                    <ContentRenderer content={activePage?.content || 'No content available for this section.'} />
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </Layout>
    );
};

