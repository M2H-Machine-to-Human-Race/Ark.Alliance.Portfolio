/**
 * @fileoverview Style Manager Model
 * Hook for managing style configurations with CRUD operations.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useState, useEffect, useCallback } from 'react';
import { AdminStyleConfigDto } from '@ark/portfolio-share';
import { apiClient } from '../../../api/client/apiClient';
import { API_CONFIG } from '../../../config/api.constants';

const API_URL = `${API_CONFIG.ADMIN_BASE_URL}/styles`;

export const useStyleManagerModel = () => {
    const [styles, setStyles] = useState<AdminStyleConfigDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentStyle, setCurrentStyle] = useState<Partial<AdminStyleConfigDto>>({});

    const fetchStyles = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get(API_URL);
            setStyles(response.data);
        } catch (err) {
            setError('Failed to fetch styles');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStyles();
    }, [fetchStyles]);

    const handleActivate = async (id: number) => {
        try {
            await apiClient.put(`${API_URL}/${id}/activate`, {});
            fetchStyles();
        } catch (err) {
            setError('Failed to activate style');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this style?')) return;

        try {
            await apiClient.delete(`${API_URL}/${id}`);
            setStyles(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            setError('Failed to delete style');
        }
    };

    const handleSave = async (style: Partial<AdminStyleConfigDto>) => {
        try {
            if (style.id) {
                await apiClient.put(`${API_URL}/${style.id}`, style);
            } else {
                await apiClient.post(API_URL, style);
            }
            setIsEditing(false);
            fetchStyles();
        } catch (err) {
            setError('Failed to save style');
        }
    };

    return {
        styles,
        isLoading,
        error,
        isEditing,
        setIsEditing,
        currentStyle,
        setCurrentStyle,
        handleActivate,
        handleDelete,
        handleSave
    };
};
