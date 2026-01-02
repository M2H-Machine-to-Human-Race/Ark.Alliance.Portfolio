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

/**
 * Media binary data exchange DTO.
 * @remarks Used for transferring media files as byte arrays in API contracts.
 * Supports base64 encoding for JSON transport or raw bytes for multipart/form-data.
 */
export interface MediaBinaryDataDto {
    /** Media record ID */
    id: string;
    /** Display name */
    name: string;
    /** MIME type of the binary data */
    mimeType: string;
    /** File size in bytes */
    fileSize: number;
    /** Base64-encoded binary data (for JSON transport) */
    base64Data?: string;
    /** Original filename */
    originalFileName?: string;
}

/**
 * Media upload with binary data DTO.
 * @remarks Used for uploading files with embedded binary data.
 */
export interface MediaUploadBinaryDto extends UploadMediaDto {
    /** Base64-encoded file content */
    base64Content: string;
    /** MIME type of the file */
    mimeType: string;
    /** Original filename */
    originalFileName: string;
    /** File size in bytes */
    fileSize: number;
}

/**
 * Media seed data DTO.
 * @remarks Used for database initialization with default media assets.
 * Maps directly to Media entity fields for seeding.
 */
export interface MediaSeedDto {
    /** Display name */
    name: string;
    /** Unique key for programmatic reference (kebab-case) */
    key: string;
    /** Relative URL path to the asset file */
    url: string;
    /** Media type classification */
    type: MediaTypeEnum;
    /** MIME type */
    mimeType: string;
    /** Original filename */
    originalFileName: string;
    /** File size in bytes */
    fileSize: number;
    /** Alt text for accessibility */
    altText?: string;
    /** Description for AI context and display */
    description?: string;
    /** Tags for categorization and filtering */
    tags?: string[];
    /** Whether publicly accessible */
    isPublic?: boolean;
}

/**
 * Default media seed data for database initialization.
 * @remarks These entries correspond to files in the backend /Assets folder.
 */
export const DEFAULT_MEDIA_SEED: MediaSeedDto[] = [
    {
        name: 'Ark.Portfolio Hero',
        key: 'project-ark-portfolio-hero',
        url: '/Assets/Projects/Ark.Portfolio/portfolio-hero.png',
        type: MediaTypeEnum.IMAGE,
        mimeType: 'image/png',
        originalFileName: 'portfolio-hero.png',
        fileSize: 605232,
        altText: 'Ark.Portfolio project hero image',
        description: 'AI-Powered Portfolio CMS hero image for carousel and project display',
        tags: ['project', 'hero', 'carousel'],
        isPublic: true
    },
    {
        name: 'Ark.Alliance React Component Hero',
        key: 'project-ark-react-component-hero',
        url: '/Assets/Projects/Ark.Alliance.React.Component/components-hero.png',
        type: MediaTypeEnum.IMAGE,
        mimeType: 'image/png',
        originalFileName: 'components-hero.png',
        fileSize: 605096,
        altText: 'Ark.Alliance React Component Library hero image',
        description: 'Enterprise React component library hero image for carousel and project display',
        tags: ['project', 'hero', 'carousel'],
        isPublic: true
    },
    {
        name: 'Ark.Alliance Trading Bot Screenshot',
        key: 'project-trading-bot-6',
        url: '/Assets/Projects/Ark.Alliance.Trading.Bot/Bot6.PNG',
        type: MediaTypeEnum.IMAGE,
        mimeType: 'image/png',
        originalFileName: 'Bot6.PNG',
        fileSize: 505004,
        altText: 'Ark.Alliance Trading Bot analytics screenshot',
        description: 'Trading Bot analytics and monitoring interface - used for carousel',
        tags: ['project', 'trading', 'carousel', 'screenshot'],
        isPublic: true
    },
    {
        name: 'Ark.Alliance Trading Providers Hero',
        key: 'project-trading-providers-hero',
        url: '/Assets/Projects/Ark.Alliance.Trading.Providers.Lib/trading-hero.png',
        type: MediaTypeEnum.IMAGE,
        mimeType: 'image/png',
        originalFileName: 'trading-hero.png',
        fileSize: 695430,
        altText: 'Ark.Alliance Trading Providers Library hero image',
        description: 'Multi-exchange trading SDK hero image for carousel and project display',
        tags: ['project', 'hero', 'carousel'],
        isPublic: true
    },
    {
        name: 'Profile Avatar',
        key: 'profile-avatar',
        url: '/Assets/Site/Icon.png',
        type: MediaTypeEnum.IMAGE,
        mimeType: 'image/png',
        originalFileName: 'Icon.png',
        fileSize: 101421,
        altText: 'Armand Richelet-Kleinberg profile avatar',
        description: 'Default profile avatar image',
        tags: ['profile', 'avatar'],
        isPublic: true
    }
];
