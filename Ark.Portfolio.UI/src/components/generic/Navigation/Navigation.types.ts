import { ComponentType } from 'react';

export interface NavItem {
    label: string;
    path: string;
    icon: any; // Relaxed type for Lucide icons compatibility
}

export interface NavigationProps {
    className?: string;
    onNavigate?: () => void;
}

export interface INavigationViewModel {
    items: NavItem[];
    isActive(path: string): boolean;
    navigateTo(path: string): void;
}

