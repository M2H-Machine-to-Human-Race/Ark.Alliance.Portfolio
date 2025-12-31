import { BaseComponentModel } from '../../base/BaseComponent.model';
import { INavigationViewModel, NavItem } from './Navigation.types';
import { Home, Layers, FileText, Cpu, LucideIcon } from 'lucide-react';
import { NavigateFunction } from 'react-router-dom';
import { profileService } from '../../../services/profile.service';
import { ProfileDto } from '@ark/portfolio-share';

export class NavigationViewModel extends BaseComponentModel implements INavigationViewModel {
    private _items: NavItem[] = [];
    private _profile: ProfileDto | null = null;

    constructor(
        private currentPath: string,
        private navigateFn: NavigateFunction
    ) {
        super();
        this.initializeItems();
        this.loadProfile();
    }

    private initializeItems() {
        this._items = [
            { icon: Home, label: 'Overview', path: '/' },
            { icon: Layers, label: 'Projects', path: '/projects' },
            { icon: FileText, label: 'Resume', path: '/resume' },
            { icon: Cpu, label: 'Architecture', path: '/architecture' },
        ];
    }

    private async loadProfile() {
        try {
            this._profile = await profileService.getProfile();
        } catch (error) {
            console.error('Failed to load profile for navigation', error);
        }
    }

    get items(): NavItem[] {
        return this._items;
    }

    get profile(): ProfileDto | null {
        return this._profile;
    }

    onInit(): void { }
    onDestroy(): void { }

    public isActive(path: string): boolean {
        return this.currentPath === path;
    }

    public navigateTo(path: string): void {
        this.navigateFn(path);
    }
}

