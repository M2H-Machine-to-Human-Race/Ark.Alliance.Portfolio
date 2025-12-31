import { ReactNode } from 'react';

export interface FooterProps {
    children: ReactNode;
    className?: string;
    align?: 'left' | 'center' | 'right' | 'between';
}

