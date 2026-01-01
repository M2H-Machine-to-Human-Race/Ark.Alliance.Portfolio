/**
 * @fileoverview PortfolioPageV2 ViewModel
 * Manages portfolio data, project selection, and modal state.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useState, useEffect, useCallback } from 'react';
import { ProjectCardData } from '../../components/ProjectGrid/ProjectGrid.model';
import axios from 'axios';
import { API_CONFIG } from '../../config/api.constants';

const API_URL = API_CONFIG.BASE_URL;

/**
 * PortfolioPageV2 ViewModel state
 */
export interface PortfolioPageV2Model {
    /** Is data loading */
    isLoading: boolean;
    /** Error message if any */
    error: string | null;
    /** All projects */
    projects: ProjectCardData[];
    /** Currently selected project (for modal) */
    selectedProject: ProjectCardData | null;
    /** Is modal open */
    isModalOpen: boolean;
    /** Is admin mode */
    isAdmin: boolean;

    // Actions
    refetch: () => void;
    selectProject: (project: ProjectCardData) => void;
    closeModal: () => void;
    handleEdit: (project: ProjectCardData) => void;
    handleDelete: (project: ProjectCardData) => void;
}

/**
 * Map API project to ProjectCardData
 */
const mapProject = (project: any): ProjectCardData => ({
    id: project.id,
    title: project.title || project.name,
    summary: project.summary || project.description?.substring(0, 150) + '...',
    description: project.description,
    imageUrl: project.imageUrl || project.thumbnailUrl,
    technologies: project.technologies || project.techStack || [],
    status: project.status || 'completed',
    featured: project.featured || project.isFeatured || false,
    githubUrl: project.githubUrl || project.repositoryUrl,
    liveUrl: project.liveUrl || project.demoUrl,
    startDate: project.startDate,
    endDate: project.endDate,
});

/**
 * PortfolioPageV2 ViewModel hook
 */
export const usePortfolioPageV2Model = (): PortfolioPageV2Model => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [projects, setProjects] = useState<ProjectCardData[]>([]);
    const [selectedProject, setSelectedProject] = useState<ProjectCardData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const fetchProjects = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_URL}/projects`);
            const mappedProjects = (response.data || []).map(mapProject);

            // Sort: featured first, then by most recent
            mappedProjects.sort((a: ProjectCardData, b: ProjectCardData) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return 0;
            });

            setProjects(mappedProjects);

            // Check admin status
            const token = localStorage.getItem('auth_token');
            setIsAdmin(!!token);

        } catch (err) {
            setError('Failed to load projects');
            console.error('Projects fetch error:', err);
            // Set empty array on error
            setProjects([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const selectProject = useCallback((project: ProjectCardData) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        // Delay clearing selection for animation
        setTimeout(() => setSelectedProject(null), 300);
    }, []);

    const handleEdit = useCallback((project: ProjectCardData) => {
        window.location.href = `/admin/projects?edit=${project.id}`;
    }, []);

    const handleDelete = useCallback(async (project: ProjectCardData) => {
        if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
            try {
                await axios.delete(`${API_URL}/admin/projects/${project.id}`);
                fetchProjects();
            } catch (err) {
                alert('Failed to delete project');
            }
        }
    }, [fetchProjects]);

    return {
        isLoading,
        error,
        projects,
        selectedProject,
        isModalOpen,
        isAdmin,
        refetch: fetchProjects,
        selectProject,
        closeModal,
        handleEdit,
        handleDelete,
    };
};

export default usePortfolioPageV2Model;
