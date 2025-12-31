/**
 * @fileoverview CarouselV2 View Component
 * Premium carousel with autoplay, keyboard nav, and touch support.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Pause, ArrowRight } from 'lucide-react';
import { useCarouselV2Model, CarouselSlide } from './CarouselV2.model';
import './CarouselV2.styles.css';

/**
 * CarouselV2 Props
 */
export interface CarouselV2Props {
    /** Slides to display */
    slides: CarouselSlide[];
    /** Autoplay interval in ms (default: 5000, 0 = disabled) */
    autoplayInterval?: number;
    /** Show navigation arrows */
    showNav?: boolean;
    /** Show dot indicators */
    showDots?: boolean;
    /** Show play/pause button */
    showPlayback?: boolean;
    /** Show progress bar */
    showProgress?: boolean;
    /** Loading state */
    isLoading?: boolean;
    /** Optional class name */
    className?: string;
}

/**
 * CarouselV2 Component
 * 
 * Polished, accessible carousel with:
 * - Autoplay with pause on interaction
 * - Arrow key navigation
 * - Touch swipe gestures
 * - Progress bar
 * - ARIA live announcements
 * - Reduced motion support
 */
export const CarouselV2: React.FC<CarouselV2Props> = ({
    slides,
    autoplayInterval = 5000,
    showNav = true,
    showDots = true,
    showPlayback = true,
    showProgress = true,
    isLoading = false,
    className = '',
}) => {
    const vm = useCarouselV2Model({
        slides,
        autoplayInterval,
        pauseOnInteraction: true,
    });

    // Render loading skeleton
    if (isLoading || slides.length === 0) {
        return (
            <div className={`carousel ${className}`} aria-busy="true">
                <div className="carousel-skeleton">
                    <div className="carousel-skeleton-subtitle skeleton" />
                    <div className="carousel-skeleton-title skeleton" />
                    <div className="carousel-skeleton-desc skeleton" />
                    <div className="carousel-skeleton-desc skeleton" />
                    <div className="carousel-skeleton-btn skeleton" />
                </div>
            </div>
        );
    }

    return (
        <div
            className={`carousel ${vm.isPlaying ? 'playing' : ''} ${className}`}
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured content carousel"
            onKeyDown={vm.handleKeyDown}
            onMouseEnter={vm.handleMouseEnter}
            onMouseLeave={vm.handleMouseLeave}
            onTouchStart={vm.handleTouchStart}
            onTouchEnd={vm.handleTouchEnd}
            onFocus={vm.handleFocus}
            onBlur={vm.handleBlur}
            tabIndex={0}
        >
            {/* Slides */}
            <div className="carousel-slides">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`carousel-slide ${index === vm.currentIndex ? 'active' : ''}`}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`Slide ${index + 1} of ${vm.totalSlides}: ${slide.title}`}
                        aria-hidden={index !== vm.currentIndex}
                    >
                        <div className="carousel-slide-inner">
                            {/* Background Image */}
                            {slide.imageUrl && (
                                <div className="carousel-bg">
                                    <img
                                        src={slide.imageUrl}
                                        alt=""
                                        className="carousel-bg-image"
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                    />
                                </div>
                            )}

                            {/* Content */}
                            <div className="carousel-content">
                                {slide.subtitle && (
                                    <p className="carousel-subtitle">{slide.subtitle}</p>
                                )}
                                <h2 className="carousel-title">
                                    {slide.title.split(' ').map((word, i) => (
                                        i === 0 ? <span key={i}>{word} </span> : word + ' '
                                    ))}
                                </h2>
                                {slide.description && (
                                    <p className="carousel-description">{slide.description}</p>
                                )}
                                {slide.ctaLink && (
                                    <Link to={slide.ctaLink} className="carousel-cta">
                                        {slide.ctaLabel || 'Learn More'}
                                        <ArrowRight size={16} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {showNav && slides.length > 1 && (
                <>
                    <div className="carousel-nav carousel-nav-prev">
                        <button
                            className="carousel-nav-btn"
                            onClick={vm.goToPrev}
                            aria-label="Previous slide"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    </div>
                    <div className="carousel-nav carousel-nav-next">
                        <button
                            className="carousel-nav-btn"
                            onClick={vm.goToNext}
                            aria-label="Next slide"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </>
            )}

            {/* Dot Indicators */}
            {showDots && slides.length > 1 && (
                <div className="carousel-dots" role="tablist" aria-label="Slide navigation">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`carousel-dot ${index === vm.currentIndex ? 'active' : ''}`}
                            onClick={() => vm.goToSlide(index)}
                            role="tab"
                            aria-selected={index === vm.currentIndex}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Play/Pause Button */}
            {showPlayback && autoplayInterval > 0 && (
                <div className="carousel-playback">
                    <button
                        className="carousel-playback-btn"
                        onClick={vm.togglePlay}
                        aria-label={vm.isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                    >
                        {vm.isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                </div>
            )}

            {/* Progress Bar */}
            {showProgress && vm.isPlaying && (
                <div className="carousel-progress">
                    <div
                        className="carousel-progress-bar"
                        key={vm.currentIndex}
                        style={{ animationDuration: `${autoplayInterval}ms` }}
                    />
                </div>
            )}

            {/* ARIA Live Region for Announcements */}
            <div
                className="carousel-announcer"
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >
                Slide {vm.currentIndex + 1} of {vm.totalSlides}: {vm.currentSlide?.title}
            </div>
        </div>
    );
};

export default CarouselV2;
