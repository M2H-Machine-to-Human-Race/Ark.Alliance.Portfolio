/**
 * @fileoverview Admin Media Service
 * Handles administrative operations for media assets.
 * Supports file upload, metadata management, and search.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { AppDataSource } from '../config/database';
import { Media, MediaType } from '../database/entities/media.entity';
import { CrudResponseDto, MediaTypeEnum } from '@ark/portfolio-share';
import { Like, In } from 'typeorm';
import { getMediaType, getPublicUrl } from '../middleware/upload.middleware';
import fs from 'fs';

/**
 * Media upload request data.
 */
interface MediaUploadData {
    name: string;
    key?: string;
    altText?: string;
    description?: string;
    tags?: string[];
    metadata?: Record<string, any>;
    isPublic?: boolean;
}

/**
 * Media search parameters.
 */
interface MediaSearchParams {
    type?: MediaTypeEnum;
    search?: string;
    tags?: string[];
    page?: number;
    pageSize?: number;
}

export class AdminMediaService {
    private mediaRepo = AppDataSource.getRepository(Media);

    /**
     * Get all media with optional filtering.
     * @param params - Search parameters
     * @returns Array of media items
     */
    async getAllMedia(params: MediaSearchParams = {}): Promise<{ items: Media[]; total: number }> {
        const { type, search, tags, page = 1, pageSize = 50 } = params;

        const queryBuilder = this.mediaRepo.createQueryBuilder('media');

        if (type) {
            queryBuilder.andWhere('media.type = :type', { type });
        }

        if (search) {
            queryBuilder.andWhere(
                '(media.name LIKE :search OR media.description LIKE :search OR media.key LIKE :search)',
                { search: `%${search}%` }
            );
        }

        const [items, total] = await queryBuilder
            .orderBy('media.createdAt', 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();

        return { items, total };
    }

    /**
     * Get a single media item by ID.
     * @param id - Media UUID
     * @returns Media item or null
     */
    async getById(id: string): Promise<Media | null> {
        return this.mediaRepo.findOneBy({ id });
    }

    /**
     * Get a single media item by key.
     * @param key - Unique media key
     * @returns Media item or null
     */
    async getByKey(key: string): Promise<Media | null> {
        return this.mediaRepo.findOneBy({ key });
    }

    /**
     * Create a new media item from uploaded file.
     * @param file - Multer file object
     * @param data - Media metadata
     * @returns CRUD response with created media
     */
    async createFromUpload(
        file: Express.Multer.File,
        data: MediaUploadData
    ): Promise<CrudResponseDto<Media>> {
        try {
            // Check for duplicate key
            if (data.key) {
                const existing = await this.getByKey(data.key);
                if (existing) {
                    return {
                        success: false,
                        message: `Media with key '${data.key}' already exists`,
                        timestamp: new Date().toISOString()
                    };
                }
            }

            const mediaType = getMediaType(file.mimetype) as MediaType;
            const url = getPublicUrl(file.path);

            const media = this.mediaRepo.create({
                name: data.name || file.originalname,
                key: data.key,
                url,
                type: mediaType,
                mimeType: file.mimetype,
                originalFileName: file.originalname,
                fileSize: file.size,
                altText: data.altText,
                description: data.description,
                tags: data.tags || [],
                metadata: data.metadata,
                isPublic: data.isPublic ?? true
            });

            const saved = await this.mediaRepo.save(media);
            return {
                success: true,
                message: 'Media uploaded successfully',
                data: saved,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to upload media',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Create a new media item from URL.
     * @param url - External media URL
     * @param data - Media metadata
     * @returns CRUD response with created media
     */
    async createFromUrl(
        url: string,
        type: MediaTypeEnum,
        data: MediaUploadData
    ): Promise<CrudResponseDto<Media>> {
        try {
            // Check for duplicate key
            if (data.key) {
                const existing = await this.getByKey(data.key);
                if (existing) {
                    return {
                        success: false,
                        message: `Media with key '${data.key}' already exists`,
                        timestamp: new Date().toISOString()
                    };
                }
            }

            const media = this.mediaRepo.create({
                name: data.name,
                key: data.key,
                url,
                type: type as unknown as MediaType,
                altText: data.altText,
                description: data.description,
                tags: data.tags || [],
                metadata: data.metadata,
                isPublic: data.isPublic ?? true
            });

            const saved = await this.mediaRepo.save(media);
            return {
                success: true,
                message: 'Media created successfully',
                data: saved,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to create media',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Update media metadata.
     * @param id - Media UUID
     * @param data - Updated metadata
     * @returns CRUD response with updated media
     */
    async updateMedia(id: string, data: Partial<MediaUploadData>): Promise<CrudResponseDto<Media>> {
        try {
            const media = await this.getById(id);
            if (!media) {
                return {
                    success: false,
                    message: 'Media not found',
                    timestamp: new Date().toISOString()
                };
            }

            // Check for key conflict
            if (data.key && data.key !== media.key) {
                const existing = await this.getByKey(data.key);
                if (existing) {
                    return {
                        success: false,
                        message: `Media with key '${data.key}' already exists`,
                        timestamp: new Date().toISOString()
                    };
                }
            }

            // Update fields
            if (data.name !== undefined) media.name = data.name;
            if (data.key !== undefined) media.key = data.key;
            if (data.altText !== undefined) media.altText = data.altText;
            if (data.description !== undefined) media.description = data.description;
            if (data.tags !== undefined) media.tags = data.tags;
            if (data.metadata !== undefined) media.metadata = { ...media.metadata, ...data.metadata };
            if (data.isPublic !== undefined) media.isPublic = data.isPublic;

            const saved = await this.mediaRepo.save(media);
            return {
                success: true,
                message: 'Media updated successfully',
                data: saved,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to update media',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Delete media by ID.
     * @param id - Media UUID
     * @returns CRUD response
     */
    async deleteMedia(id: string): Promise<CrudResponseDto<void>> {
        try {
            const media = await this.getById(id);
            if (!media) {
                return {
                    success: false,
                    message: 'Media not found',
                    timestamp: new Date().toISOString()
                };
            }

            // Delete physical file if it's local
            if (media.url.includes('/uploads/')) {
                const filePath = media.url.replace(/^https?:\/\/[^/]+\/uploads/, './uploads');
                try {
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                } catch (e) {
                    console.warn('Failed to delete file:', filePath);
                }
            }

            await this.mediaRepo.remove(media);
            return {
                success: true,
                message: 'Media deleted successfully',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to delete media',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Get media items by tags.
     * @param tags - Array of tag strings
     * @returns Array of matching media items
     */
    async getByTags(tags: string[]): Promise<Media[]> {
        const allMedia = await this.mediaRepo.find();
        return allMedia.filter(media =>
            tags.some(tag => media.tags?.includes(tag))
        );
    }

    /**
     * Get all available tags.
     * @returns Array of unique tag strings
     */
    async getAllTags(): Promise<string[]> {
        const allMedia = await this.mediaRepo.find();
        const tagSet = new Set<string>();
        allMedia.forEach(media => {
            media.tags?.forEach(tag => tagSet.add(tag));
        });
        return Array.from(tagSet).sort();
    }
}

