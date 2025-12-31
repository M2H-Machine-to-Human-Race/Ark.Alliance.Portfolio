/**
 * @fileoverview Admin Style Service
 * Handles administrative operations for theme configuration.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { AppDataSource } from '../config/database';
import { StyleConfig } from '../database/entities/style-config.entity';
import { AdminStyleConfigDto, CrudResponseDto } from '@ark/portfolio-share';

export class AdminStyleService {
    private styleRepo = AppDataSource.getRepository(StyleConfig);

    async getActiveStyle(): Promise<StyleConfig | null> {
        return this.styleRepo.findOne({ where: { isActive: true } });
    }

    async getAllStyles(): Promise<StyleConfig[]> {
        return this.styleRepo.find({ order: { updatedAt: 'DESC' } });
    }

    async createStyle(dto: AdminStyleConfigDto): Promise<CrudResponseDto<StyleConfig>> {
        try {
            // If setting as active, deactivate others
            if (dto.isActive) {
                await this.styleRepo.update({}, { isActive: false });
            }

            const style = this.styleRepo.create(dto);
            const saved = await this.styleRepo.save(style);
            return {
                success: true,
                message: 'Style configuration created successfully',
                data: saved,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to create style configuration',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    async updateStyle(id: number, dto: AdminStyleConfigDto): Promise<CrudResponseDto<StyleConfig>> {
        try {
            const style = await this.styleRepo.findOne({ where: { id } });
            if (!style) {
                return {
                    success: false,
                    message: 'Style configuration not found',
                    timestamp: new Date().toISOString()
                };
            }

            // If setting as active, deactivate others
            if (dto.isActive && !style.isActive) {
                await this.styleRepo.update({}, { isActive: false });
            }

            this.styleRepo.merge(style, dto);
            const saved = await this.styleRepo.save(style);
            return {
                success: true,
                message: 'Style configuration updated successfully',
                data: saved,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to update style configuration',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    async deleteStyle(id: number): Promise<CrudResponseDto<void>> {
        try {
            const result = await this.styleRepo.delete(id);
            if (result.affected === 0) {
                return {
                    success: false,
                    message: 'Style configuration not found',
                    timestamp: new Date().toISOString()
                };
            }
            return {
                success: true,
                message: 'Style configuration deleted successfully',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to delete style configuration',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    async activateStyle(id: number): Promise<CrudResponseDto<StyleConfig>> {
        try {
            await this.styleRepo.update({}, { isActive: false });
            await this.styleRepo.update(id, { isActive: true });

            const activeStyle = await this.styleRepo.findOne({ where: { id } });
            if (!activeStyle) throw new Error('Style not found after activation');

            return {
                success: true,
                message: 'Style activated successfully',
                data: activeStyle,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to activate style',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }
}

