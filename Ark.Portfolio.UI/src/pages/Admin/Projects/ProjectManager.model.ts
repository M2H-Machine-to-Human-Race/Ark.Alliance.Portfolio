import { useState, useEffect } from 'react';
import axios from 'axios';
import { AdminProjectDto } from '@ark/portfolio-share';
import { authService } from '../../../services/auth.service';
import { API_CONFIG } from '../../../config/api.constants';

const API_URL = `${API_CONFIG.ADMIN_BASE_URL}/projects`;

export const useProjectManagerModel = () => {
    const [projects, setProjects] = useState<AdminProjectDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState<Partial<AdminProjectDto>>({});

    useEffect(() => {
        fetchProjects();
    }, []);

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${authService.getToken()}` }
    });

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_URL, getAuthHeaders());
            setProjects(response.data.items || []);
        } catch (err) {
            setError('Failed to fetch projects');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        try {
            await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
            setProjects(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            setError('Failed to delete project');
        }
    };

    const handleSave = async (project: Partial<AdminProjectDto>) => {
        try {
            if (project.id) {
                await axios.put(`${API_URL}/${project.id}`, project, getAuthHeaders());
            } else {
                await axios.post(API_URL, project, getAuthHeaders());
            }
            setIsEditing(false);
            fetchProjects();
        } catch (err) {
            setError('Failed to save project');
        }
    };

    return {
        projects,
        isLoading,
        error,
        isEditing,
        setIsEditing,
        currentProject,
        setCurrentProject,
        handleDelete,
        handleSave
    };
};

