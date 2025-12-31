/**
 * @fileoverview Media Entity
 * Stores uploaded media files with comprehensive metadata for widgets and AI integration.
 * 
 * @module entities/media
 * @author Armand Richelet-Kleinberg
 * @since 1.0.0
 * 
 * @description
 * The Media entity supports multiple file types including images, videos, audio,
 * documents (PDF, Word, Excel), and data files (JSON, Markdown). Each media item
 * can be assigned a unique key for programmatic reference in widgets or AI context.
 * 
 * @example
 * // Creating a new media record from upload
 * const media = new Media();
 * media.name = 'Company Logo';
 * media.key = 'logo-main';
 * media.url = '/uploads/image/uuid-filename.png';
 * media.type = MediaType.IMAGE;
 * media.mimeType = 'image/png';
 * media.tags = ['branding', 'logo'];
 * await repository.save(media);
 * 
 * @example
 * // Using key to reference media in widgets
 * const logo = await mediaRepo.findOne({ where: { key: 'logo-main' } });
 */

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Media asset types supported by the system.
 * 
 * @enum {string}
 * @description Used to categorize uploaded files for filtering and display purposes.
 */
export enum MediaType {
    /** Image files - JPEG, PNG, GIF, WebP, SVG, ICO */
    IMAGE = 'image',
    /** Video files - MP4, WebM, MOV, AVI */
    VIDEO = 'video',
    /** Audio files - MP3, WAV, OGG, FLAC */
    AUDIO = 'audio',
    /** PDF documents */
    PDF = 'pdf',
    /** Microsoft Word documents - DOC, DOCX */
    WORD = 'word',
    /** Microsoft Excel spreadsheets - XLS, XLSX */
    EXCEL = 'excel',
    /** Markdown text files - MD */
    MARKDOWN = 'markdown',
    /** JSON data files */
    JSON = 'json',
    /** Other unclassified document types */
    OTHER = 'other'
}

/**
 * Media entity for storing uploaded files and external media references.
 * 
 * @class Media
 * @description Stores media files with rich metadata including dimensions, tags,
 * and custom metadata for AI assistant integration.
 * 
 * @remarks
 * - Use `key` for stable programmatic references (survives re-uploads)
 * - Use `tags` for categorization and filtering
 * - Use `metadata` for AI context or widget-specific configuration
 * - Files are stored locally in type-organized subdirectories
 * 
 * @see {@link AdminMediaService} for CRUD operations
 * @see {@link upload.middleware} for file upload handling
 */
@Entity('media')
export class Media {
    /**
     * Unique identifier (UUID) for the media record.
     * @type {string}
     * @remarks Auto-generated UUID v4
     */
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    /**
     * Human-readable display name.
     * @type {string}
     * @example 'Company Logo', 'Profile Photo', 'Product Brochure'
     */
    @Column({ length: 200 })
    name!: string;

    /**
     * Unique key for programmatic reference.
     * @type {string | null}
     * @example 'profile-avatar', 'cv-document', 'hero-banner'
     * @remarks 
     * - Optional but recommended for media used in widgets or AI context
     * - Must be unique across all media items
     * - Use kebab-case for consistency
     */
    @Column({ length: 100, unique: true, nullable: true })
    key!: string;

    /**
     * Full URL or relative path to the media file.
     * @type {string}
     * @example '/uploads/image/abc123-photo.jpg'
     * @example 'https://example.com/image.png'
     */
    @Column({ length: 500 })
    url!: string;

    /**
     * Media type classification.
     * @type {MediaType}
     * @default MediaType.IMAGE
     * @see MediaType for available types
     */
    @Column({ type: 'text', default: MediaType.IMAGE })
    type!: MediaType;

    /**
     * MIME type of the file.
     * @type {string | null}
     * @example 'image/jpeg', 'application/pdf', 'video/mp4'
     */
    @Column({ length: 100, nullable: true })
    mimeType!: string;

    /**
     * Original filename as uploaded by user.
     * @type {string | null}
     * @remarks Preserved for reference; actual stored filename may differ
     */
    @Column({ length: 255, nullable: true })
    originalFileName!: string;

    /**
     * File size in bytes.
     * @type {number}
     * @default 0
     */
    @Column({ type: 'integer', default: 0 })
    fileSize!: number;

    /**
     * Alt text for accessibility.
     * @type {string | null}
     * @remarks Required for images per WCAG guidelines
     */
    @Column({ length: 500, nullable: true })
    altText!: string;

    /**
     * Description or caption for the media.
     * @type {string | null}
     * @remarks Can be used for AI context or display purposes
     */
    @Column('text', { nullable: true })
    description!: string;

    /**
     * Tags for categorization and filtering.
     * @type {string[]}
     * @example ['branding', 'logo'], ['documentation', 'api']
     * @remarks Stored as JSON array
     */
    @Column('simple-json', { nullable: true })
    tags!: string[];

    /**
     * Additional metadata for AI/widget integration.
     * @type {Record<string, any>}
     * @example { aiContext: 'company info', widgetId: 'header' }
     * @remarks Flexible JSON storage for custom data
     */
    @Column('simple-json', { nullable: true })
    metadata!: Record<string, any>;

    /**
     * Width of image/video in pixels.
     * @type {number | null}
     * @remarks Only applicable for visual media
     */
    @Column({ type: 'integer', nullable: true })
    width!: number;

    /**
     * Height of image/video in pixels.
     * @type {number | null}
     * @remarks Only applicable for visual media
     */
    @Column({ type: 'integer', nullable: true })
    height!: number;

    /**
     * Whether the media is publicly accessible.
     * @type {boolean}
     * @default true
     * @remarks Set to false for private/draft media
     */
    @Column({ default: true })
    isPublic!: boolean;

    /**
     * Record creation timestamp.
     * @type {Date}
     */
    @CreateDateColumn()
    createdAt!: Date;

    /**
     * Record last update timestamp.
     * @type {Date}
     */
    @UpdateDateColumn()
    updatedAt!: Date;
}

