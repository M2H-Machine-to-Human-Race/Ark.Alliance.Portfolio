/**
 * @fileoverview HomePageV2 ViewModel
 * Manages homepage state including carousel data and navigation.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useState, useEffect, useCallback } from 'react';
import { CarouselSlide } from '../../components/CarouselV2';
import axios from 'axios';

const API_URL = 'http://localhost:5085/api';

/**
 * Quick navigation card configuration
 */
export interface QuickNavCard {
    id: string;
    title: string;
    description: string;
    path: string;
    icon: string;
    gradient: string;
}

/**
 * HomePageV2 ViewModel state
 */
export interface HomePageV2Model {
    /** Carousel slides from backend */
    carouselSlides: CarouselSlide[];
    /** Is carousel data loading */
    isLoading: boolean;
    /** Error message if any */
    error: string | null;
    /** Quick navigation cards */
    quickNavCards: QuickNavCard[];
    /** Profile data */
    profile: {
        firstName: string;
        lastName: string;
        title: string;
        overview: string;
    } | null;

    // Actions
    refetch: () => void;
}

/**
 * Default quick nav cards
 */
const QUICK_NAV_CARDS: QuickNavCard[] = [
    {
        id: 'resume',
        title: 'Resume',
        description: 'View my professional experience, education, and skills timeline',
        path: '/resume',
        icon: 'FileText',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    },
    {
        id: 'portfolio',
        title: 'Portfolio',
        description: 'Explore my projects, case studies, and technical work',
        path: '/projects',
        icon: 'Briefcase',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    },
    {
        id: 'architecture',
        title: 'Architecture',
        description: 'Discover the technical architecture and design patterns',
        path: '/architecture',
        icon: 'Layers',
        gradient: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
    },
];

/**
 * HomePageV2 ViewModel hook
 */
export const useHomePageV2Model = (): HomePageV2Model => {
    const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([]);
    const [profile, setProfile] = useState<HomePageV2Model['profile']>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Fetch carousel and profile in parallel
            const [carouselRes, profileRes] = await Promise.all([
                axios.get(`${API_URL}/carousel`).catch(() => ({ data: [] })),
                axios.get(`${API_URL}/profile`).catch(() => ({ data: null })),
            ]);

            // Map carousel items to slides
            const slides: CarouselSlide[] = carouselRes.data.map((item: any) => ({
                id: item.id,
                title: item.title || 'Welcome',
                subtitle: item.subtitle,
                description: item.description,
                imageUrl: item.imageUrl || item.mediaUrl,
                ctaLabel: item.ctaLabel || 'Learn More',
                ctaLink: item.ctaLink || '/projects',
            }));

            // Add default slide if no carousel items
            if (slides.length === 0) {
                slides.push({
                    id: 'default',
                    title: 'Welcome to My Portfolio',
                    subtitle: 'Full-Stack Developer',
                    description: 'Explore my projects, experience, and technical expertise in building modern web applications.',
                    ctaLabel: 'View Portfolio',
                    ctaLink: '/projects',
                });
            }

            setCarouselSlides(slides);
            setProfile(profileRes.data);
        } catch (err) {
            setError('Failed to load page data');
            // Set default slide on error
            setCarouselSlides([{
                id: 'error',
                title: 'Welcome to My Portfolio',
                subtitle: 'Explore & Discover',
                description: 'Browse my professional work, technical projects, and expertise.',
                ctaLabel: 'Get Started',
                ctaLink: '/projects',
            }]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        carouselSlides,
        isLoading,
        error,
        quickNavCards: QUICK_NAV_CARDS,
        profile,
        refetch: fetchData,
    };
};

export default useHomePageV2Model;
