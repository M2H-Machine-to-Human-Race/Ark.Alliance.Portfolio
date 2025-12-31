/**
 * @fileoverview Media Mock Data
 * Realistic mock data for Media entity testing.
 * Uses inline types to avoid Share layer compilation issues.
 * 
 * @author Armand Richelet-Kleinberg
 */

/**
 * Media type enum (mirroring Share layer)
 */
export enum MockMediaType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    AUDIO = 'AUDIO',
    DOCUMENT = 'DOCUMENT',
    OTHER = 'OTHER',
}

/**
 * Media source enum
 */
export enum MockMediaSource {
    UPLOAD = 'UPLOAD',
    URL = 'URL',
    S3 = 'S3',
}

/**
 * Mock media interface (matches AdminMediaDto)
 */
export interface MockMediaDto {
    id?: string;
    name: string;
    key?: string;
    type: MockMediaType;
    source?: MockMediaSource;
    url?: string;
    mimeType?: string;
    altText?: string;
    description?: string;
    tags?: string[];
    fileSize?: number;
    width?: number;
    height?: number;
    isPublic?: boolean;
    metadata?: Record<string, any>;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Mock media items
 */
export const MOCK_MEDIA_ITEMS: MockMediaDto[] = [
    {
        id: '1',
        name: 'hero-background.jpg',
        key: 'carousel-hero-1',
        type: MockMediaType.IMAGE,
        source: MockMediaSource.UPLOAD,
        mimeType: 'image/jpeg',
        url: '/uploads/media/hero-background.jpg',
        altText: 'Hero section background with abstract design',
        description: 'Main hero carousel background image',
        tags: ['carousel', 'hero', 'background'],
        fileSize: 245789,
        width: 1920,
        height: 800,
        isPublic: true,
        createdAt: '2024-06-15T10:30:00Z',
        updatedAt: '2024-06-15T10:30:00Z',
    },
    {
        id: '2',
        name: 'profile-photo.png',
        key: 'profile-avatar',
        type: MockMediaType.IMAGE,
        source: MockMediaSource.UPLOAD,
        mimeType: 'image/png',
        url: '/uploads/media/profile-photo.png',
        altText: 'Profile photo',
        description: 'Professional headshot',
        tags: ['profile', 'avatar', 'headshot'],
        fileSize: 89234,
        width: 400,
        height: 400,
        isPublic: true,
        createdAt: '2024-05-20T14:00:00Z',
        updatedAt: '2024-05-20T14:00:00Z',
    },
    {
        id: '3',
        name: 'trading-platform-screenshot.png',
        key: 'project-trading-thumb',
        type: MockMediaType.IMAGE,
        source: MockMediaSource.UPLOAD,
        mimeType: 'image/png',
        url: '/uploads/media/trading-platform-screenshot.png',
        altText: 'Trading platform dashboard screenshot',
        description: 'Screenshot of the trading platform',
        tags: ['project', 'thumbnail', 'trading'],
        fileSize: 456123,
        width: 1200,
        height: 800,
        isPublic: true,
        createdAt: '2024-08-10T09:15:00Z',
        updatedAt: '2024-08-10T09:15:00Z',
    },
    {
        id: '4',
        name: 'logo-dark.svg',
        key: 'logo-dark-mode',
        type: MockMediaType.IMAGE,
        source: MockMediaSource.UPLOAD,
        mimeType: 'image/svg+xml',
        url: '/uploads/media/logo-dark.svg',
        altText: 'Portfolio logo for dark mode',
        description: 'SVG logo for dark backgrounds',
        tags: ['logo', 'branding', 'dark-mode'],
        fileSize: 4567,
        width: 200,
        height: 50,
        isPublic: true,
        createdAt: '2024-04-01T11:00:00Z',
        updatedAt: '2024-04-01T11:00:00Z',
    },
];

/**
 * Single mock media item
 */
export const MOCK_MEDIA_SINGLE: MockMediaDto = MOCK_MEDIA_ITEMS[0];

/**
 * Mock carousel images only
 */
export const MOCK_CAROUSEL_IMAGES = MOCK_MEDIA_ITEMS.filter(
    m => m.tags?.includes('carousel')
);

/**
 * New media upload metadata
 */
export const MOCK_MEDIA_UPLOAD_METADATA: Partial<MockMediaDto> = {
    name: 'test-upload.jpg',
    key: 'test-upload-key',
    altText: 'Test upload image',
    description: 'Image uploaded during testing',
    tags: ['test', 'upload'],
    isPublic: true,
};

/**
 * Mock file object for upload tests
 */
export const createMockFile = (
    name: string = 'test.jpg',
    type: string = 'image/jpeg',
    size: number = 1024
): File => {
    const blob = new Blob(['mock file content'], { type });
    return new File([blob], name, { type });
};
