/**
 * @fileoverview Skill Category Repository
 * Repository for skill category management.
 */

import { GenericRepository } from './generic.repository';
import { SkillCategory } from '../entities/skill-category.entity';

export class SkillCategoryRepository extends GenericRepository<SkillCategory> {
    constructor() {
        super(SkillCategory);
    }

    async findAllOrdered(): Promise<SkillCategory[]> {
        return this.repository.find({
            order: { displayOrder: 'ASC', name: 'ASC' },
            relations: ['skills']
        });
    }

    async updateOrder(categoryIds: number[]): Promise<void> {
        for (let i = 0; i < categoryIds.length; i++) {
            await this.repository.update(categoryIds[i], { displayOrder: i });
        }
    }
}

