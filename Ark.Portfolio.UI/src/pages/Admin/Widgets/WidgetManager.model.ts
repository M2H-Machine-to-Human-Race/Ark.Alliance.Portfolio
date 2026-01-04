/**
 * @fileoverview Widget Manager Model
 * Hook for managing widget configurations with CRUD operations.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useState, useEffect, useCallback } from 'react';
import { AdminWidgetDto } from '@ark/portfolio-share';
import { apiClient } from '../../../api/client/apiClient';
import { API_CONFIG } from '../../../config/api.constants';

const API_URL = `${API_CONFIG.ADMIN_BASE_URL}/widgets`;

export const useWidgetManagerModel = () => {
    const [widgets, setWidgets] = useState<AdminWidgetDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentWidget, setCurrentWidget] = useState<Partial<AdminWidgetDto>>({});

    const fetchWidgets = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get(API_URL);
            setWidgets(response.data);
        } catch (err) {
            setError('Failed to fetch widgets');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWidgets();
    }, [fetchWidgets]);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this widget?')) return;

        try {
            await apiClient.delete(`${API_URL}/${id}`);
            setWidgets(prev => prev.filter(w => w.id !== id));
        } catch (err) {
            setError('Failed to delete widget');
        }
    };

    const handleSave = async (widget: Partial<AdminWidgetDto>) => {
        try {
            if (widget.id) {
                await apiClient.put(`${API_URL}/${widget.id}`, widget);
            } else {
                await apiClient.post(API_URL, widget);
            }
            setIsEditing(false);
            fetchWidgets();
        } catch (err) {
            setError('Failed to save widget');
        }
    };

    return {
        widgets,
        isLoading,
        error,
        isEditing,
        setIsEditing,
        currentWidget,
        setCurrentWidget,
        handleDelete,
        handleSave
    };
};
