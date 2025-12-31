import { useState, useEffect } from 'react';
import axios from 'axios';
import { AdminCarouselItemDto } from '@ark/portfolio-share';
import { authService } from '../../../services/auth.service';

const API_URL = 'http://localhost:5085/api/admin/carousel';

export const useCarouselManagerModel = () => {
    const [items, setItems] = useState<AdminCarouselItemDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<AdminCarouselItemDto>>({});

    useEffect(() => {
        fetchItems();
    }, []);

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${authService.getToken()}` }
    });

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_URL, getAuthHeaders());
            setItems(response.data);
        } catch (err) {
            setError('Failed to fetch carousel items');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this slide?')) return;

        try {
            await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
            setItems(prev => prev.filter(i => i.id !== id));
        } catch (err) {
            setError('Failed to delete slide');
        }
    };

    const handleSave = async (item: Partial<AdminCarouselItemDto>) => {
        try {
            if (item.id) {
                await axios.put(`${API_URL}/${item.id}`, item, getAuthHeaders());
            } else {
                await axios.post(API_URL, item, getAuthHeaders());
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
            await axios.put(
                `${API_URL}/reorder`,
                { itemIds: newItems.map(i => i.id) },
                getAuthHeaders()
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

