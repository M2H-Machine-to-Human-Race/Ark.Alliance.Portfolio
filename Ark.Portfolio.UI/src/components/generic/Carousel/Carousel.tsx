import React, { useEffect, useRef, useState } from 'react'; // Using useState for Reactivity, binding to VM
import { CarouselProps } from './Carousel.types';
import { CarouselViewModel } from './Carousel.model';
import { cn } from '../../../utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Carousel.styles.css';

export const Carousel: React.FC<CarouselProps> = ({
    items,
    autoPlayInterval,
    className,
    showIndicators = true,
    showControls = true
}) => {
    // We use useState to force re-renders when VM state changes
    const [currentIndex, setCurrentIndex] = useState(0);

    // ViewModel instantiation
    // In a stricter Setup, this might come from a hook useCarouselViewModel
    const vm = useRef(new CarouselViewModel(items.length, () => {
        setCurrentIndex(vm.current.currentIndex);
    }));

    useEffect(() => {
        vm.current.onInit();
        if (autoPlayInterval) {
            vm.current.startAutoPlay(autoPlayInterval);
        }
        return () => vm.current.onDestroy();
    }, [autoPlayInterval, items.length]);

    return (
        <div className={cn('carousel', className)}>
            <div
                className="carousel__track"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {items.map((item) => (
                    <div key={item.id} className="carousel__slide">
                        {item.content}
                    </div>
                ))}
            </div>

            {showControls && (
                <div className="carousel__controls">
                    <button className="carousel__btn" onClick={() => vm.current.previous()} aria-label="Previous">
                        <ChevronLeft size={20} />
                    </button>
                    <button className="carousel__btn" onClick={() => vm.current.next()} aria-label="Next">
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {showIndicators && (
                <div className="carousel__indicators">
                    {items.map((_, idx) => (
                        <button
                            key={idx}
                            className={cn('carousel__dot', idx === currentIndex && 'carousel__dot--active')}
                            onClick={() => vm.current.goTo(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

