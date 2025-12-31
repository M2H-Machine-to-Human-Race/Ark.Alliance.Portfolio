/**
 * @fileoverview Experience Repository
 * Repository for experience management.
 */

import { GenericRepository } from './generic.repository';
import { Experience } from '../entities/experience.entity';

export class ExperienceRepository extends GenericRepository<Experience> {
    constructor() {
        super(Experience);
    }

    async findAllOrdered(): Promise<Experience[]> {
        return this.repository.find({
            order: { displayOrder: 'ASC', startDate: 'DESC' }
        });
    }

    async findHighlighted(): Promise<Experience[]> {
        return this.repository.find({
            where: { isHighlighted: true },
            order: { startDate: 'DESC' }
        });
    }

    async updateOrder(experienceIds: number[]): Promise<void> {
        for (let i = 0; i < experienceIds.length; i++) {
            await this.repository.update(experienceIds[i], { displayOrder: i });
        }
    }
}

