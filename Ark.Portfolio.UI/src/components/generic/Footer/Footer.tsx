import React from 'react';
import { FooterProps } from './Footer.types';
import { cn } from '../../../utils/cn';
import './Footer.styles.css';

export const Footer: React.FC<FooterProps> = ({
    children,
    className,
    align = 'right'
}) => {
    return (
        <div className={cn('footer', `footer--${align}`, className)}>
            {children}
        </div>
    );
};

