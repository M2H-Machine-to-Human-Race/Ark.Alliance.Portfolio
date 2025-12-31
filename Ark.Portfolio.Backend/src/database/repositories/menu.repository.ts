/**
 * @fileoverview Menu Repository
 * Data access layer for menu item entities.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { GenericRepository } from './generic.repository';
import { MenuItem } from '../entities/menu-item.entity';
import { MenuPositionEnum } from '@ark/portfolio-share';

export class MenuRepository extends GenericRepository<MenuItem> {
    constructor() {
        super(MenuItem);
    }

    /**
     * Get menu items by position.
     */
    async findByPosition(position: MenuPositionEnum): Promise<MenuItem[]> {
        return this.repository.find({
            where: { position: position as any },
            order: { order: 'ASC' }
        });
    }

    /**
     * Get all menu items ordered.
     */
    async findAllOrdered(): Promise<MenuItem[]> {
        return this.repository.find({ order: { position: 'ASC', order: 'ASC' } });
    }

    /**
     * Update order of menu items.
     */
    async updateOrder(itemIds: number[]): Promise<void> {
        for (let i = 0; i < itemIds.length; i++) {
            await this.repository.update(itemIds[i], { order: i });
        }
    }
}

