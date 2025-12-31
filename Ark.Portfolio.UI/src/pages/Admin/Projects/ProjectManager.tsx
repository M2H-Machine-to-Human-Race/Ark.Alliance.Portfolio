import React from 'react';
import { AdminLayout } from '../../../components/generic/AdminLayout';
import { useProjectManagerModel } from './ProjectManager.model';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import './ProjectManager.styles.css';

export const ProjectManager: React.FC = () => {
    const {
        projects,
        isLoading,
        error,
        handleDelete,
        setIsEditing,
        setCurrentProject
    } = useProjectManagerModel();

    return (
        <AdminLayout title="Projects">
            <div className="project-manager">
                <div className="pm-header">
                    <h2 className="pm-title">All Projects</h2>
                    <button
                        className="pm-add-btn"
                        onClick={() => {
                            setCurrentProject({});
                            setIsEditing(true);
                        }}
                    >
                        <Plus size={16} />
                        <span>Add Project</span>
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {isLoading ? (
                    <div>Loading projects...</div>
                ) : (
                    <div className="pm-grid">
                        {projects.map(project => (
                            <div key={project.id} className="pm-card">
                                <div className="pm-card-image" /> {/* Placeholder for image */}
                                <div className="pm-card-content">
                                    <span className="pm-card-status">{project.status}</span>
                                    <h3 className="pm-card-title">{project.title}</h3>
                                    <p className="pm-card-description">
                                        {project.description?.substring(0, 100)}...
                                    </p>
                                </div>
                                <div className="pm-card-actions">
                                    <button
                                        className="pm-action-btn"
                                        onClick={() => {
                                            setCurrentProject(project);
                                            setIsEditing(true);
                                        }}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        className="pm-action-btn delete"
                                        onClick={() => handleDelete(project.id!)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

