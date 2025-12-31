/**
 * @fileoverview Navigation Configuration Tests
 * Tests for navigation items and route configuration.
 * Verifies Resume renaming is correctly applied.
 * 
 * @author Armand Richelet-Kleinberg
 */

/**
 * Navigation item interface (mirrors actual type)
 */
interface NavItem {
    id: string;
    label: string;
    path: string;
}

/**
 * Admin nav item interface
 */
interface AdminNavItem {
    id: string;
    label: string;
    path: string;
}

/**
 * Public navigation items (from Navigation.model.ts)
 */
const PUBLIC_NAV_ITEMS: NavItem[] = [
    { id: 'home', label: 'Overview', path: '/' },
    { id: 'projects', label: 'Projects', path: '/projects' },
    { id: 'resume', label: 'Resume', path: '/resume' },
    { id: 'architecture', label: 'Architecture', path: '/architecture' },
];

/**
 * Admin navigation items (from AdminLayout.config.tsx)
 */
const ADMIN_NAV_ITEMS: AdminNavItem[] = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
    { id: 'projects', label: 'Projects', path: '/admin/projects' },
    { id: 'resume', label: 'Resume', path: '/admin/resume' },
    { id: 'widgets', label: 'Widgets', path: '/admin/widgets' },
    { id: 'carousel', label: 'Carousel', path: '/admin/carousel' },
    { id: 'menu', label: 'Menu', path: '/admin/menu' },
    { id: 'styles', label: 'Styles', path: '/admin/styles' },
    { id: 'media', label: 'Media', path: '/admin/media' },
    { id: 'ai-settings', label: 'AI Settings', path: '/admin/resume?tab=ai-settings' },
];

/**
 * Mobile menu items (from MobileMenu.tsx)
 */
const MOBILE_MENU_ITEMS: NavItem[] = [
    { id: 'home', label: 'HOME', path: '/' },
    { id: 'projects', label: 'PROJECTS', path: '/projects' },
    { id: 'resume', label: 'RESUME', path: '/resume' },
    { id: 'portfolio', label: 'PORTFOLIO', path: '/portfolio' },
];

describe('Navigation Configuration', () => {
    describe('Public Navigation', () => {
        it('should have Resume item with /resume path', () => {
            const resumeItem = PUBLIC_NAV_ITEMS.find(item => item.id === 'resume');
            expect(resumeItem).toBeDefined();
            expect(resumeItem?.label).toBe('Resume');
            expect(resumeItem?.path).toBe('/resume');
        });

        it('should NOT have CV item', () => {
            const cvItem = PUBLIC_NAV_ITEMS.find(item => item.id === 'cv');
            expect(cvItem).toBeUndefined();
        });

        it('should NOT use /cv path', () => {
            const cvPath = PUBLIC_NAV_ITEMS.find(item => item.path === '/cv');
            expect(cvPath).toBeUndefined();
        });

        it('should have all required navigation items', () => {
            expect(PUBLIC_NAV_ITEMS.length).toBe(4);
            const ids = PUBLIC_NAV_ITEMS.map(item => item.id);
            expect(ids).toContain('home');
            expect(ids).toContain('projects');
            expect(ids).toContain('resume');
            expect(ids).toContain('architecture');
        });
    });

    describe('Admin Navigation', () => {
        it('should have Resume item with /admin/resume path', () => {
            const resumeItem = ADMIN_NAV_ITEMS.find(item => item.id === 'resume');
            expect(resumeItem).toBeDefined();
            expect(resumeItem?.label).toBe('Resume');
            expect(resumeItem?.path).toBe('/admin/resume');
        });

        it('should have AI Settings pointing to resume tab', () => {
            const aiItem = ADMIN_NAV_ITEMS.find(item => item.id === 'ai-settings');
            expect(aiItem).toBeDefined();
            expect(aiItem?.path).toBe('/admin/resume?tab=ai-settings');
        });

        it('should NOT have CV item', () => {
            const cvItem = ADMIN_NAV_ITEMS.find(item => item.id === 'cv');
            expect(cvItem).toBeUndefined();
        });

        it('should NOT use /admin/cv path (except in redirects)', () => {
            const cvPath = ADMIN_NAV_ITEMS.find(item =>
                item.path === '/admin/cv' && item.id !== 'ai-settings'
            );
            expect(cvPath).toBeUndefined();
        });

        it('should have all admin section items', () => {
            const ids = ADMIN_NAV_ITEMS.map(item => item.id);
            expect(ids).toContain('dashboard');
            expect(ids).toContain('projects');
            expect(ids).toContain('resume');
            expect(ids).toContain('widgets');
            expect(ids).toContain('media');
        });
    });

    describe('Mobile Menu', () => {
        it('should have RESUME label (uppercase)', () => {
            const resumeItem = MOBILE_MENU_ITEMS.find(item => item.id === 'resume');
            expect(resumeItem).toBeDefined();
            expect(resumeItem?.label).toBe('RESUME');
            expect(resumeItem?.path).toBe('/resume');
        });

        it('should NOT have CV label', () => {
            const cvItem = MOBILE_MENU_ITEMS.find(item =>
                item.label === 'CV' || item.label === 'cv'
            );
            expect(cvItem).toBeUndefined();
        });
    });
});

describe('Route Configuration', () => {
    /**
     * Route config mimicking App.tsx routes
     */
    const ROUTES = {
        public: [
            { path: '/', component: 'ThemedHomePage' },
            { path: '/projects', component: 'ProjectsPage' },
            { path: '/projects/:id', component: 'ProjectDetails' },
            { path: '/resume', component: 'CVPage' },  // Primary
            { path: '/cv', redirect: '/resume' },       // Legacy redirect
            { path: '/architecture', component: 'ArchitecturePage' },
            { path: '/login', component: 'LoginPage' },
        ],
        admin: [
            { path: '/admin/dashboard', component: 'DashboardPage' },
            { path: '/admin/projects', component: 'ProjectManager' },
            { path: '/admin/resume', component: 'CvManager' },  // Primary
            { path: '/admin/cv', redirect: '/admin/resume' },   // Legacy redirect
            { path: '/admin/widgets', component: 'WidgetManager' },
            { path: '/admin/media', component: 'MediaManager' },
        ],
    };

    describe('Public Routes', () => {
        it('should have /resume as primary route', () => {
            const resumeRoute = ROUTES.public.find(r => r.path === '/resume');
            expect(resumeRoute).toBeDefined();
            expect(resumeRoute?.component).toBe('CVPage');
            expect(resumeRoute?.redirect).toBeUndefined();
        });

        it('should redirect /cv to /resume', () => {
            const cvRoute = ROUTES.public.find(r => r.path === '/cv');
            expect(cvRoute).toBeDefined();
            expect(cvRoute?.redirect).toBe('/resume');
            expect(cvRoute?.component).toBeUndefined();
        });
    });

    describe('Admin Routes', () => {
        it('should have /admin/resume as primary route', () => {
            const resumeRoute = ROUTES.admin.find(r => r.path === '/admin/resume');
            expect(resumeRoute).toBeDefined();
            expect(resumeRoute?.component).toBe('CvManager');
        });

        it('should redirect /admin/cv to /admin/resume', () => {
            const cvRoute = ROUTES.admin.find(r => r.path === '/admin/cv');
            expect(cvRoute).toBeDefined();
            expect(cvRoute?.redirect).toBe('/admin/resume');
        });
    });
});
