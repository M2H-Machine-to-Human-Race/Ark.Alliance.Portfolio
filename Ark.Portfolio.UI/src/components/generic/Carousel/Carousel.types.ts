export interface CarouselItem {
    id: string;
    content: React.ReactNode;
    title?: string;
}

export interface CarouselProps {
    items: CarouselItem[];
    autoPlayInterval?: number; // ms
    className?: string;
    showIndicators?: boolean;
    showControls?: boolean;
}

export interface ICarouselViewModel {
    currentIndex: number;
    next(): void;
    previous(): void;
    goTo(index: number): void;
    startAutoPlay(intervalMs: number): void;
    stopAutoPlay(): void;
}

