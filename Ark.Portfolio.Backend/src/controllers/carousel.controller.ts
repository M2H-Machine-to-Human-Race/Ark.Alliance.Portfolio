/**
 * @fileoverview Carousel Controller
 * Public endpoint for carousel data on homepage.
 * 
 * @author Ark.Alliance
 */

import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { AdminCarouselService } from '../services/admin-carousel.service';
import { CarouselSlideDto } from '@ark/portfolio-share';

/**
 * Public Carousel Controller
 * 
 * Provides public (unauthenticated) access to carousel data for homepage.
 * Uses the same data source as admin but only returns active, public-safe fields.
 */
export class CarouselController extends BaseController {
    private carouselService: AdminCarouselService;

    constructor() {
        super();
        this.carouselService = new AdminCarouselService();
    }

    /**
     * Get all active carousel items for public display.
     * Maps admin carousel items to public CarouselSlideDto.
     * 
     * @param req - Express request
     * @param res - Express response
     * @returns Array of CarouselSlideDto
     */
    async getCarousel(req: Request, res: Response) {
        const items = await this.carouselService.getAllCarouselItems();

        // Filter only active items and map to public DTO
        const slides: CarouselSlideDto[] = items
            .filter((item: any) => item.isActive)
            .sort((a: any, b: any) => a.order - b.order)
            .map((item: any) => ({
                id: item.id,
                title: item.title,
                subtitle: item.subtitle,
                description: item.description,
                imageUrl: item.imageUrl,
                ctaLabel: item.linkText || 'Learn More',
                ctaLink: item.linkUrl || (item.projectId ? `/projects/${item.projectId}` : '/projects'),
            }));

        return this.ok(res, slides);
    }
}
