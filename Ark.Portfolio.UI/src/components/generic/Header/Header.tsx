import React from 'react';
import { HeaderProps } from './Header.types';
import { cn } from '../../../utils/cn';
import './Header.styles.css';

export const Header: React.FC<HeaderProps> = ({
    title,
    subtitle,
    actions,
    className,
    variant = 'panel'
}) => {
    return (
        <div className={cn('header', `header--${variant}`, className)}>
            <div className="header__title-group">
                <h2 className="header__title">{title}</h2>
                {subtitle && <p className="header__subtitle">{subtitle}</p>}
            </div>
            {actions && <div className="header__actions">{actions}</div>}
        </div>
    );
};

