import { ReactNode } from 'react';

export interface TimelineEntry {
    id: string;
    date: string;
    title: string;
    subtitle?: string;
    description?: string;
    icon?: ReactNode;
    category?: 'work' | 'education' | 'project';
}

export interface TimelineProps {
    entries: TimelineEntry[];
    mode?: 'left' | 'alternate';
    className?: string;
}

