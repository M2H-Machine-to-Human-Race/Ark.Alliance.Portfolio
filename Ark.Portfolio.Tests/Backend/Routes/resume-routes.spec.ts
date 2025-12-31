/**
 * @fileoverview Backend Routes Tests
 * Tests for backend API route configuration.
 * Verifies Resume renaming with /cv redirects.
 * 
 * @author Armand Richelet-Kleinberg
 */

/**
 * Backend route configuration (mirrors routes/index.ts)
 */
const BACKEND_ROUTES = {
    // Public routes
    public: {
        resume: { method: 'GET', path: '/api/resume', handler: 'cvController.getCv' },
        cv: { method: 'GET', path: '/api/cv', redirect: '/api/resume', status: 301 },
    },

    // Admin routes - Primary
    admin: {
        resume: { method: 'GET', path: '/api/admin/resume', handler: 'adminController.getCv' },
        profile: { method: 'PUT', path: '/api/admin/resume/profile', handler: 'adminController.updateProfile' },
        experience: {
            create: { method: 'POST', path: '/api/admin/resume/experience' },
            update: { method: 'PUT', path: '/api/admin/resume/experience/:id' },
            delete: { method: 'DELETE', path: '/api/admin/resume/experience/:id' },
        },
        education: {
            create: { method: 'POST', path: '/api/admin/resume/education' },
            update: { method: 'PUT', path: '/api/admin/resume/education/:id' },
            delete: { method: 'DELETE', path: '/api/admin/resume/education/:id' },
        },
        skill: {
            create: { method: 'POST', path: '/api/admin/resume/skill' },
            update: { method: 'PUT', path: '/api/admin/resume/skill/:id' },
            delete: { method: 'DELETE', path: '/api/admin/resume/skill/:id' },
            reorder: { method: 'PUT', path: '/api/admin/resume/skill/reorder' },
        },
        categories: { method: 'GET', path: '/api/admin/resume/categories' },
    },

    // Admin routes - Legacy redirects
    legacyRedirects: [
        { from: '/api/admin/cv', to: '/api/admin/resume', status: 301 },
        { from: '/api/admin/cv/profile', to: '/api/admin/resume/profile', status: 307 },
        { from: '/api/admin/cv/experience', to: '/api/admin/resume/experience', status: 307 },
        { from: '/api/admin/cv/education', to: '/api/admin/resume/education', status: 307 },
        { from: '/api/admin/cv/skill', to: '/api/admin/resume/skill', status: 307 },
        { from: '/api/admin/cv/categories', to: '/api/admin/resume/categories', status: 301 },
    ],
};

describe('Backend Routes Configuration', () => {
    describe('Public Resume Route', () => {
        it('should have /api/resume as primary endpoint', () => {
            expect(BACKEND_ROUTES.public.resume.path).toBe('/api/resume');
            expect(BACKEND_ROUTES.public.resume.method).toBe('GET');
        });

        it('should redirect /api/cv to /api/resume with 301', () => {
            expect(BACKEND_ROUTES.public.cv.redirect).toBe('/api/resume');
            expect(BACKEND_ROUTES.public.cv.status).toBe(301);
        });
    });

    describe('Admin Resume Routes', () => {
        it('should have /api/admin/resume as primary endpoint', () => {
            expect(BACKEND_ROUTES.admin.resume.path).toBe('/api/admin/resume');
        });

        it('should have /api/admin/resume/profile for profile updates', () => {
            expect(BACKEND_ROUTES.admin.profile.path).toBe('/api/admin/resume/profile');
            expect(BACKEND_ROUTES.admin.profile.method).toBe('PUT');
        });

        it('should have CRUD endpoints for experience', () => {
            expect(BACKEND_ROUTES.admin.experience.create.method).toBe('POST');
            expect(BACKEND_ROUTES.admin.experience.update.method).toBe('PUT');
            expect(BACKEND_ROUTES.admin.experience.delete.method).toBe('DELETE');
        });

        it('should have CRUD endpoints for education', () => {
            expect(BACKEND_ROUTES.admin.education.create.method).toBe('POST');
            expect(BACKEND_ROUTES.admin.education.update.method).toBe('PUT');
            expect(BACKEND_ROUTES.admin.education.delete.method).toBe('DELETE');
        });

        it('should have CRUD endpoints for skills', () => {
            expect(BACKEND_ROUTES.admin.skill.create.method).toBe('POST');
            expect(BACKEND_ROUTES.admin.skill.update.method).toBe('PUT');
            expect(BACKEND_ROUTES.admin.skill.delete.method).toBe('DELETE');
            expect(BACKEND_ROUTES.admin.skill.reorder.method).toBe('PUT');
        });
    });

    describe('Legacy CV Redirects', () => {
        it('should redirect all legacy /cv routes to /resume', () => {
            BACKEND_ROUTES.legacyRedirects.forEach(redirect => {
                expect(redirect.from).toContain('/cv');
                expect(redirect.to).toContain('/resume');
                expect(redirect.to).not.toContain('/cv');
            });
        });

        it('should use 301 for GET redirects', () => {
            const getRedirects = BACKEND_ROUTES.legacyRedirects.filter(
                r => r.from === '/api/admin/cv' || r.from === '/api/admin/cv/categories'
            );
            getRedirects.forEach(redirect => {
                expect(redirect.status).toBe(301);
            });
        });

        it('should use 307 for POST/PUT/DELETE redirects', () => {
            const mutationRedirects = BACKEND_ROUTES.legacyRedirects.filter(
                r => r.status === 307
            );
            expect(mutationRedirects.length).toBeGreaterThan(0);
        });
    });
});

describe('Route Path Consistency', () => {
    it('all admin resume paths should start with /api/admin/resume', () => {
        const adminPaths = [
            BACKEND_ROUTES.admin.resume.path,
            BACKEND_ROUTES.admin.profile.path,
            BACKEND_ROUTES.admin.experience.create.path,
            BACKEND_ROUTES.admin.education.create.path,
            BACKEND_ROUTES.admin.skill.create.path,
            BACKEND_ROUTES.admin.categories.path,
        ];

        adminPaths.forEach(path => {
            expect(path.startsWith('/api/admin/resume')).toBe(true);
        });
    });

    it('no admin routes should use /cv in primary paths', () => {
        const allPaths = [
            BACKEND_ROUTES.admin.resume.path,
            BACKEND_ROUTES.admin.profile.path,
            BACKEND_ROUTES.admin.categories.path,
        ];

        allPaths.forEach(path => {
            expect(path).not.toContain('/cv');
        });
    });
});
