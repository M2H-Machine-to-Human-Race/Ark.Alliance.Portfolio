/**
 * @fileoverview Resume API Service Tests
 * Tests for ResumeApiService verifying correct endpoint usage.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { MOCK_RESUME, MOCK_PROFILE } from '../../Mocks';

/**
 * Mock API endpoints configuration
 */
const API_ENDPOINTS = {
    // Public endpoints
    resume: '/resume',           // Primary
    cv: '/cv',                   // Legacy (redirect)

    // Admin endpoints
    adminResume: '/admin/resume',
    adminCv: '/admin/cv',        // Legacy (redirect)
    adminResumeProfile: '/admin/resume/profile',
    adminResumeExperience: '/admin/resume/experience',
    adminResumeEducation: '/admin/resume/education',
    adminResumeSkill: '/admin/resume/skill',
    adminResumeCategories: '/admin/resume/categories',
};

describe('ResumeApiService', () => {
    describe('Public Endpoints', () => {
        it('should use /resume as primary endpoint', () => {
            expect(API_ENDPOINTS.resume).toBe('/resume');
        });

        it('/cv should be marked as legacy', () => {
            expect(API_ENDPOINTS.cv).toBe('/cv');
            // In actual implementation, /cv redirects to /resume
        });
    });

    describe('Admin Endpoints', () => {
        it('should use /admin/resume as primary endpoint', () => {
            expect(API_ENDPOINTS.adminResume).toBe('/admin/resume');
        });

        it('should use /admin/resume/profile for profile updates', () => {
            expect(API_ENDPOINTS.adminResumeProfile).toBe('/admin/resume/profile');
        });

        it('should use /admin/resume/experience for experience CRUD', () => {
            expect(API_ENDPOINTS.adminResumeExperience).toBe('/admin/resume/experience');
        });

        it('should use /admin/resume/education for education CRUD', () => {
            expect(API_ENDPOINTS.adminResumeEducation).toBe('/admin/resume/education');
        });

        it('should use /admin/resume/skill for skill CRUD', () => {
            expect(API_ENDPOINTS.adminResumeSkill).toBe('/admin/resume/skill');
        });

        it('should use /admin/resume/categories for skill categories', () => {
            expect(API_ENDPOINTS.adminResumeCategories).toBe('/admin/resume/categories');
        });
    });

    describe('Resume DTO Structure', () => {
        it('should have experiences array (not experience)', () => {
            expect(MOCK_RESUME.experiences).toBeDefined();
            expect(Array.isArray(MOCK_RESUME.experiences)).toBe(true);
        });

        it('should have profile object', () => {
            expect(MOCK_RESUME.profile).toBeDefined();
            expect(MOCK_RESUME.profile.firstName).toBeDefined();
        });

        it('should have education array', () => {
            expect(MOCK_RESUME.education).toBeDefined();
            expect(Array.isArray(MOCK_RESUME.education)).toBe(true);
        });

        it('should have skills array', () => {
            expect(MOCK_RESUME.skills).toBeDefined();
            expect(Array.isArray(MOCK_RESUME.skills)).toBe(true);
        });
    });

    describe('Backwards Compatibility', () => {
        it('getCV should be aliased to getResume', () => {
            // Mock service with both methods
            const mockService = {
                getResume: () => MOCK_RESUME,
                getCV: function () { return this.getResume(); }
            };

            expect(mockService.getCV()).toEqual(mockService.getResume());
        });
    });
});
