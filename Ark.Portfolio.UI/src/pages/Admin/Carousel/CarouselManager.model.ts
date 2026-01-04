/**
 * @fileoverview Carousel Manager Model
 * Hook for managing carousel items with CRUD operations.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useState, useEffect, useCallback } from 'react';
import { AdminCarouselItemDto } from '@ark/portfolio-share';
import { apiClient } from '../../../api/client/apiClient';
import { API_CONFIG } from '../../../config/api.constants';

const API_URL = `${API_CONFIG.ADMIN_BASE_URL}/carousel`;

export const useCarouselManagerModel = () => {
    const [items, setItems] = useState<AdminCarouselItemDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<AdminCarouselItemDto>>({});

    const fetchItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get(API_URL);
            setItems(response.data);
        } catch (err) {
            setError('Failed to fetch carousel items');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this slide?')) return;

        try {
            await apiClient.delete(`${API_URL}/${id}`);
            setItems(prev => prev.filter(i => i.id !== id));
        } catch (err) {
            setError('Failed to delete slide');
        }
    };

    const handleSave = async (item: Partial<AdminCarouselItemDto>) => {
        try {
            if (item.id) {
                await apiClient.put(`${API_URL}/${item.id}`, item);
            } else {
                await apiClient.post(API_URL, item);
            }
            setIsEditing(false);
            fetchItems();
        } catch (err) {
            setError('Failed to save slide');
        }
    };

    const handleReorder = async (direction: 'up' | 'down', index: number) => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === items.length - 1)
        ) return;

        const newItems = [...items];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
        setItems(newItems);

        try {
            await apiClient.put(
                `${API_URL}/reorder`,
                { itemIds: newItems.map(i => i.id) }
            );
        } catch (err) {
            setError('Failed to reorder slides');
            fetchItems(); // Revert on error
        }
    };

    return {
        items,
        isLoading,
        error,
        isEditing,
        setIsEditing,
        currentItem,
        setCurrentItem,
        handleDelete,
        handleSave,
        handleReorder
    };
};
