/**
 * @fileoverview Menu Manager Model
 * Hook for managing menu items with CRUD operations.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useState, useEffect, useCallback } from 'react';
import { AdminMenuItemDto } from '@ark/portfolio-share';
import { apiClient } from '../../../api/client/apiClient';
import { API_CONFIG } from '../../../config/api.constants';

const API_URL = `${API_CONFIG.ADMIN_BASE_URL}/menu`;

export const useMenuManagerModel = () => {
    const [menuItems, setMenuItems] = useState<AdminMenuItemDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<AdminMenuItemDto>>({});

    const fetchMenu = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get(API_URL);
            setMenuItems(response.data);
        } catch (err) {
            setError('Failed to fetch menu items');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMenu();
    }, [fetchMenu]);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this menu item?')) return;

        try {
            await apiClient.delete(`${API_URL}/${id}`);
            setMenuItems(prev => prev.filter(i => i.id !== id));
        } catch (err) {
            setError('Failed to delete menu item');
        }
    };

    const handleSave = async (item: Partial<AdminMenuItemDto>) => {
        try {
            if (item.id) {
                await apiClient.put(`${API_URL}/${item.id}`, item);
            } else {
                await apiClient.post(API_URL, item);
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
