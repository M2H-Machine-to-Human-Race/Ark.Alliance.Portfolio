/**
 * @fileoverview Project Edit Modal
 * Modal form for creating and editing projects.
 * Follows MVVM pattern and reuses AdminForm.styles.css.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React, { useState, useEffect } from 'react';
import { AdminProjectDto, ProjectStatus } from '@ark/portfolio-share';
import { X, Save, Link, Github, Calendar, Star, Image as ImageIcon } from 'lucide-react';
import '../../../styles/AdminForm.styles.css';

interface ProjectEditModalProps {
    /** Project to edit (empty for new project) */
    project: Partial<AdminProjectDto>;
    /** Close modal handler */
    onClose: () => void;
    /** Save project handler */
    onSave: (project: Partial<AdminProjectDto>) => Promise<void>;
    /** Whether save is in progress */
    isSaving?: boolean;
}

/**
 * Project Edit Modal Component
 * 
 * Modal for creating/editing projects following admin design patterns.
 * Uses form state hook for controlled inputs.
 */
export const ProjectEditModal: React.FC<ProjectEditModalProps> = ({
    project,
    onClose,
    onSave,
    isSaving = false
}) => {
    // Form state
    const [formData, setFormData] = useState<Partial<AdminProjectDto>>({
        title: '',
        description: '',
        status: ProjectStatus.IN_PROGRESS,
        technologies: [],
        isFeatured: false,
        imageUrl: '',
        repositoryUrl: '',
        liveUrl: '',
        startDate: '',
        endDate: '',
    });
    const [techInput, setTechInput] = useState('');

    // Initialize form with project data
    useEffect(() => {
        if (project) {
            setFormData({
                ...project,
                startDate: project.startDate?.slice(0, 10) || '',
                endDate: project.endDate?.slice(0, 10) || '',
            });
        }
    }, [project]);

    // Handle form field changes
    const handleChange = (field: keyof AdminProjectDto, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Handle technology tags
    const handleAddTech = () => {
        if (techInput.trim() && !formData.technologies?.some(t =>
            typeof t === 'string' ? t === techInput : t.name === techInput
        )) {
            setFormData(prev => ({
                ...prev,
                technologies: [...(prev.technologies || []), { name: techInput.trim() }]
            }));
            setTechInput('');
        }
    };

    const handleRemoveTech = (index: number) => {
        setFormData(prev => ({
            ...prev,
            technologies: prev.technologies?.filter((_, i) => i !== index) || []
        }));
    };

    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
    };

    const isEdit = !!project?.id;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                {/* Header */}
                <div className="modal-header">
                    <h3>{isEdit ? 'Edit Project' : 'Add New Project'}</h3>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="admin-form">
                        {/* Title */}
                        <div className="admin-form-group">
                            <label className="admin-form-label admin-form-label-required">Title</label>
                            <input
                                type="text"
                                className="admin-form-input"
                                value={formData.title || ''}
                                onChange={e => handleChange('title', e.target.value)}
                                placeholder="Project name"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="admin-form-group">
                            <label className="admin-form-label admin-form-label-required">Description</label>
                            <textarea
                                className="admin-form-textarea"
                                value={formData.description || ''}
                                onChange={e => handleChange('description', e.target.value)}
                                rows={4}
                                placeholder="Project description..."
                                required
                            />
                        </div>

                        {/* Status & Featured */}
                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label className="admin-form-label">Status</label>
                                <select
                                    className="admin-form-select"
                                    value={formData.status || ProjectStatus.IN_PROGRESS}
                                    onChange={e => handleChange('status', e.target.value)}
                                >
                                    {Object.values(ProjectStatus).map(status => (
                                        <option key={status} value={status}>
                                            {status.replace(/_/g, ' ')}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.75rem' }}>
                                <input
                                    type="checkbox"
                                    id="isFeatured"
                                    checked={formData.isFeatured || false}
                                    onChange={e => handleChange('isFeatured', e.target.checked)}
                                    style={{ width: '1.25rem', height: '1.25rem', accentColor: '#8b5cf6' }}
                                />
                                <label htmlFor="isFeatured" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}>
                                    <Star size={16} style={{ color: formData.isFeatured ? '#eab308' : '#94a3b8' }} />
                                    Featured Project
                                </label>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label className="admin-form-label">
                                    <Calendar size={14} style={{ display: 'inline', marginRight: '0.375rem' }} />
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    className="admin-form-input"
                                    value={formData.startDate || ''}
                                    onChange={e => handleChange('startDate', e.target.value)}
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">
                                    <Calendar size={14} style={{ display: 'inline', marginRight: '0.375rem' }} />
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    className="admin-form-input"
                                    value={formData.endDate || ''}
                                    onChange={e => handleChange('endDate', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* URLs */}
                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label className="admin-form-label">
                                    <Github size={14} style={{ display: 'inline', marginRight: '0.375rem' }} />
                                    Repository URL
                                </label>
                                <input
                                    type="url"
                                    className="admin-form-input"
                                    value={formData.repositoryUrl || ''}
                                    onChange={e => handleChange('repositoryUrl', e.target.value)}
                                    placeholder="https://github.com/..."
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">
                                    <Link size={14} style={{ display: 'inline', marginRight: '0.375rem' }} />
                                    Live URL
                                </label>
                                <input
                                    type="url"
                                    className="admin-form-input"
                                    value={formData.liveUrl || ''}
                                    onChange={e => handleChange('liveUrl', e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        {/* Image URL */}
                        <div className="admin-form-group">
                            <label className="admin-form-label">
                                <ImageIcon size={14} style={{ display: 'inline', marginRight: '0.375rem' }} />
                                Image URL
                            </label>
                            <input
                                type="url"
                                className="admin-form-input"
                                value={formData.imageUrl || ''}
                                onChange={e => handleChange('imageUrl', e.target.value)}
                                placeholder="https://..."
                            />
                        </div>

                        {/* Technologies */}
                        <div className="admin-form-group">
                            <label className="admin-form-label">Technologies</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    className="admin-form-input"
                                    value={techInput}
                                    onChange={e => setTechInput(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                                    placeholder="Add technology..."
                                    style={{ flex: 1 }}
                                />
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-secondary"
                                    onClick={handleAddTech}
                                >
                                    Add
                                </button>
                            </div>
                            {formData.technologies && formData.technologies.length > 0 && (
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '0.375rem',
                                    marginTop: '0.75rem'
                                }}>
                                    {formData.technologies.map((tech, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.375rem',
                                                padding: '0.25rem 0.625rem',
                                                background: 'rgba(139, 92, 246, 0.1)',
                                                color: '#7c3aed',
                                                borderRadius: '6px',
                                                fontSize: '0.8125rem',
                                                fontWeight: 500,
                                            }}
                                        >
                                            {typeof tech === 'string' ? tech : tech.name}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTech(index)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    padding: '0.125rem',
                                                    cursor: 'pointer',
                                                    color: 'inherit',
                                                    opacity: 0.7,
                                                }}
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="modal-actions" style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '0.75rem',
                        marginTop: '1.5rem',
                        paddingTop: '1.5rem',
                        borderTop: '1px solid #f1f5f9'
                    }}>
                        <button
                            type="button"
                            className="admin-btn admin-btn-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="admin-btn admin-btn-primary"
                            disabled={isSaving || !formData.title || !formData.description}
                        >
                            <Save size={16} />
                            {isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectEditModal;
