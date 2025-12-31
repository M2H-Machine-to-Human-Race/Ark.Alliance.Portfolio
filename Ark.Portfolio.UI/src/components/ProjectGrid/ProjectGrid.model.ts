/**
 * @fileoverview ProjectGrid ViewModel
 * Manages project grid state, filtering, and selection.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useState, useMemo, useCallback } from 'react';

/**
 * Project status type
 */
export type ProjectStatus = 'completed' | 'in_progress' | 'planned' | 'archived';

/**
 * Project data structure
 */
export interface ProjectCardData {
    id: number | string;
    title: string;
    summary: string;
    description?: string;
    imageUrl?: string;
    technologies: string[];
    status: ProjectStatus;
    featured?: boolean;
    githubUrl?: string;
    liveUrl?: string;
    startDate?: string;
    endDate?: string;
}

/**
 * ProjectGrid ViewModel configuration
 */
export interface ProjectGridConfig {
    projects: ProjectCardData[];
    showAdmin?: boolean;
    onProjectClick?: (project: ProjectCardData) => void;
    onEdit?: (project: ProjectCardData) => void;
    onDelete?: (project: ProjectCardData) => void;
}

/**
 * ProjectGrid ViewModel state
 */
export interface ProjectGridModel {
    /** All projects */
    allProjects: ProjectCardData[];
    /** Filtered projects */
    filteredProjects: ProjectCardData[];
    /** Currently selected project (for modal) */
    selectedProject: ProjectCardData | null;
    /** Is modal open */
    isModalOpen: boolean;
    /** Current status filter */
    statusFilter: ProjectStatus | 'all';
    /** Current technology filter */
    techFilter: string | null;
    /** Search query */
    searchQuery: string;
    /** Available technologies for filtering */
    availableTechnologies: string[];
    /** Show admin controls */
    showAdmin: boolean;

    // Actions
    setStatusFilter: (status: ProjectStatus | 'all') => void;
    setTechFilter: (tech: string | null) => void;
    setSearchQuery: (query: string) => void;
    selectProject: (project: ProjectCardData) => void;
    closeModal: () => void;
    handleEdit: (project: ProjectCardData) => void;
    handleDelete: (project: ProjectCardData) => void;
    clearFilters: () => void;
}

/**
 * ProjectGrid ViewModel hook
 */
export const useProjectGridModel = (config: ProjectGridConfig): ProjectGridModel => {
    const {
        projects,
        showAdmin = false,
        onProjectClick,
        onEdit,
        onDelete,
    } = config;

    const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
    const [techFilter, setTechFilter] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProject, setSelectedProject] = useState<ProjectCardData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Extract unique technologies
    const availableTechnologies = useMemo(() => {
        const techSet = new Set<string>();
        projects.forEach(p => {
            p.technologies.forEach(tech => techSet.add(tech));
        });
        return Array.from(techSet).sort();
    }, [projects]);

    // Filter projects
    const filteredProjects = useMemo(() => {
        let result = [...projects];

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter(p => p.status === statusFilter);
        }

        // Technology filter
        if (techFilter) {
            result = result.filter(p =>
                p.technologies.some(t => t.toLowerCase() === techFilter.toLowerCase())
            );
        }

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.summary.toLowerCase().includes(query) ||
                p.technologies.some(t => t.toLowerCase().includes(query))
            );
        }

        // Sort: featured first, then by date
        result.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
        });

        return result;
    }, [projects, statusFilter, techFilter, searchQuery]);

    const selectProject = useCallback((project: ProjectCardData) => {
        setSelectedProject(project);
        setIsModalOpen(true);
        if (onProjectClick) {
            onProjectClick(project);
        }
    }, [onProjectClick]);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        // Delay clearing selection for animation
        setTimeout(() => setSelectedProject(null), 300);
    }, []);

    const handleEdit = useCallback((project: ProjectCardData) => {
        if (onEdit) onEdit(project);
    }, [onEdit]);

    const handleDelete = useCallback((project: ProjectCardData) => {
        if (onDelete) onDelete(project);
    }, [onDelete]);

    const clearFilters = useCallback(() => {
        setStatusFilter('all');
        setTechFilter(null);
        setSearchQuery('');
    }, []);

    return {
        allProjects: projects,
        filteredProjects,
        selectedProject,
        isModalOpen,
        statusFilter,
        techFilter,
        searchQuery,
        availableTechnologies,
        showAdmin,
        setStatusFilter,
        setTechFilter,
        setSearchQuery,
        selectProject,
        closeModal,
        handleEdit,
        handleDelete,
        clearFilters,
    };
};

export default useProjectGridModel;
