/**
 * @fileoverview Skill Repository
 * Repository for skill management with category support.
 */

import { GenericRepository } from './generic.repository';
import { Skill } from '../entities/skill.entity';

export class SkillRepository extends GenericRepository<Skill> {
    constructor() {
        super(Skill);
    }

    async findAllWithCategories(): Promise<Skill[]> {
        return this.repository.find({
            order: { displayOrder: 'ASC', name: 'ASC' },
            relations: ['category']
        });
    }

    async findByCategory(categoryId: number): Promise<Skill[]> {
        return this.repository.find({
            where: { categoryId },
            order: { displayOrder: 'ASC' }
        });
    }

    async updateOrder(skillIds: number[]): Promise<void> {
        for (let i = 0; i < skillIds.length; i++) {
            await this.repository.update(skillIds[i], { displayOrder: i });
        }
    }
}

