/**
 * @fileoverview CarouselV2 ViewModel
 * Manages carousel state, autoplay, navigation, and touch gestures.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Carousel slide data structure
 */
export interface CarouselSlide {
    id: number | string;
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    ctaLabel?: string;
    ctaLink?: string;
}

/**
 * CarouselV2 ViewModel configuration
 */
export interface CarouselV2Config {
    /** Slides data */
    slides: CarouselSlide[];
    /** Autoplay interval in ms (0 = disabled) */
    autoplayInterval?: number;
    /** Pause autoplay on hover/focus */
    pauseOnInteraction?: boolean;
    /** Starting slide index */
    initialIndex?: number;
}

/**
 * CarouselV2 ViewModel state and actions
 */
export interface CarouselV2Model {
    /** Current slide index */
    currentIndex: number;
    /** Total number of slides */
    totalSlides: number;
    /** Is autoplay currently running */
    isPlaying: boolean;
    /** Is carousel being interacted with */
    isInteracting: boolean;
    /** Direction of last navigation (for animation) */
    direction: 'left' | 'right';
    /** Current slide data */
    currentSlide: CarouselSlide | undefined;

    // Actions
    goToSlide: (index: number) => void;
    goToNext: () => void;
    goToPrev: () => void;
    togglePlay: () => void;
    pause: () => void;
    resume: () => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    handleTouchStart: (e: React.TouchEvent) => void;
    handleTouchEnd: (e: React.TouchEvent) => void;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    handleFocus: () => void;
    handleBlur: () => void;
}

/**
 * CarouselV2 ViewModel hook
 * Encapsulates all carousel logic including autoplay and gestures.
 */
export const useCarouselV2Model = (config: CarouselV2Config): CarouselV2Model => {
    const {
        slides,
        autoplayInterval = 5000,
        pauseOnInteraction = true,
        initialIndex = 0,
    } = config;

    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isPlaying, setIsPlaying] = useState(autoplayInterval > 0);
    const [isInteracting, setIsInteracting] = useState(false);
    const [direction, setDirection] = useState<'left' | 'right'>('right');

    const touchStartX = useRef<number>(0);
    const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const totalSlides = slides.length;

    // Clear autoplay timeout
    const clearAutoplay = useCallback(() => {
        if (autoplayRef.current) {
            clearTimeout(autoplayRef.current);
            autoplayRef.current = null;
        }
    }, []);

    // Schedule next autoplay
    const scheduleAutoplay = useCallback(() => {
        if (isPlaying && autoplayInterval > 0 && !isInteracting) {
            clearAutoplay();
            autoplayRef.current = setTimeout(() => {
                setDirection('right');
                setCurrentIndex(prev => (prev + 1) % totalSlides);
            }, autoplayInterval);
        }
    }, [isPlaying, autoplayInterval, isInteracting, totalSlides, clearAutoplay]);

    // Handle autoplay
    useEffect(() => {
        scheduleAutoplay();
        return clearAutoplay;
    }, [scheduleAutoplay, clearAutoplay, currentIndex]);

    // Navigation actions
    const goToSlide = useCallback((index: number) => {
        if (index < 0 || index >= totalSlides) return;
        setDirection(index > currentIndex ? 'right' : 'left');
        setCurrentIndex(index);
    }, [currentIndex, totalSlides]);

    const goToNext = useCallback(() => {
        setDirection('right');
        setCurrentIndex(prev => (prev + 1) % totalSlides);
    }, [totalSlides]);

    const goToPrev = useCallback(() => {
        setDirection('left');
        setCurrentIndex(prev => (prev - 1 + totalSlides) % totalSlides);
    }, [totalSlides]);

    // Playback controls
    const togglePlay = useCallback(() => {
        setIsPlaying(prev => !prev);
    }, []);

    const pause = useCallback(() => {
        setIsPlaying(false);
        clearAutoplay();
    }, [clearAutoplay]);

    const resume = useCallback(() => {
        setIsPlaying(true);
    }, []);

    // Keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                goToPrev();
                break;
            case 'ArrowRight':
                e.preventDefault();
                goToNext();
                break;
            case ' ':
                e.preventDefault();
                togglePlay();
                break;
            case 'Escape':
                e.preventDefault();
                pause();
                break;
        }
    }, [goToNext, goToPrev, togglePlay, pause]);

    // Touch gestures
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        if (pauseOnInteraction) {
            setIsInteracting(true);
        }
    }, [pauseOnInteraction]);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                goToNext();
            } else {
                goToPrev();
            }
        }

        if (pauseOnInteraction) {
            setIsInteracting(false);
        }
    }, [goToNext, goToPrev, pauseOnInteraction]);

    // Hover/focus interactions
    const handleMouseEnter = useCallback(() => {
        if (pauseOnInteraction) {
            setIsInteracting(true);
        }
    }, [pauseOnInteraction]);

    const handleMouseLeave = useCallback(() => {
        if (pauseOnInteraction) {
            setIsInteracting(false);
        }
    }, [pauseOnInteraction]);

    const handleFocus = useCallback(() => {
        if (pauseOnInteraction) {
            setIsInteracting(true);
        }
    }, [pauseOnInteraction]);

    const handleBlur = useCallback(() => {
        if (pauseOnInteraction) {
            setIsInteracting(false);
        }
    }, [pauseOnInteraction]);

    return {
        currentIndex,
        totalSlides,
        isPlaying,
        isInteracting,
        direction,
        currentSlide: slides[currentIndex],
        goToSlide,
        goToNext,
        goToPrev,
        togglePlay,
        pause,
        resume,
        handleKeyDown,
        handleTouchStart,
        handleTouchEnd,
        handleMouseEnter,
        handleMouseLeave,
        handleFocus,
        handleBlur,
    };
};

export default useCarouselV2Model;
