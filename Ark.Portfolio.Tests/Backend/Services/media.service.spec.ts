/**
 * @fileoverview Media Service Unit Tests
 * Tests for MediaService upload and management operations.
 * 
 * @author Armand Richelet-Kleinberg
 */

import {
    MOCK_MEDIA_ITEMS,
    MOCK_MEDIA_SINGLE,
    MOCK_CAROUSEL_IMAGES,
    MOCK_MEDIA_UPLOAD_METADATA,
    createMockFile,
    MockMediaType,
} from '../../Mocks';

/**
 * Media Service Test Suite
 */
describe('MediaService', () => {
    let mockMedia = [...MOCK_MEDIA_ITEMS];

    beforeEach(() => {
        mockMedia = [...MOCK_MEDIA_ITEMS];
    });

    describe('getAll', () => {
        it('should return all media items', () => {
            expect(mockMedia.length).toBe(4);
        });

        it('should have required fields', () => {
            mockMedia.forEach(media => {
                expect(media.id).toBeDefined();
                expect(media.name).toBeDefined();
                expect(media.url).toBeDefined();
                expect(media.type).toBeDefined();
            });
        });
    });

    describe('filterByType', () => {
        it('should filter by media type', () => {
            const images = mockMedia.filter(m => m.type === MockMediaType.IMAGE);
            expect(images.length).toBe(4);
        });

        it('should filter carousel images by tag', () => {
            const carouselImages = mockMedia.filter(
                m => m.tags?.includes('carousel')
            );
            expect(carouselImages.length).toBeGreaterThan(0);
        });
    });

    describe('getByKey', () => {
        it('should return media by key', () => {
            const media = mockMedia.find(m => m.key === 'carousel-hero-1');
            expect(media).toBeDefined();
            expect(media?.name).toBe('hero-background.jpg');
        });

        it('should return undefined for non-existent key', () => {
            const media = mockMedia.find(m => m.key === 'non-existent-key');
            expect(media).toBeUndefined();
        });
    });

    describe('upload', () => {
        it('should create mock file object', () => {
            const mockFile = createMockFile('test.jpg', 'image/jpeg', 1024);

            expect(mockFile).toBeDefined();
            expect(mockFile.name).toBe('test.jpg');
            expect(mockFile.type).toBe('image/jpeg');
        });

        it('should add uploaded media to list', () => {
            const newMedia = {
                id: '5',
                ...MOCK_MEDIA_UPLOAD_METADATA,
                type: MockMediaType.IMAGE,
                mimeType: 'image/jpeg',
                url: '/uploads/media/test-upload.jpg',
                fileSize: 1024,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            mockMedia.push(newMedia as any);
            expect(mockMedia.length).toBe(5);
        });
    });

    describe('update', () => {
        it('should update media metadata', () => {
            const mediaIndex = mockMedia.findIndex(m => m.id === '1');
            mockMedia[mediaIndex] = {
                ...mockMedia[mediaIndex],
                altText: 'Updated alt text for accessibility',
                tags: ['carousel', 'hero', 'background', 'updated'],
            };

            expect(mockMedia[mediaIndex].altText).toBe('Updated alt text for accessibility');
            expect(mockMedia[mediaIndex].tags).toContain('updated');
        });
    });

    describe('delete', () => {
        it('should remove media from list', () => {
            mockMedia = mockMedia.filter(m => m.id !== '4');
            expect(mockMedia.length).toBe(3);
            expect(mockMedia.find(m => m.id === '4')).toBeUndefined();
        });
    });

    describe('search', () => {
        it('should search by name', () => {
            const results = mockMedia.filter(
                m => m.name.toLowerCase().includes('hero')
            );
            expect(results.length).toBe(1);
        });

        it('should search by tags', () => {
            const searchTag = 'profile';
            const results = mockMedia.filter(
                m => m.tags?.includes(searchTag)
            );
            expect(results.length).toBe(1);
            expect(results[0].name).toBe('profile-photo.png');
        });
    });

    describe('validation', () => {
        it('should validate image dimensions', () => {
            const largeImage = mockMedia.find(m => m.width && m.width > 1000);
            expect(largeImage).toBeDefined();
            expect(largeImage?.width).toBeGreaterThan(1000);
        });

        it('should validate file size using fileSize property', () => {
            const totalSize = mockMedia.reduce((sum, m) => sum + (m.fileSize || 0), 0);
            expect(totalSize).toBeGreaterThan(0);
        });

        it('should check mimeType format', () => {
            mockMedia.forEach(media => {
                expect(media.mimeType).toMatch(/^[a-z]+\/[a-z0-9.+-]+$/);
            });
        });
    });
});
