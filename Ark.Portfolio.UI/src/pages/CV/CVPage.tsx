import React, { useEffect, useMemo, useState } from 'react';
import { CVPageViewModel } from './CVPage.model';
import { Layout } from '../../components/Layout/Layout';
import { Timeline } from '../../components/generic/Timeline';
import { Header } from '../../components/generic/Header';
import { Panel } from '../../components/generic/Panel';
import { Icon } from '../../components/generic/Icon';
import { TechBadge } from '../../components/TechBadge/TechBadge';
import './CVPage.styles.css';

export const CVPage = () => {
    const [tick, setTick] = useState(0);
    const vm = useMemo(() => new CVPageViewModel(), []);

    useEffect(() => {
        const init = async () => {
            await vm.onInit();
            setTick(t => t + 1);
        };
        init();
    }, [vm]);

    if (vm.isLoading) {
        return <Layout><div className="flex h-screen items-center justify-center">Loading Resume...</div></Layout>;
    }

    return (
        <Layout>
            <div className="cv-page space-y-10 animate-in fade-in duration-500">
                <Header
                    title="Resume"
                    subtitle="Professional Journey & Expertise"
                    variant="page"
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Timelines (2/3 width) */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Experience */}
                        <section>
                            <h2 className="cv-section-title">
                                <Icon name="briefcase" size="md" /> Experience
                            </h2>
                            <Timeline entries={vm.experienceTimeline} className="ml-2" />
                        </section>

                        {/* Education */}
                        <section>
                            <h2 className="cv-section-title">
                                <Icon name="graduation-cap" size="md" /> Education
                            </h2>
                            <Timeline entries={vm.educationTimeline} className="ml-2" />
                        </section>
                    </div>

                    {/* Right Column: Skills (1/3 width) */}
                    <div className="space-y-8">
                        {/* Backend Skills */}
                        <Panel variant="glass" header={<h3 className="text-white font-bold">Backend Proficiency</h3>}>
                            <div className="p-4 cv-skills-grid">
                                {vm.backendSkills.map((skill, i) => (
                                    <TechBadge key={i} name={skill.name} size="md" className="tech-tag" />
                                ))}
                                {vm.backendSkills.length === 0 && <span className="text-slate-500 italic">No backend skills listed</span>}
                            </div>
                        </Panel>

                        {/* Frontend Skills */}
                        <Panel variant="glass" header={<h3 className="text-white font-bold">Frontend Proficiency</h3>}>
                            <div className="p-4 cv-skills-grid">
                                {vm.frontendSkills.map((skill, i) => (
                                    <TechBadge key={i} name={skill.name} size="md" className="tech-tag" />
                                ))}
                            </div>
                        </Panel>

                        {/* Specialized/Other */}
                        <Panel variant="glass" header={<h3 className="text-white font-bold">Specialized Tools</h3>}>
                            <div className="p-4 cv-skills-grid">
                                {vm.specializedSkills.map((skill, i) => (
                                    <TechBadge key={i} name={skill.name} size="md" className="tech-tag" />
                                ))}
                            </div>
                        </Panel>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

