import { useState, useEffect } from 'react';
import axios from 'axios';
import { AdminMenuItemDto } from '@ark/portfolio-share';
import { authService } from '../../../services/auth.service';

const API_URL = 'http://localhost:5085/api/admin/menu';

export const useMenuManagerModel = () => {
    const [menuItems, setMenuItems] = useState<AdminMenuItemDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<AdminMenuItemDto>>({});

    useEffect(() => {
        fetchMenu();
    }, []);

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${authService.getToken()}` }
    });

    const fetchMenu = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_URL, getAuthHeaders());
            setMenuItems(response.data);
        } catch (err) {
            setError('Failed to fetch menu items');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this menu item?')) return;

        try {
            await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
            setMenuItems(prev => prev.filter(i => i.id !== id));
        } catch (err) {
            setError('Failed to delete menu item');
        }
    };

    const handleSave = async (item: Partial<AdminMenuItemDto>) => {
        try {
            if (item.id) {
                await axios.put(`${API_URL}/${item.id}`, item, getAuthHeaders());
            } else {
                await axios.post(API_URL, item, getAuthHeaders());
            }
            setIsEditing(false);
            fetchMenu();
        } catch (err) {
            setError('Failed to save menu item');
        }
    };

    return {
        menuItems,
        isLoading,
        error,
        isEditing,
        setIsEditing,
        currentItem,
        setCurrentItem,
        handleDelete,
        handleSave
    };
};

