/**
 * @fileoverview Carousel DTOs
 * Data Transfer Objects for Carousel management.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminCarouselItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         subtitle:
 *           type: string
 *         description:
 *           type: string
 *         imageUrl:
 *           type: string
 *         linkUrl:
 *           type: string
 *         linkText:
 *           type: string
 *         order:
 *           type: integer
 *         isActive:
 *           type: boolean
 *         projectId:
 *           type: string
 *     ReorderCarousel:
 *       type: object
 *       properties:
 *         itemIds:
 *           type: array
 *           items:
 *             type: integer
 */
export interface AdminCarouselItemDto {
    id?: number;
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl: string;
    linkUrl?: string;
    linkText?: string;
    order: number;
    isActive: boolean;
    projectId?: string;
}

/**
 * Reorder carousel items request.
 */
export interface ReorderCarouselDto {
    itemIds: number[];
}
