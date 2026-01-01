/**
 * @fileoverview HeaderV2 ViewModel
 * Manages header state, navigation, and admin visibility logic.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { profileService } from '../../services/profile.service';
import { API_CONFIG } from '../../config/defaults';

/**
 * Navigation item configuration
 */
export interface NavItem {
    id: string;
    label: string;
    path: string;
    icon?: React.ReactNode;
}

/**
 * Profile data for header display
 */
export interface HeaderProfile {
    fullName: string;
    title: string;
}

/**
 * HeaderV2 ViewModel state and actions
 */
export interface HeaderV2Model {
    /** Navigation items */
    navItems: NavItem[];
    /** Current active path */
    activePath: string;
    /** Is mobile menu open */
    isMobileMenuOpen: boolean;
    /** Is user authenticated as admin */
    isAdmin: boolean;
    /** Is header scrolled (for shadow effect) */
    isScrolled: boolean;
    /** Profile data for header */
    profile: HeaderProfile;
    /** Current page title */
    currentPageTitle: string;
    /** Is export in progress */
    isExporting: boolean;
    /** Export status message */
    exportStatus: string | null;

    // Actions
    navigate: (path: string) => void;
    toggleMobileMenu: () => void;
    closeMobileMenu: () => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    generateStaticSite: () => Promise<void>;
}

/**
 * Primary navigation items
 */
const NAV_ITEMS: NavItem[] = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'resume', label: 'Resume', path: '/resume' },
    { id: 'portfolio', label: 'Projects Portfolio', path: '/projects' },
];

/**
 * Get page title from path
 */
const getPageTitle = (path: string): string => {
    if (path === '/' || path === '') return '';
    if (path.startsWith('/projects/')) return 'Project Details';
    if (path === '/projects') return 'Projects';
    if (path === '/resume' || path === '/cv') return 'Resume';
    if (path === '/architecture') return 'Architecture';
    if (path === '/login') return 'Login';
    if (path.startsWith('/admin')) return 'Admin';
    return '';
};

/**
 * HeaderV2 ViewModel hook
 * Encapsulates all header logic and state management.
 */
export const useHeaderV2Model = (): HeaderV2Model => {
    const navigateTo = useNavigate();
    const location = useLocation();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [exportStatus, setExportStatus] = useState<string | null>(null);
    const [profile, setProfile] = useState<HeaderProfile>({
        fullName: 'Armand Richelet-Kleinberg',
        title: 'AI Principal Solutions Architect'
    });

    // Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await profileService.getProfile();
                if (data) {
                    setProfile({
                        fullName: `${data.firstName} ${data.lastName}`,
                        title: data.title || ''
                    });
                }
            } catch (error) {
                console.warn('Failed to fetch profile for header:', error);
            }
        };
        fetchProfile();
    }, []);

    // Check admin status
    useEffect(() => {
        const checkAuth = () => {
            setIsAdmin(authService.isAuthenticated());
        };
        checkAuth();

        // Listen for auth changes
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    // Handle scroll for shadow effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Close mobile menu on escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isMobileMenuOpen]);

    const navigate = useCallback((path: string) => {
        navigateTo(path);
        setIsMobileMenuOpen(false);
    }, [navigateTo]);

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
    }, []);

    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu();
        }
    }, [toggleMobileMenu]);

    /**
     * Generate static website export
     */
    const generateStaticSite = useCallback(async () => {
        if (isExporting) return;

        setIsExporting(true);
        setExportStatus('Generating static site...');

        try {
            const token = authService.getToken();
            const response = await fetch(`${API_CONFIG.baseUrl}/admin/export/static`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Export failed: ${response.statusText}`);
            }

            // Download the ZIP file
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ark-portfolio-static-${new Date().toISOString().split('T')[0]}.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setExportStatus('Export complete!');
            setTimeout(() => setExportStatus(null), 3000);
        } catch (error) {
            console.error('Static site generation failed:', error);
            setExportStatus('Export failed. Check console.');
            setTimeout(() => setExportStatus(null), 5000);
        } finally {
            setIsExporting(false);
        }
    }, [isExporting]);

    return {
        navItems: NAV_ITEMS,
        activePath: location.pathname,
        isMobileMenuOpen,
        isAdmin,
        isScrolled,
        profile,
        currentPageTitle: getPageTitle(location.pathname),
        isExporting,
        exportStatus,
        navigate,
        toggleMobileMenu,
        closeMobileMenu,
        handleKeyDown,
        generateStaticSite,
    };
};

export default useHeaderV2Model;
