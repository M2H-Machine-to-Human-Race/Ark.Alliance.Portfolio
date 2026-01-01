/**
 * @fileoverview Media Manager Model
 * Hook for managing media library with upload, search, and CRUD operations.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AdminMediaDto, MediaTypeEnum } from '@ark/portfolio-share';
import { authService } from '../../../services/auth.service';
import { API_CONFIG } from '../../../config/api.constants';

const API_URL = `${API_CONFIG.ADMIN_BASE_URL}/media`;

/**
 * Media type filter tabs.
 */
export type MediaTab = 'all' | 'image' | 'video' | 'audio' | 'pdf' | 'word' | 'excel' | 'markdown' | 'json' | 'other';

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
    const [activeTab, setActiveTab] = useState<MediaTab>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [editingItem, setEditingItem] = useState<AdminMediaDto | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    /**
     * Get auth headers for API requests.
     */
    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${authService.getToken()}` }
    });

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

            const response = await axios.get<MediaListResponse>(
                `${API_URL}?${params.toString()}`,
                getAuthHeaders()
            );
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
            const response = await axios.get<string[]>(`${API_URL}/tags`, getAuthHeaders());
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

            await axios.post(`${API_URL}/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${authService.getToken()}`,
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
            await axios.post(`${API_URL}/url`, {
                url,
                type,
                name: data.name,
                key: data.key,
                altText: data.altText,
                description: data.description,
                tags: data.tags
            }, getAuthHeaders());

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
            await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
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
            await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
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

