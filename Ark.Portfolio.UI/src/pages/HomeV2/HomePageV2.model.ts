/**
 * @fileoverview HomePageV2 ViewModel
 * Manages homepage state including carousel data and navigation.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useState, useEffect, useCallback } from 'react';
import { CarouselSlide } from '../../components/CarouselV2';
import { DEFAULT_CAROUSEL_SLIDES } from '@ark/portfolio-share';
import { startupService } from '../../services/startup.service';
import axios from 'axios';
import { API_CONFIG } from '../../config/api.constants';

const API_URL = API_CONFIG.BASE_URL;

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
        gradient: 'var(--gradient-info, linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%))',
    },
    {
        id: 'portfolio',
        title: 'Portfolio',
        description: 'Explore my projects, case studies, and technical work',
        path: '/projects',
        icon: 'Briefcase',
        gradient: 'var(--gradient-secondary, linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%))',
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
            // First check if startup service already has data
            const startupData = startupService.getData();

            let carousel = startupData.carousel;
            let profileData = startupData.profile;

            // Only fetch if startup data is empty (shouldn't happen normally)
            if (carousel.length === 0) {
                const carouselRes = await axios.get(`${API_URL}/carousel`).catch(() => ({ data: [] }));
                carousel = carouselRes.data;
            }

            if (!profileData) {
                const profileRes = await axios.get(`${API_URL}/profile`).catch(() => ({ data: null }));
                profileData = profileRes.data;
            }

            // Map carousel items to slides
            const slides: CarouselSlide[] = carousel.map((item: any) => ({
                id: item.id,
                title: item.title || 'Welcome',
                subtitle: item.subtitle,
                description: item.description,
                imageUrl: item.imageUrl || item.mediaUrl,
                ctaLabel: item.linkText || item.ctaLabel || 'Learn More',
                ctaLink: item.linkUrl || item.ctaLink || '/projects',
            }));

            // Add default slide if no carousel items
            if (slides.length === 0) {
                slides.push(...DEFAULT_CAROUSEL_SLIDES);
            }

            setCarouselSlides(slides);
            setProfile(profileData);
        } catch (err) {
            setError('Failed to load page data');
            // Set default slide on error
            setCarouselSlides(DEFAULT_CAROUSEL_SLIDES as CarouselSlide[]);
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
