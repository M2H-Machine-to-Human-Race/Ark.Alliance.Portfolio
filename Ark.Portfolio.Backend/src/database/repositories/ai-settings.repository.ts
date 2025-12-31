/**
 * @fileoverview AI Settings Repository
 * Repository for AI configuration management.
 */

import { GenericRepository } from './generic.repository';
import { AiSettings } from '../entities/ai-settings.entity';

export class AiSettingsRepository extends GenericRepository<AiSettings> {
    constructor() {
        super(AiSettings);
    }

    async getActive(): Promise<AiSettings | null> {
        return this.repository.findOne({ where: { isActive: true } });
    }

    async getFirst(): Promise<AiSettings | null> {
        return this.repository.findOne({ where: {} });
    }
}

