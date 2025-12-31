/**
 * @fileoverview Admin API Service
 * Centralized service for all admin CRUD operations.
 * 
 * @author Armand Richelet-Kleinberg
 */

import axios from 'axios';
import { authService } from '../../services/auth.service';
import {
    AdminProjectDto,
    AdminWidgetDto,
    AdminMenuItemDto,
    AdminStyleConfigDto,
    AdminCarouselItemDto,
    ReorderWidgetsDto,
    ReorderMenuItemsDto,
    ReorderCarouselDto,
    AdminMediaDto,
    CreateMediaFromUrlDto,
    PaginatedResponseDto,
    CrudResponseDto,
} from '@ark/portfolio-share';
import { API_CONFIG } from '../../config/api.constants';

const API_BASE = API_CONFIG.ADMIN_BASE_URL;

const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${authService.getToken()}` }
});

// ============================================
// Projects
// ============================================
export const AdminProjectApi = {
    getAll: async (page = 1, pageSize = 10, search?: string) => {
        const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
        if (search) params.append('search', search);
        const response = await axios.get(`${API_BASE}/projects?${params}`, getAuthHeaders());
        return response.data;
    },
    getById: async (id: string) => {
        const response = await axios.get(`${API_BASE}/projects/${id}`, getAuthHeaders());
        return response.data;
    },
    create: async (dto: AdminProjectDto) => {
        const response = await axios.post(`${API_BASE}/projects`, dto, getAuthHeaders());
        return response.data;
    },
    update: async (id: string, dto: AdminProjectDto) => {
        const response = await axios.put(`${API_BASE}/projects/${id}`, dto, getAuthHeaders());
        return response.data;
    },
    delete: async (id: string) => {
        const response = await axios.delete(`${API_BASE}/projects/${id}`, getAuthHeaders());
        return response.data;
    }
};

// ============================================
// Widgets
// ============================================
export const AdminWidgetApi = {
    getAll: async (pageId = 'home') => {
        const response = await axios.get(`${API_BASE}/widgets?pageId=${pageId}`, getAuthHeaders());
        return response.data;
    },
    create: async (dto: AdminWidgetDto) => {
        const response = await axios.post(`${API_BASE}/widgets`, dto, getAuthHeaders());
        return response.data;
    },
    update: async (id: number, dto: AdminWidgetDto) => {
        const response = await axios.put(`${API_BASE}/widgets/${id}`, dto, getAuthHeaders());
        return response.data;
    },
    delete: async (id: number) => {
        const response = await axios.delete(`${API_BASE}/widgets/${id}`, getAuthHeaders());
        return response.data;
    },
    reorder: async (dto: ReorderWidgetsDto) => {
        const response = await axios.put(`${API_BASE}/widgets/reorder`, dto, getAuthHeaders());
        return response.data;
    }
};

// ============================================
// Menu Items
// ============================================
export const AdminMenuApi = {
    getAll: async (position?: string) => {
        const url = position ? `${API_BASE}/menu?position=${position}` : `${API_BASE}/menu`;
        const response = await axios.get(url, getAuthHeaders());
        return response.data;
    },
    create: async (dto: AdminMenuItemDto) => {
        const response = await axios.post(`${API_BASE}/menu`, dto, getAuthHeaders());
        return response.data;
    },
    update: async (id: number, dto: AdminMenuItemDto) => {
        const response = await axios.put(`${API_BASE}/menu/${id}`, dto, getAuthHeaders());
        return response.data;
    },
    delete: async (id: number) => {
        const response = await axios.delete(`${API_BASE}/menu/${id}`, getAuthHeaders());
        return response.data;
    },
    reorder: async (dto: ReorderMenuItemsDto) => {
        const response = await axios.put(`${API_BASE}/menu/reorder`, dto, getAuthHeaders());
        return response.data;
    }
};

// ============================================
// Styles
// ============================================
export const AdminStyleApi = {
    getAll: async () => {
        const response = await axios.get(`${API_BASE}/styles`, getAuthHeaders());
        return response.data;
    },
    getActive: async () => {
        const response = await axios.get(`${API_BASE}/styles/active`, getAuthHeaders());
        return response.data;
    },
    create: async (dto: AdminStyleConfigDto) => {
        const response = await axios.post(`${API_BASE}/styles`, dto, getAuthHeaders());
        return response.data;
    },
    update: async (id: number, dto: AdminStyleConfigDto) => {
        const response = await axios.put(`${API_BASE}/styles/${id}`, dto, getAuthHeaders());
        return response.data;
    },
    delete: async (id: number) => {
        const response = await axios.delete(`${API_BASE}/styles/${id}`, getAuthHeaders());
        return response.data;
    },
    activate: async (id: number) => {
        const response = await axios.put(`${API_BASE}/styles/${id}/activate`, {}, getAuthHeaders());
        return response.data;
    }
};

// ============================================
// Media
// ============================================

/**
 * Media upload progress callback
 */
export type MediaUploadProgressCallback = (progress: number) => void;

export const AdminMediaApi = {
    /**
     * Get all media with optional filtering
     * @param params - Filter parameters (type, search, tags, page, pageSize)
     */
    getAll: async (params?: {
        type?: string;
        search?: string;
        tags?: string[];
        page?: number;
        pageSize?: number;
    }) => {
        const searchParams = new URLSearchParams();
        if (params?.type) searchParams.append('type', params.type);
        if (params?.search) searchParams.append('search', params.search);
        if (params?.tags) searchParams.append('tags', params.tags.join(','));
        if (params?.page) searchParams.append('page', String(params.page));
        if (params?.pageSize) searchParams.append('pageSize', String(params.pageSize));

        const url = searchParams.toString()
            ? `${API_BASE}/media?${searchParams.toString()}`
            : `${API_BASE}/media`;

        const response = await axios.get(url, getAuthHeaders());
        return response.data;
    },

    /**
     * Upload media file
     * @param file - File object from input
     * @param metadata - Media metadata
     * @param onProgress - Optional progress callback
     */
    upload: async (
        file: File,
        metadata: Partial<AdminMediaDto>,
        onProgress?: MediaUploadProgressCallback
    ): Promise<CrudResponseDto<AdminMediaDto>> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', metadata.name || file.name);

        if (metadata.key) formData.append('key', metadata.key);
        if (metadata.altText) formData.append('altText', metadata.altText);
        if (metadata.description) formData.append('description', metadata.description);
        if (metadata.tags) formData.append('tags', JSON.stringify(metadata.tags));
        if (metadata.metadata) formData.append('metadata', JSON.stringify(metadata.metadata));
        if (metadata.isPublic !== undefined) formData.append('isPublic', String(metadata.isPublic));

        const response = await axios.post(`${API_BASE}/media/upload`, formData, {
            ...getAuthHeaders(),
            headers: {
                ...getAuthHeaders().headers,
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress(percentCompleted);
                }
            },
        });

        return response.data;
    },

    /**
     * Create media from external URL
     * @param dto - Media from URL DTO
     */
    createFromUrl: async (dto: CreateMediaFromUrlDto): Promise<CrudResponseDto<AdminMediaDto>> => {
        const response = await axios.post(`${API_BASE}/media/url`, dto, getAuthHeaders());
        return response.data;
    },

    /**
     * Update media metadata
     * @param id - Media ID
     * @param dto - Updated metadata
     */
    update: async (id: string, dto: Partial<AdminMediaDto>): Promise<CrudResponseDto> => {
        const response = await axios.put(`${API_BASE}/media/${id}`, dto, getAuthHeaders());
        return response.data;
    },

    /**
     * Delete media by ID
     * @param id - Media ID
     */
    delete: async (id: string): Promise<CrudResponseDto> => {
        const response = await axios.delete(`${API_BASE}/media/${id}`, getAuthHeaders());
        return response.data;
    },

    /**
     * Get media by key
     * @param key - Media key
     */
    getByKey: async (key: string): Promise<AdminMediaDto | null> => {
        const response = await axios.get(`${API_BASE}/media/key/${key}`, getAuthHeaders());
        return response.data;
    },

    /**
     * Get all media tags
     */
    getTags: async (): Promise<string[]> => {
        const response = await axios.get(`${API_BASE}/media/tags`, getAuthHeaders());
        return response.data;
    },
};

// ============================================
// Carousel
// ============================================
export const AdminCarouselApi = {
    getAll: async () => {
        const response = await axios.get(`${API_BASE}/carousel`, getAuthHeaders());
        return response.data;
    },
    create: async (dto: AdminCarouselItemDto) => {
        const response = await axios.post(`${API_BASE}/carousel`, dto, getAuthHeaders());
        return response.data;
    },
    update: async (id: number, dto: AdminCarouselItemDto) => {
        const response = await axios.put(`${API_BASE}/carousel/${id}`, dto, getAuthHeaders());
        return response.data;
    },
    delete: async (id: number) => {
        const response = await axios.delete(`${API_BASE}/carousel/${id}`, getAuthHeaders());
        return response.data;
    },
    reorder: async (dto: ReorderCarouselDto) => {
        const response = await axios.put(`${API_BASE}/carousel/reorder`, dto, getAuthHeaders());
        return response.data;
    }
};

