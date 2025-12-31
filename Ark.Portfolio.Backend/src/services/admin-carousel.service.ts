/**
 * @fileoverview Admin Carousel Service
 * Handles administrative operations for carousel items (CRUD).
 * 
 * @author Armand Richelet-Kleinberg
 */

import { AppDataSource } from '../config/database';
import { CarouselItem } from '../database/entities/carousel-item.entity';
import { AdminCarouselItemDto, CrudResponseDto, ReorderCarouselDto } from '@ark/portfolio-share';

export class AdminCarouselService {
    private carouselRepo = AppDataSource.getRepository(CarouselItem);

    async getAllCarouselItems(): Promise<CarouselItem[]> {
        return this.carouselRepo.find({
            order: { order: 'ASC' }
        });
    }

    async createCarouselItem(dto: AdminCarouselItemDto): Promise<CrudResponseDto<CarouselItem>> {
        try {
            const item = this.carouselRepo.create(dto);
            const saved = await this.carouselRepo.save(item);
            return {
                success: true,
                message: 'Carousel item created successfully',
                data: saved,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to create carousel item',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    async updateCarouselItem(id: number, dto: AdminCarouselItemDto): Promise<CrudResponseDto<CarouselItem>> {
        try {
            const item = await this.carouselRepo.findOne({ where: { id } });
            if (!item) {
                return {
                    success: false,
                    message: 'Carousel item not found',
                    timestamp: new Date().toISOString()
                };
            }

            this.carouselRepo.merge(item, dto);
            const saved = await this.carouselRepo.save(item);
            return {
                success: true,
                message: 'Carousel item updated successfully',
                data: saved,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to update carousel item',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    async deleteCarouselItem(id: number): Promise<CrudResponseDto<void>> {
        try {
            const result = await this.carouselRepo.delete(id);
            if (result.affected === 0) {
                return {
                    success: false,
                    message: 'Carousel item not found',
                    timestamp: new Date().toISOString()
                };
            }
            return {
                success: true,
                message: 'Carousel item deleted successfully',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to delete carousel item',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    async reorderCarouselItems(dto: ReorderCarouselDto): Promise<CrudResponseDto<void>> {
        try {
            await AppDataSource.transaction(async transactionalEntityManager => {
                for (let i = 0; i < dto.itemIds.length; i++) {
                    await transactionalEntityManager.update(CarouselItem, dto.itemIds[i], { order: i });
                }
            });
            return {
                success: true,
                message: 'Carousel items reordered successfully',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to reorder carousel items',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }
}

