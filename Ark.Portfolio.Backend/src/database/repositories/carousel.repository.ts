/**
 * @fileoverview Carousel Repository
 * Data access layer for carousel item entities.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { GenericRepository } from './generic.repository';
import { CarouselItem } from '../entities/carousel-item.entity';

export class CarouselRepository extends GenericRepository<CarouselItem> {
    constructor() {
        super(CarouselItem);
    }

    /**
     * Get all carousel items ordered by display order.
     */
    async findAllOrdered(): Promise<CarouselItem[]> {
        return this.repository.find({ order: { order: 'ASC' } });
    }

    /**
     * Get only active carousel items.
     */
    async findActive(): Promise<CarouselItem[]> {
        return this.repository.find({
            where: { isActive: true },
            order: { order: 'ASC' }
        });
    }

    /**
     * Update order of carousel items.
     */
    async updateOrder(itemIds: number[]): Promise<void> {
        for (let i = 0; i < itemIds.length; i++) {
            await this.repository.update(itemIds[i], { order: i });
        }
    }
}

