/**
 * @fileoverview ProjectPresentation ViewModel
 * Business logic and state management for project presentation page.
 * 
 * Responsibilities:
 * - Fetch and manage project data
 * - Track active section navigation
 * - Build section content from project pages
 * - Handle admin actions
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ProjectSection,
    DEFAULT_PROJECT_SECTION,
    ProjectDto,
    TERMINOLOGY,
} from '@ark/portfolio-share';
import { projectService } from '../../../services/project.service';
import { SidebarNavItem } from '../../../components/ProjectSidebar';
import {
    ProjectPresentationModel,
    SectionContent,
} from './ProjectPresentation.types';

/**
 * Section display labels
 */
const SECTION_LABELS: Record<ProjectSection, string> = {
    [ProjectSection.OVERVIEW]: 'overview',
    [ProjectSection.ARCHITECTURE]: 'architecture',
    [ProjectSection.FUNCTIONAL]: 'functional',
    [ProjectSection.FEATURES]: 'features',
    [ProjectSection.TECHNICAL]: 'technical',
    [ProjectSection.ROADMAP]: 'roadmap',
    [ProjectSection.GALLERY]: 'gallery',
};

/**
 * Map project pages to section content
 */
const mapPageToSection = (
    page: any,
    projectTitle: string
): SectionContent | null => {
    if (!page) return null;

    const typeMap: Record<string, ProjectSection> = {
        overview: ProjectSection.OVERVIEW,
        architecture: ProjectSection.ARCHITECTURE,
        features: ProjectSection.FEATURES,
        technical: ProjectSection.TECHNICAL,
        roadmap: ProjectSection.ROADMAP,
        gallery: ProjectSection.GALLERY,
    };

    const sectionType = typeMap[page.type?.toLowerCase()] || ProjectSection.OVERVIEW;

    return {
        type: sectionType,
        title: page.title || SECTION_LABELS[sectionType],
        content: page.content || '',
        diagrams: page.diagrams || [],
        images: page.images || [],
    };
};

/**
 * ProjectPresentation ViewModel Hook
 * 
 * Manages page state, data fetching, and navigation.
 * 
 * @returns ViewModel state and actions
 */
export const useProjectPresentationModel = (): ProjectPresentationModel => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [project, setProject] = useState<ProjectDto | null>(null);
    const [activeSection, setActiveSection] = useState<ProjectSection>(
        DEFAULT_PROJECT_SECTION
    );

    /**
     * Check admin status
     */
    const isAdmin = useMemo(() => {
        const token = localStorage.getItem('auth_token');
        return !!token;
    }, []);

    /**
     * Build sidebar navigation items from project pages
     */
    const sections: SidebarNavItem[] = useMemo(() => {
        if (!project?.pages) {
            // Default sections if no pages defined
            return [
                { id: ProjectSection.OVERVIEW, label: 'Overview', isActive: false },
                { id: ProjectSection.FEATURES, label: 'Features', isActive: false },
                { id: ProjectSection.GALLERY, label: 'Gallery', isActive: false },
            ];
        }

        return project.pages.map((page: any) => ({
            id: page.type?.toLowerCase() as ProjectSection || ProjectSection.OVERVIEW,
            label: page.title || SECTION_LABELS[page.type?.toLowerCase() as ProjectSection] || 'Section',
            isActive: false,
        }));
    }, [project]);

    /**
     * Get current section content
     */
    const currentContent: SectionContent | null = useMemo(() => {
        if (!project) return null;

        // Find matching page for active section
        const page = project.pages?.find(
            (p: any) => p.type?.toLowerCase() === activeSection
        );

        if (page) {
            return mapPageToSection(page, project.title);
        }

        // Fallback: generate overview from project data
        if (activeSection === ProjectSection.OVERVIEW) {
            return {
                type: ProjectSection.OVERVIEW,
                title: project.title,
                content: project.description || '',
                diagrams: [],
                images: project.imageUrl ? [project.imageUrl] : [],
            };
        }

        return null;
    }, [project, activeSection]);

    /**
     * Fetch project data
     */
    const fetchProject = useCallback(async () => {
        if (!id) {
            setError('No project ID provided');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await projectService.getProjectById(id);
            if (data) {
                setProject(data);
            } else {
                setError('Project not found');
            }
        } catch (err) {
            console.error('Failed to fetch project:', err);
            setError('Failed to load project');
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    /**
     * Navigate back to projects list
     */
    const navigateBack = useCallback(() => {
        navigate('/projects');
    }, [navigate]);

    /**
     * Handle edit action (admin)
     */
    const handleEdit = useCallback(() => {
        if (project) {
            navigate(`/admin/projects/${project.id}`);
        }
    }, [navigate, project]);

    /**
     * Scroll to anchor within content
     */
    const scrollToAnchor = useCallback((anchor: string) => {
        const element = document.getElementById(anchor);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    /**
     * Fetch on mount
     */
    useEffect(() => {
        fetchProject();
    }, [fetchProject]);

    return {
        isLoading,
        error,
        project,
        activeSection,
        sections,
        currentContent,
        isAdmin,
        setActiveSection,
        navigateBack,
        handleEdit,
        scrollToAnchor,
    };
};
