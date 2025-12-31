import { useState, useEffect } from 'react';
import axios from 'axios';
import { AdminWidgetDto } from '@ark/portfolio-share';
import { authService } from '../../../services/auth.service';

const API_URL = 'http://localhost:5085/api/admin/widgets';

export const useWidgetManagerModel = () => {
    const [widgets, setWidgets] = useState<AdminWidgetDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentWidget, setCurrentWidget] = useState<Partial<AdminWidgetDto>>({});

    useEffect(() => {
        fetchWidgets();
    }, []);

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${authService.getToken()}` }
    });

    const fetchWidgets = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_URL, getAuthHeaders());
            setWidgets(response.data);
        } catch (err) {
            setError('Failed to fetch widgets');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this widget?')) return;

        try {
            await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
            setWidgets(prev => prev.filter(w => w.id !== id));
        } catch (err) {
            setError('Failed to delete widget');
        }
    };

    const handleSave = async (widget: Partial<AdminWidgetDto>) => {
        try {
            if (widget.id) {
                await axios.put(`${API_URL}/${widget.id}`, widget, getAuthHeaders());
            } else {
                await axios.post(API_URL, widget, getAuthHeaders());
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

