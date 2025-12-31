/**
 * @fileoverview Style Repository
 * Data access layer for style configuration entities.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { GenericRepository } from './generic.repository';
import { StyleConfig } from '../entities/style-config.entity';
import { Not } from 'typeorm';

export class StyleRepository extends GenericRepository<StyleConfig> {
    constructor() {
        super(StyleConfig);
    }

    /**
     * Get the currently active style.
     */
    async findActive(): Promise<StyleConfig | null> {
        return this.repository.findOne({ where: { isActive: true } });
    }

    /**
     * Activate a style and deactivate all others.
     */
    async activateStyle(id: number): Promise<StyleConfig | null> {
        // Deactivate all styles
        await this.repository.update({}, { isActive: false });
        // Activate the selected one
        await this.repository.update(id, { isActive: true });
        return this.findById(id);
    }

    /**
     * Get all styles ordered by name.
     */
    async findAllOrdered(): Promise<StyleConfig[]> {
        return this.repository.find({ order: { name: 'ASC' } });
    }
}

