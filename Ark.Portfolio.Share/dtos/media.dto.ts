/**
 * @fileoverview Media DTOs
 * Data Transfer Objects for Media management.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { MediaTypeEnum, MediaSourceEnum } from '../enums/admin.enums';

/**
 * Admin media item DTO.
 * @remarks Used for displaying and managing media in the admin interface.
 */
export interface AdminMediaDto {
    /** Unique identifier (UUID) */
    id?: string;
    /** Display name */
    name: string;
    /** Unique key for programmatic reference */
    key?: string;
    /** Media type classification */
    type: MediaTypeEnum;
    /** Source type (URL, upload, S3) */
    source?: MediaSourceEnum;
    /** Full URL to the media file */
    url?: string;
    /** Original filename */
    originalFileName?: string;
    /** File path on server */
    filePath?: string;
    /** Alt text for accessibility */
    altText?: string;
    /** Caption or description */
    description?: string;
    /** Tags for categorization */
    tags?: string[];
    /** Additional metadata (JSON) */
    metadata?: Record<string, any>;
    /** Image/video width in pixels */
    width?: number;
    /** Image/video height in pixels */
    height?: number;
    /** File size in bytes */
    fileSize?: number;
    /** MIME type */
    mimeType?: string;
    /** Whether publicly accessible */
    isPublic?: boolean;
    /** Creation timestamp */
    createdAt?: string;
    /** Last update timestamp */
    updatedAt?: string;
}

/**
 * Media upload request DTO.
 * @remarks Used for file uploads from the frontend.
 */
export interface UploadMediaDto {
    /** Display name for the media */
    name: string;
    /** Unique key for reference */
    key?: string;
    /** Media type (auto-detected from file if not provided) */
    type?: MediaTypeEnum;
    /** Alt text for accessibility */
    altText?: string;
    /** Description */
    description?: string;
    /** Tags for categorization */
    tags?: string[];
    /** Additional metadata */
    metadata?: Record<string, any>;
    /** Whether publicly accessible */
    isPublic?: boolean;
}

/**
 * Create media from URL request DTO.
 */
export interface CreateMediaFromUrlDto {
    /** External URL */
    url: string;
    /** Display name */
    name: string;
    /** Unique key for reference */
    key?: string;
    /** Media type */
    type: MediaTypeEnum;
    /** Alt text */
    altText?: string;
    /** Description */
    description?: string;
    /** Tags */
    tags?: string[];
    /** Metadata */
    metadata?: Record<string, any>;
}

/**
 * Media search parameters DTO.
 */
export interface MediaSearchDto {
    /** Filter by type */
    type?: MediaTypeEnum;
    /** Search in name, description, key */
    search?: string;
    /** Filter by tags */
    tags?: string[];
    /** Page number (1-indexed) */
    page?: number;
    /** Items per page */
    pageSize?: number;
}

/**
 * Media list response DTO.
 */
export interface MediaListResponseDto {
    /** Media items */
    items: AdminMediaDto[];
    /** Total count */
    total: number;
    /** Current page */
    page: number;
    /** Page size */
    pageSize: number;
}
