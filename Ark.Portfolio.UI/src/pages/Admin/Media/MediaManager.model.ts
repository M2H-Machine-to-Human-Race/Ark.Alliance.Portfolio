/**
 * @fileoverview Media Manager Model
 * Hook for managing media library with upload, search, and CRUD operations.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../api/client/apiClient';
import { AdminMediaDto, MediaTypeEnum } from '@ark/portfolio-share';

/**
 * Media tab filter type.
 * 
 * @remarks
 * Combines 'all' filter option with MediaTypeEnum values from the shared layer.
 * 'all' is UI-specific and not persisted to the database.
 */
export type MediaTabFilter = 'all' | `${MediaTypeEnum}`;
export type MediaTab = MediaTabFilter;

/**
 * Media list response from API.
 */
interface MediaListResponse {
    items: AdminMediaDto[];
    total: number;
}

/**
 * Upload form data.
 */
export interface UploadFormData {
    name: string;
    key?: string;
    altText?: string;
    description?: string;
    tags: string[];
    isPublic: boolean;
}

/**
 * Media Manager view model hook.
 * @returns Media management state and operations
 */
export const useMediaManagerModel = () => {
    const [media, setMedia] = useState<AdminMediaDto[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState<MediaTabFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [editingItem, setEditingItem] = useState<AdminMediaDto | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    /**
     * Show success message briefly.
     */
    const showSuccess = (msg: string) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(''), 3000);
    };

    /**
     * Show error message briefly.
     */
    const showError = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(''), 5000);
    };

    /**
     * Fetch media list with current filters.
     */
    const fetchMedia = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (activeTab !== 'all') params.append('type', activeTab);
            if (searchQuery) params.append('search', searchQuery);
            if (selectedTags.length) params.append('tags', selectedTags.join(','));

            // NOTE: Using apiClient. BaseURL handles the domain. We need path relative to base.
            // Assuming base is /api
            const response = await apiClient.get<MediaListResponse>(`/admin/media?${params.toString()}`);
            setMedia(response.data.items || []);
            setTotalCount(response.data.total || 0);
        } catch (err) {
            showError('Failed to fetch media');
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, searchQuery, selectedTags]);

    /**
     * Fetch available tags.
     */
    const fetchTags = useCallback(async () => {
        try {
            const response = await apiClient.get<string[]>(`/admin/media/tags`);
            setAvailableTags(response.data);
        } catch (err) {
            console.error('Failed to fetch tags');
        }
    }, []);

    useEffect(() => {
        fetchMedia();
        fetchTags();
    }, [fetchMedia, fetchTags]);

    /**
     * Upload a new file.
     * @param file - File to upload
     * @param data - Upload form data
     */
    const uploadFile = async (file: File, data: UploadFormData) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', data.name || file.name);
            if (data.key) formData.append('key', data.key);
            if (data.altText) formData.append('altText', data.altText);
            if (data.description) formData.append('description', data.description);
            if (data.tags.length) formData.append('tags', JSON.stringify(data.tags));
            formData.append('isPublic', String(data.isPublic));

            // Content-Type multipart/form-data is usually handled automatically by browser when passing FormData
            // But if we defined 'application/json' in apiClient defaults, we might need to override it or let axios handle it.
            // Axios generally handles FormData correctly by setting the boundary.
            await apiClient.post(`/admin/media/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            showSuccess('File uploaded successfully');
            await fetchMedia();
            await fetchTags();
            closeUploadModal();
        } catch (err: any) {
            showError(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    /**
     * Create media from URL.
     */
    const createFromUrl = async (url: string, type: MediaTypeEnum, data: UploadFormData) => {
        setUploading(true);
        try {
            await apiClient.post(`/admin/media/url`, {
                url,
                type,
                name: data.name,
                key: data.key,
                altText: data.altText,
                description: data.description,
                tags: data.tags
            });

            showSuccess('Media created successfully');
            await fetchMedia();
            await fetchTags();
            closeUploadModal();
        } catch (err: any) {
            showError(err.response?.data?.message || 'Creation failed');
        } finally {
            setUploading(false);
        }
    };

    /**
     * Update media metadata.
     */
    const updateMedia = async (id: string, data: Partial<UploadFormData>) => {
        try {
            await apiClient.put(`/admin/media/${id}`, data);
            showSuccess('Media updated');
            await fetchMedia();
            await fetchTags();
            closeEditModal();
        } catch (err) {
            showError('Update failed');
        }
    };

    /**
     * Delete a media item.
     */
    const deleteMedia = async (id: string) => {
        if (!confirm('Delete this media permanently?')) return;
        try {
            await apiClient.delete(`/admin/media/${id}`);
            showSuccess('Media deleted');
            await fetchMedia();
        } catch (err) {
            showError('Delete failed');
        }
    };

    /**
     * Handle file input change (quick upload).
     */
    const handleQuickUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        await uploadFile(file, {
            name: file.name,
            tags: [],
            isPublic: true
        });

        event.target.value = ''; // Reset input
    };

    // Modal helpers
    const openUploadModal = () => setIsUploadModalOpen(true);
    const closeUploadModal = () => setIsUploadModalOpen(false);

    const openEditModal = (item: AdminMediaDto) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => {
        setEditingItem(null);
        setIsEditModalOpen(false);
    };

    return {
        // Data
        media,
        totalCount,
        availableTags,

        // State
        isLoading,
        uploading,
        error,
        success,
        activeTab,
        searchQuery,
        selectedTags,
        editingItem,
        isUploadModalOpen,
        isEditModalOpen,
        viewMode,

        // Setters
        setActiveTab,
        setSearchQuery,
        setSelectedTags,
        setViewMode,

        // Operations
        uploadFile,
        createFromUrl,
        updateMedia,
        deleteMedia,
        handleQuickUpload,

        // Modals
        openUploadModal,
        closeUploadModal,
        openEditModal,
        closeEditModal,

        // Refresh
        refresh: fetchMedia
    };
};

