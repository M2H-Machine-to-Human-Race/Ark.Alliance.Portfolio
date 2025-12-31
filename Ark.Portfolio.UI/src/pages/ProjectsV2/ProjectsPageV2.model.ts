/**
 * @fileoverview ProjectsPageV2 ViewModel
 * Business logic and state management for projects page.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useState, useEffect } from 'react';
import { ProjectDto } from '@ark/portfolio-share';
import { projectService } from '../../services/project.service';

export interface ProjectsPageV2State {
    projects: ProjectDto[];
    isLoading: boolean;
    error: string | null;
}

/**
 * Custom hook for ProjectsPageV2 ViewModel
 */
export const useProjectsPageV2Model = () => {
    const [projects, setProjects] = useState<ProjectDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setIsLoading(true);
                const data = await projectService.getAll();
                setProjects(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch projects:', err);
                setError('Failed to load projects');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return {
        projects,
        isLoading,
        error
    };
};
