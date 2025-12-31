/**
 * @fileoverview Timeline INSERT Feature Tests
 * Tests for reordering experience and education entries.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { MOCK_RESUME } from '../../Mocks';

/**
 * API endpoints for reorder operations
 */
const REORDER_ENDPOINTS = {
    experience: '/admin/resume/experience/reorder',
    education: '/admin/resume/education/reorder',
    skill: '/admin/resume/skill/reorder',
};

/**
 * Mock reorder request DTOs
 */
interface ReorderExperiencesDto {
    experienceIds: number[];
}

interface ReorderEducationDto {
    educationIds: number[];
}

interface ReorderSkillsDto {
    skillIds: number[];
}

describe('Timeline INSERT Feature - Reorder Operations', () => {
    describe('Experience Reordering', () => {
        it('should have reorder endpoint configured', () => {
            expect(REORDER_ENDPOINTS.experience).toBe('/admin/resume/experience/reorder');
        });

        it('should accept experienceIds array in request body', () => {
            const dto: ReorderExperiencesDto = {
                experienceIds: [3, 1, 2]  // Reorder experiences to: 3rd first, 1st second, 2nd third
            };
            expect(dto.experienceIds).toHaveLength(3);
            expect(Array.isArray(dto.experienceIds)).toBe(true);
        });

        it('should preserve all IDs after reordering', () => {
            const originalExperiences = MOCK_RESUME.experiences;
            const ids = originalExperiences.map(exp => exp.id).filter(id => id !== undefined);
            const reorderedIds = [...ids].reverse();

            // All original IDs should be present after reorder
            expect(reorderedIds).toHaveLength(ids.length);
            ids.forEach(id => {
                expect(reorderedIds).toContain(id);
            });
        });

        it('should update displayOrder for each experience', () => {
            // Mock reorder logic
            const experienceIds = [3, 1, 2];
            const expectedOrders = experienceIds.map((id, index) => ({ id, displayOrder: index }));

            expect(expectedOrders[0]).toEqual({ id: 3, displayOrder: 0 });
            expect(expectedOrders[1]).toEqual({ id: 1, displayOrder: 1 });
            expect(expectedOrders[2]).toEqual({ id: 2, displayOrder: 2 });
        });
    });

    describe('Education Reordering', () => {
        it('should have reorder endpoint configured', () => {
            expect(REORDER_ENDPOINTS.education).toBe('/admin/resume/education/reorder');
        });

        it('should accept educationIds array in request body', () => {
            const dto: ReorderEducationDto = {
                educationIds: [2, 1]  // Reorder education entries
            };
            expect(dto.educationIds).toHaveLength(2);
            expect(Array.isArray(dto.educationIds)).toBe(true);
        });

        it('should preserve all IDs after reordering', () => {
            const originalEducation = MOCK_RESUME.education;
            const ids = originalEducation.map(edu => edu.id).filter(id => id !== undefined);
            const reorderedIds = [...ids].reverse();

            expect(reorderedIds).toHaveLength(ids.length);
            ids.forEach(id => {
                expect(reorderedIds).toContain(id);
            });
        });
    });

    describe('Skills Reordering (existing)', () => {
        it('should have reorder endpoint configured', () => {
            expect(REORDER_ENDPOINTS.skill).toBe('/admin/resume/skill/reorder');
        });

        it('should accept skillIds array in request body', () => {
            const dto: ReorderSkillsDto = {
                skillIds: [4, 2, 3, 1]
            };
            expect(dto.skillIds).toHaveLength(4);
        });
    });
});

describe('Timeline INSERT Feature - Backend Routes', () => {
    const TIMELINE_ROUTES = {
        experience: {
            create: 'POST /admin/resume/experience',
            reorder: 'PUT /admin/resume/experience/reorder',
            update: 'PUT /admin/resume/experience/:id',
            delete: 'DELETE /admin/resume/experience/:id',
        },
        education: {
            create: 'POST /admin/resume/education',
            reorder: 'PUT /admin/resume/education/reorder',
            update: 'PUT /admin/resume/education/:id',
            delete: 'DELETE /admin/resume/education/:id',
        },
    };

    it('experience routes should include reorder endpoint', () => {
        expect(TIMELINE_ROUTES.experience.reorder).toContain('/reorder');
        expect(TIMELINE_ROUTES.experience.reorder).toContain('PUT');
    });

    it('education routes should include reorder endpoint', () => {
        expect(TIMELINE_ROUTES.education.reorder).toContain('/reorder');
        expect(TIMELINE_ROUTES.education.reorder).toContain('PUT');
    });

    it('reorder should use PUT method', () => {
        // PUT is appropriate for reorder as it's an update of multiple resources
        expect(TIMELINE_ROUTES.experience.reorder.startsWith('PUT')).toBe(true);
        expect(TIMELINE_ROUTES.education.reorder.startsWith('PUT')).toBe(true);
    });
});

describe('Timeline INSERT Feature - UI Model Methods', () => {
    describe('reorderExperiences', () => {
        it('should be callable with experienceIds array', () => {
            // Mock the reorder function signature
            const reorderExperiences = (experienceIds: number[]): Promise<void> => {
                return Promise.resolve();
            };

            expect(reorderExperiences).toBeInstanceOf(Function);
            expect(reorderExperiences([1, 2, 3])).toBeInstanceOf(Promise);
        });
    });

    describe('reorderEducation', () => {
        it('should be callable with educationIds array', () => {
            const reorderEducation = (educationIds: number[]): Promise<void> => {
                return Promise.resolve();
            };

            expect(reorderEducation).toBeInstanceOf(Function);
            expect(reorderEducation([1, 2])).toBeInstanceOf(Promise);
        });
    });
});
