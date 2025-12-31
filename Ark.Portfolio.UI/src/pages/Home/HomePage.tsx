import React, { useEffect, useMemo, useState } from 'react';
import { HomeViewModel } from './HomePage.model';
import { Layout } from '../../components/Layout/Layout';
import { Panel } from '../../components/generic/Panel';
import { Button } from '../../components/generic/Button';
import { Icon } from '../../components/generic/Icon';
import { useNavigate } from 'react-router-dom';
import { Carousel } from '../../components/generic/Carousel';
import { ProjectCard } from '../../components/generic/ProjectCard/ProjectCard';
import { CarouselItem } from '../../components/generic/Carousel/Carousel.types';
import { Github, Linkedin, Mail } from 'lucide-react';
import './HomePage.styles.css';

export const HomePage = () => {
    const navigate = useNavigate();
    const vm = useMemo(() => new HomeViewModel(), []);
    const [randomTick, setRandomTick] = useState(0);

    useEffect(() => {
        vm.onDataUpdate = () => setRandomTick(t => t + 1);
        vm.onInit();
        return () => vm.onDestroy();
    }, [vm]);

    const carouselItems: CarouselItem[] = useMemo(() => {
        return vm.featuredProjects.map((p, idx) => ({
            id: p.id || `project-${idx}`,
            content: (
                <div className="carousel-slide cursor-pointer" onClick={() => navigate(`/projects/${p.id}`)}>
                    {/* Background Image */}
                    <img
                        src={p.imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200&h=600'}
                        alt={p.title}
                        className="carousel-slide__image"
                    />
                    {/* Gradient Overlay */}
                    <div className="carousel-slide__overlay" />
                    {/* Content */}
                    <div className="carousel-slide__content">
                        <h3 className="carousel-slide__title">{p.title}</h3>
                        <p className="carousel-slide__description">{p.description}</p>
                    </div>
                </div>
            ),
            title: p.title
        }));
    }, [vm.featuredProjects, navigate]);

    if (vm.isLoading && !vm.profile) {
        return <Layout><div className="flex h-full items-center justify-center text-slate-500">Loading Portfolio...</div></Layout>;
    }

    return (
        <Layout>
            <div className="home-page space-y-10 animate-in fade-in duration-500">
                {/* Hero Section - Profile Introduction */}
                {vm.profile && (
                    <section className="hero-section relative overflow-hidden rounded-3xl border border-slate-800/50">
                        {/* Background Image with Overlay */}
                        <div className="absolute inset-0 z-0">
                            {vm.profile.avatarUrl && (
                                <img
                                    src={vm.profile.avatarUrl}
                                    alt="Background"
                                    className="w-full h-full object-cover opacity-20 blur-sm"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/80" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 p-8 md:p-12 lg:p-16">
                            <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-1 shadow-2xl shadow-blue-900/30">
                                        {vm.profile.avatarUrl ? (
                                            <img
                                                src={vm.profile.avatarUrl}
                                                alt={`${vm.profile.firstName} ${vm.profile.lastName}`}
                                                className="w-full h-full rounded-xl object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-4xl font-black text-white">
                                                {vm.profile.firstName[0]}{vm.profile.lastName[0]}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1">
                                    <h1 className="text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight">
                                        {vm.profile.firstName} <span className="text-blue-400">{vm.profile.lastName}</span>
                                    </h1>
                                    <p className="text-lg lg:text-xl text-blue-300 font-medium mb-6">
                                        {vm.profile.title}
                                    </p>
                                    <p className="text-slate-400 text-base lg:text-lg leading-relaxed max-w-3xl mb-8">
                                        {vm.profile.overview}
                                    </p>

                                    {/* Social Links */}
                                    <div className="flex flex-wrap gap-3">
                                        {vm.profile.githubUrl && (
                                            <a
                                                href={vm.profile.githubUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-all border border-slate-700"
                                            >
                                                GitHub <Github size={18} />
                                            </a>
                                        )}
                                        {vm.profile.linkedinUrl && (
                                            <a
                                                href={vm.profile.linkedinUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-all border border-slate-700"
                                            >
                                                LinkedIn <Linkedin size={18} />
                                            </a>
                                        )}
                                        {vm.profile.email && (
                                            <a
                                                href={`mailto:${vm.profile.email}`}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-all shadow-lg shadow-blue-900/30"
                                            >
                                                Contact <Mail size={18} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Featured Projects Carousel */}
                {carouselItems.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Icon name="star" className="text-yellow-400" /> Featured Projects
                            </h3>
                            <Button variant="outline" onClick={() => navigate('/projects')}>
                                View All Projects
                            </Button>
                        </div>
                        <Carousel
                            items={carouselItems}
                            autoPlayInterval={5000}
                            showControls={true}
                            showIndicators={true}
                            className="shadow-2xl shadow-blue-900/20"
                        />
                    </section>
                )}

                {/* Quick Navigation */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div onClick={() => navigate('/cv')} className="cursor-pointer">
                        <Panel variant="glass" className="p-6 hover:border-blue-500/30 transition-colors h-full">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white">Curriculum Vitae</h3>
                                    <p className="text-sm text-slate-400">Experience & Skills</p>
                                </div>
                                <div className="p-3 bg-blue-500/10 rounded-xl">
                                    <Icon name="file-text" className="text-blue-400" />
                                </div>
                            </div>
                        </Panel>
                    </div>

                    <div onClick={() => navigate('/architecture')} className="cursor-pointer">
                        <Panel variant="glass" className="p-6 hover:border-violet-500/30 transition-colors h-full">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white">Architecture</h3>
                                    <p className="text-sm text-slate-400">System Design</p>
                                </div>
                                <div className="p-3 bg-violet-500/10 rounded-xl">
                                    <Icon name="layers" className="text-violet-400" />
                                </div>
                            </div>
                        </Panel>
                    </div>

                    <div onClick={() => navigate('/projects')} className="cursor-pointer">
                        <Panel variant="glass" className="p-6 hover:border-emerald-500/30 transition-colors h-full">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white">Projects</h3>
                                    <p className="text-sm text-slate-400">Portfolio Showcase</p>
                                </div>
                                <div className="p-3 bg-emerald-500/10 rounded-xl">
                                    <Icon name="folder" className="text-emerald-400" />
                                </div>
                            </div>
                        </Panel>
                    </div>

                    <div onClick={() => navigate('/admin/dashboard')} className="cursor-pointer">
                        <Panel variant="glass" className="p-6 hover:border-rose-500/30 transition-colors h-full">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white">Admin Portal</h3>
                                    <p className="text-sm text-slate-400">System Management</p>
                                </div>
                                <div className="p-3 bg-rose-500/10 rounded-xl">
                                    <Icon name="settings" className="text-rose-400" />
                                </div>
                            </div>
                        </Panel>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

