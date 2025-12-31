import { BaseComponentModel } from '../../base/BaseComponent.model';
import { ICarouselViewModel } from './Carousel.types';

export class CarouselViewModel extends BaseComponentModel implements ICarouselViewModel {
    public currentIndex: number = 0;
    private autoPlayTimer: ReturnType<typeof setTimeout> | null = null;
    private readonly totalItems: number;
    private readonly onUpdate: () => void;

    constructor(totalItems: number, onUpdate: () => void) {
        super();
        this.totalItems = totalItems;
        this.onUpdate = onUpdate;
    }

    onInit(): void { }

    onDestroy(): void {
        this.stopAutoPlay();
    }

    public next(): void {
        this.currentIndex = (this.currentIndex + 1) % this.totalItems;
        this.onUpdate();
    }

    public previous(): void {
        this.currentIndex = (this.currentIndex - 1 + this.totalItems) % this.totalItems;
        this.onUpdate();
    }

    public goTo(index: number): void {
        if (index >= 0 && index < this.totalItems) {
            this.currentIndex = index;
            this.onUpdate();
        }
    }

    public startAutoPlay(intervalMs: number): void {
        this.stopAutoPlay();
        this.autoPlayTimer = setInterval(() => {
            this.next();
        }, intervalMs);
    }

    public stopAutoPlay(): void {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }
}

