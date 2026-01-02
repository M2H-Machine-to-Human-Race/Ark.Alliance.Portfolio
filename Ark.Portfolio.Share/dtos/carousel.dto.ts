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

// ============================================
// Public Carousel DTOs (for Homepage)
// ============================================

/**
 * Public carousel slide DTO for homepage display.
 * Contains only fields needed for public presentation.
 * 
 * @example
 * ```typescript
 * const slide: CarouselSlideDto = {
 *     id: 1,
 *     title: 'Welcome',
 *     subtitle: 'Portfolio CMS',
 *     description: 'Explore my work',
 *     imageUrl: '/assets/hero.png',
 *     ctaLabel: 'Learn More',
 *     ctaLink: '/projects'
 * };
 * ```
 */
export interface CarouselSlideDto {
    /** Unique identifier */
    id: number | string;
    /** Main title displayed on the slide */
    title: string;
    /** Subtitle/tagline (optional) */
    subtitle?: string;
    /** Longer description text (optional) */
    description?: string;
    /** URL to the background/hero image */
    imageUrl?: string;
    /** Call-to-action button label */
    ctaLabel?: string;
    /** Call-to-action button link */
    ctaLink?: string;
}

/**
 * Default carousel slides for fallback when API fails.
 */
export const DEFAULT_CAROUSEL_SLIDES: CarouselSlideDto[] = [
    {
        id: 'default',
        title: 'Welcome to My Portfolio',
        subtitle: 'Full-Stack Developer',
        description: 'Explore my projects, experience, and technical expertise in building modern web applications.',
        ctaLabel: 'View Portfolio',
        ctaLink: '/projects',
    }
];
