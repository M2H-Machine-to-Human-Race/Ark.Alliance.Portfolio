import { ReactNode } from 'react';

export interface HeaderProps {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
    className?: string;
    variant?: 'panel' | 'page' | 'section';
}

