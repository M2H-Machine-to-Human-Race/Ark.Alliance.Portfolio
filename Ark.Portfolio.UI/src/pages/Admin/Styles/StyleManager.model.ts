import { useState, useEffect } from 'react';
import axios from 'axios';
import { AdminStyleConfigDto } from '@ark/portfolio-share';
import { authService } from '../../../services/auth.service';

const API_URL = 'http://localhost:5085/api/admin/styles';

export const useStyleManagerModel = () => {
    const [styles, setStyles] = useState<AdminStyleConfigDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentStyle, setCurrentStyle] = useState<Partial<AdminStyleConfigDto>>({});

    useEffect(() => {
        fetchStyles();
    }, []);

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${authService.getToken()}` }
    });

    const fetchStyles = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_URL, getAuthHeaders());
            setStyles(response.data);
        } catch (err) {
            setError('Failed to fetch styles');
        } finally {
            setIsLoading(false);
        }
    };

    const handleActivate = async (id: number) => {
        try {
            await axios.put(`${API_URL}/${id}/activate`, {}, getAuthHeaders());
            fetchStyles();
        } catch (err) {
            setError('Failed to activate style');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this style?')) return;

        try {
            await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
            setStyles(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            setError('Failed to delete style');
        }
    };

    const handleSave = async (style: Partial<AdminStyleConfigDto>) => {
        try {
            if (style.id) {
                await axios.put(`${API_URL}/${style.id}`, style, getAuthHeaders());
            } else {
                await axios.post(API_URL, style, getAuthHeaders());
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

