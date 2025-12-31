import { BaseComponentModel } from '../../base/BaseComponent.model';
import { IconDefinition, IconRotation, IconSize } from './Icon.types';
import { IconRegistry } from './icons/IconRegistry';

export class IconViewModel extends BaseComponentModel {

    onInit(): void { }
    onDestroy(): void { }

    public getIconDefinition(name: string): IconDefinition | null {
        return IconRegistry.get(name) || null;
    }

    public getTransformStyle(rotation?: IconRotation, flip?: string): string {
        const transforms: string[] = [];

        if (rotation) {
            transforms.push(`rotate(${rotation}deg)`);
        }

        if (flip) {
            if (flip === 'horizontal') transforms.push('scaleX(-1)');
            if (flip === 'vertical') transforms.push('scaleY(-1)');
            if (flip === 'both') transforms.push('scale(-1)');
        }

        return transforms.join(' ');
    }

    public getSizeClass(size: IconSize): string {
        return `icon--${size}`;
    }
}

