/**
 * @fileoverview Education Repository
 * Repository for education management.
 */

import { GenericRepository } from './generic.repository';
import { Education } from '../entities/education.entity';

export class EducationRepository extends GenericRepository<Education> {
    constructor() {
        super(Education);
    }

    async findAllOrdered(): Promise<Education[]> {
        return this.repository.find({
            order: { startDate: 'DESC' }
        });
    }
}

