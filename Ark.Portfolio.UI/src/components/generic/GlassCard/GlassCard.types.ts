import { HTMLAttributes, ReactNode } from 'react';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    variant?: 'default' | 'scanner' | 'hologram';
    hoverEffect?: boolean;
}

