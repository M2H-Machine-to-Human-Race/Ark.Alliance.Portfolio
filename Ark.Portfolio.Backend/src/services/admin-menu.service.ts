/**
 * @fileoverview Admin Menu Service
 * Handles administrative operations for navigation menus.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { AppDataSource } from '../config/database';
import { MenuItem } from '../database/entities/menu-item.entity';
import { AdminMenuItemDto, CrudResponseDto, ReorderMenuItemsDto, MenuPositionEnum } from '@ark/portfolio-share';
import { IsNull } from 'typeorm';

/**
 * Service for managing navigation menu items.
 */
export class AdminMenuService {
    private menuRepo = AppDataSource.getRepository(MenuItem);

    /**
     * Get menu items by position.
     * @param position - Menu position (HEADER, FOOTER, etc.)
     * @returns Root menu items with children
     */
    async getMenuByPosition(position: MenuPositionEnum): Promise<MenuItem[]> {
        return this.menuRepo.find({
            where: { position, parentId: IsNull() }, // Get root items using IsNull()
            relations: { children: true },
            order: { order: 'ASC' }
        });
    }

    /**
     * Get all menu items.
     * @returns All menu items
     */
    async getAllMenuItems(): Promise<MenuItem[]> {
        return this.menuRepo.find({
            relations: { children: true },
            order: { order: 'ASC' }
        });
    }

    /**
     * Create a new menu item.
     * @param dto - Menu item data
     * @returns CRUD response with created item
     */
    async createMenuItem(dto: AdminMenuItemDto): Promise<CrudResponseDto<MenuItem>> {
        try {
            const item = this.menuRepo.create({
                label: dto.label,
                icon: dto.icon,
                route: dto.route,
                position: dto.position,
                order: dto.order ?? 0,
                isVisible: dto.isVisible ?? true,
                openInNewTab: dto.openInNewTab ?? false,
                parentId: dto.parentId ?? undefined
            });
            const saved = await this.menuRepo.save(item);
            return {
                success: true,
                message: 'Menu item created successfully',
                data: saved,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to create menu item',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Update an existing menu item.
     * @param id - Menu item ID
     * @param dto - Updated menu item data
     * @returns CRUD response with updated item
     */
    async updateMenuItem(id: number, dto: AdminMenuItemDto): Promise<CrudResponseDto<MenuItem>> {
        try {
            const item = await this.menuRepo.findOne({ where: { id } });
            if (!item) {
                return {
                    success: false,
                    message: 'Menu item not found',
                    timestamp: new Date().toISOString()
                };
            }

            // Update fields explicitly
            if (dto.label !== undefined) item.label = dto.label;
            if (dto.icon !== undefined) item.icon = dto.icon;
            if (dto.route !== undefined) item.route = dto.route;
            if (dto.position !== undefined) item.position = dto.position;
            if (dto.order !== undefined) item.order = dto.order;
            if (dto.isVisible !== undefined) item.isVisible = dto.isVisible;
            if (dto.openInNewTab !== undefined) item.openInNewTab = dto.openInNewTab;
            if (dto.parentId !== undefined) item.parentId = dto.parentId ?? undefined as any;

            const saved = await this.menuRepo.save(item);
            return {
                success: true,
                message: 'Menu item updated successfully',
                data: saved,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to update menu item',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Delete a menu item.
     * @param id - Menu item ID
     * @returns CRUD response
     */
    async deleteMenuItem(id: number): Promise<CrudResponseDto<void>> {
        try {
            const result = await this.menuRepo.delete(id);
            if (result.affected === 0) {
                return {
                    success: false,
                    message: 'Menu item not found',
                    timestamp: new Date().toISOString()
                };
            }
            return {
                success: true,
                message: 'Menu item deleted successfully',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to delete menu item',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Reorder menu items.
     * @param dto - Reorder request with item IDs
     * @returns CRUD response
     */
    async reorderMenuItems(dto: ReorderMenuItemsDto): Promise<CrudResponseDto<void>> {
        try {
            await AppDataSource.transaction(async transactionalEntityManager => {
                for (let i = 0; i < dto.itemIds.length; i++) {
                    await transactionalEntityManager.update(MenuItem, dto.itemIds[i], { order: i });
                }
            });
            return {
                success: true,
                message: 'Menu items reordered successfully',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to reorder menu items',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }
}

