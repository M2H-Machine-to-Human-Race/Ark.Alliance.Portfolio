/**
 * @fileoverview Admin Widget Service
 * Handles administrative operations for widgets.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { AppDataSource } from '../config/database';
import { Widget } from '../database/entities/widget.entity';
import { AdminWidgetDto, CrudResponseDto, ReorderWidgetsDto } from '@ark/portfolio-share';

/**
 * Service for managing widgets in the admin panel.
 */
export class AdminWidgetService {
    private widgetRepo = AppDataSource.getRepository(Widget);

    /**
     * Get all widgets, optionally filtered by page/context.
     * @param pageId - Optional page ID filter (maps to context in entity)
     * @returns Array of widgets ordered by display order
     */
    async getWidgets(pageId?: string): Promise<Widget[]> {
        const where = pageId ? { context: pageId } : {};
        return this.widgetRepo.find({
            where,
            order: { order: 'ASC' }
        });
    }

    /**
     * Create a new widget.
     * @param dto - Widget data
     * @returns CRUD response with created widget
     */
    async createWidget(dto: AdminWidgetDto): Promise<CrudResponseDto<Widget>> {
        try {
            const widget = this.widgetRepo.create({
                type: dto.type,
                title: dto.title ?? '',
                order: dto.order ?? 0,
                config: dto.config,
                // Map DTO pageId to entity context
                context: dto.pageId
            });
            const saved = await this.widgetRepo.save(widget);
            return {
                success: true,
                message: 'Widget created successfully',
                data: saved,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to create widget',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Update an existing widget.
     * @param id - Widget UUID
     * @param dto - Updated widget data
     * @returns CRUD response with updated widget
     */
    async updateWidget(id: string, dto: AdminWidgetDto): Promise<CrudResponseDto<Widget>> {
        try {
            const widget = await this.widgetRepo.findOne({ where: { id } });
            if (!widget) {
                return {
                    success: false,
                    message: 'Widget not found',
                    timestamp: new Date().toISOString()
                };
            }

            // Update fields
            if (dto.type !== undefined) widget.type = dto.type;
            if (dto.title !== undefined) widget.title = dto.title;
            if (dto.order !== undefined) widget.order = dto.order;
            if (dto.config !== undefined) widget.config = dto.config;
            // Map DTO pageId to entity context
            if (dto.pageId !== undefined) widget.context = dto.pageId;

            const saved = await this.widgetRepo.save(widget);
            return {
                success: true,
                message: 'Widget updated successfully',
                data: saved,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to update widget',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Delete a widget.
     * @param id - Widget UUID
     * @returns CRUD response
     */
    async deleteWidget(id: string): Promise<CrudResponseDto<void>> {
        try {
            const result = await this.widgetRepo.delete(id);
            if (result.affected === 0) {
                return {
                    success: false,
                    message: 'Widget not found',
                    timestamp: new Date().toISOString()
                };
            }
            return {
                success: true,
                message: 'Widget deleted successfully',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to delete widget',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Reorder widgets by updating their order values.
     * @param dto - Reorder request with widget IDs in new order
     * @returns CRUD response
     */
    async reorderWidgets(dto: ReorderWidgetsDto): Promise<CrudResponseDto<void>> {
        try {
            await AppDataSource.transaction(async transactionalEntityManager => {
                for (let i = 0; i < dto.widgetIds.length; i++) {
                    await transactionalEntityManager.update(Widget, dto.widgetIds[i], { order: i });
                }
            });
            return {
                success: true,
                message: 'Widgets reordered successfully',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to reorder widgets',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }
}

