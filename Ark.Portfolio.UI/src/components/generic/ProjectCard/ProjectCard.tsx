import React from 'react';
import { GlassCard } from '../GlassCard';
import { TechBadge } from '../../TechBadge/TechBadge';
import { ExternalLink, Github } from 'lucide-react';
import { ProjectDto } from '@ark/portfolio-share';
import './ProjectCard.styles.css';

interface ProjectCardProps {
    project: ProjectDto;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    return (
        <GlassCard className="project-card group">
            <div className="project-card-image-container">
                {project.imageUrl && !project.imageUrl.endsWith('.png') ? (
                    <img src={project.imageUrl} alt={project.title} className="project-card-image" />
                ) : (
                    <div className="project-card-placeholder">
                        {project.imageUrl ? <img src={project.imageUrl} alt={project.title} className="opacity-50" onError={(e) => e.currentTarget.style.display = 'none'} /> : 'NO IMAGE'}
                    </div>
                )}
                <div className="project-card-overlay" />
            </div>

            <div className="project-card-content">
                <div className="project-card-header">
                    <div>
                        <h3 className="project-card-title">{project.title}</h3>
                        <span className="project-card-status">{project.status}</span>
                    </div>
                    <div className="project-card-actions">
                        {project.repoUrl && (
                            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="action-btn">
                                <Github size={20} />
                            </a>
                        )}
                        <button className="action-btn">
                            <ExternalLink size={20} />
                        </button>
                    </div>
                </div>

                <p className="project-card-description">{project.description}</p>

                <div className="project-card-footer">
                    <p className="tech-label">Technologies</p>
                    <div className="tech-list">
                        {project.technologies.map((t, idx) => {
                            const techKey = typeof t === 'string' ? t : t.name;
                            return <TechBadge key={techKey || idx} techKey={techKey} size="sm" showIcon />;
                        })}
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

