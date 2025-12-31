/**
 * @fileoverview Media Repository
 * Data access layer for media asset entities.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { GenericRepository } from './generic.repository';
import { Media } from '../entities/media.entity';

export class MediaRepository extends GenericRepository<Media> {
    constructor() {
        super(Media);
    }

    /**
     * Get media by type filter.
     */
    async findByType(type: string): Promise<Media[]> {
        return this.repository.find({
            where: { type: type as any },
            order: { createdAt: 'DESC' }
        });
    }

    /**
     * Get all media ordered by creation date.
     */
    async findAllOrdered(): Promise<Media[]> {
        return this.repository.find({ order: { createdAt: 'DESC' } });
    }
}

