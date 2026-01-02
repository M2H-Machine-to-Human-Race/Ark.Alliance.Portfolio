/**
 * @fileoverview Project Edit Page
 * Dedicated page for creating and editing projects.
 * Replaces the previous modal-based editing approach.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminProjectDto, ProjectStatus } from '@ark/portfolio-share';
import {
    ArrowLeft, Save, Link, Github, Calendar, Star,
    Image as ImageIcon, Package, ExternalLink
} from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { apiClient } from '../../../api/client';
import '../../../styles/AdminForm.styles.css';
import './ProjectEditPage.styles.css';

/**
 * Project Edit Page Component
 * 
 * Provides a dedicated page for project CRUD operations.
 * Features:
 * - Full form with all project fields including packageUrl
 * - Toast notifications on save
 * - Breadcrumb navigation
 * - Loading states
 */
export const ProjectEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const isEdit = Boolean(id);

    // Form state
    const [formData, setFormData] = useState<Partial<AdminProjectDto>>({
        title: '',
        description: '',
        status: ProjectStatus.IN_PROGRESS,
        technologies: [],
        isFeatured: false,
        imageUrl: '',
        repositoryUrl: '',
        packageUrl: '',
        liveUrl: '',
        startDate: '',
        endDate: '',
    });
    const [techInput, setTechInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Load project data for editing
    useEffect(() => {
        if (id) {
            loadProject(id);
        }
    }, [id]);

    const loadProject = async (projectId: string) => {
        setIsLoading(true);
        try {
            const project = await apiClient.get<AdminProjectDto>(`/api/admin/projects/${projectId}`);
            if (project) {
                setFormData({
                    ...project,
                    startDate: project.startDate?.slice(0, 10) || '',
                    endDate: project.endDate?.slice(0, 10) || '',
                });
            } else {
                showToast('Failed to load project', 'error');
                navigate('/admin/projects');
            }
        } catch (error) {
            showToast('Error loading project', 'error');
            navigate('/admin/projects');
        } finally {
            setIsLoading(false);
        }
    };

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

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (isEdit && id) {
                await apiClient.put(`/api/admin/projects/${id}`, formData);
            } else {
                await apiClient.post('/api/admin/projects', formData);
            }

            showToast(
                isEdit ? 'Project updated successfully!' : 'Project created successfully!',
                'success'
            );
            navigate('/admin/projects');
        } catch (error) {
            showToast('Error saving project', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Handle cancel/back navigation
    const handleBack = () => {
        navigate('/admin/projects');
    };

    if (isLoading) {
        return (
            <div className="project-edit-page">
                <div className="project-edit-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading project...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="project-edit-page">
            {/* Header with breadcrumb */}
            <div className="project-edit-header">
                <button className="back-button" onClick={handleBack}>
                    <ArrowLeft size={20} />
                    <span>Back to Projects</span>
                </button>
                <h1>{isEdit ? 'Edit Project' : 'Create New Project'}</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="project-edit-form">
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
                        <div className="admin-form-group featured-checkbox">
                            <input
                                type="checkbox"
                                id="isFeatured"
                                checked={formData.isFeatured || false}
                                onChange={e => handleChange('isFeatured', e.target.checked)}
                            />
                            <label htmlFor="isFeatured">
                                <Star size={16} className={formData.isFeatured ? 'star-active' : ''} />
                                Featured Project
                            </label>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-form-label">
                                <Calendar size={14} />
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
                                <Calendar size={14} />
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

                    {/* URLs Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <ExternalLink size={18} />
                            Links & URLs
                        </h3>

                        {/* Repository URL */}
                        <div className="admin-form-group">
                            <label className="admin-form-label">
                                <Github size={14} />
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

                        {/* Package URL */}
                        <div className="admin-form-group">
                            <label className="admin-form-label">
                                <Package size={14} />
                                Package URL
                                <span className="label-hint">(NPM, NuGet, etc.)</span>
                            </label>
                            <input
                                type="url"
                                className="admin-form-input"
                                value={formData.packageUrl || ''}
                                onChange={e => handleChange('packageUrl', e.target.value)}
                                placeholder="https://www.npmjs.com/package/..."
                            />
                        </div>

                        {/* Live URL */}
                        <div className="admin-form-group">
                            <label className="admin-form-label">
                                <Link size={14} />
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
                            <ImageIcon size={14} />
                            Image URL
                        </label>
                        <input
                            type="url"
                            className="admin-form-input"
                            value={formData.imageUrl || ''}
                            onChange={e => handleChange('imageUrl', e.target.value)}
                            placeholder="/Assets/Projects/..."
                        />
                    </div>

                    {/* Technologies */}
                    <div className="admin-form-group">
                        <label className="admin-form-label">Technologies</label>
                        <div className="tech-input-row">
                            <input
                                type="text"
                                className="admin-form-input"
                                value={techInput}
                                onChange={e => setTechInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                                placeholder="Add technology..."
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
                            <div className="tech-tags">
                                {formData.technologies.map((tech, index) => (
                                    <span key={index} className="tech-tag">
                                        {typeof tech === 'string' ? tech : tech.name}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTech(index)}
                                            className="tech-tag-remove"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="project-edit-actions">
                    <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        onClick={handleBack}
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
    );
};

export default ProjectEditPage;
