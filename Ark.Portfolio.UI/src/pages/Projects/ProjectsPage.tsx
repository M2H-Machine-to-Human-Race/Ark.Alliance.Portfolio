import React, { useEffect, useRef, useState } from 'react';
import { Layout } from '../../components/Layout/Layout';
import { ProjectCard } from '../../components/generic/ProjectCard';
import { Header } from '../../components/generic/Header';
import { ProjectsViewModel } from './ProjectsPage.model';
import { ProjectDto } from '@ark/portfolio-share';
import './ProjectsPage.styles.css';

export const ProjectsPage = () => {
    const [projects, setProjects] = useState<ProjectDto[]>([]);
    const [loading, setLoading] = useState(true);

    const vm = useRef(new ProjectsViewModel());

    useEffect(() => {
        const init = async () => {
            await vm.current.onInit();
            setProjects(vm.current.projects);
            setLoading(vm.current.isLoading);
        };
        init();
        return () => vm.current.onDestroy();
    }, []);

    return (
        <Layout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <Header
                    title="Projects"
                    subtitle="Selected High-Impact Work"
                    variant="page"
                />

                {loading ? (
                    <div className="text-slate-500 flex justify-center py-20">Loading projects...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pb-10">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

