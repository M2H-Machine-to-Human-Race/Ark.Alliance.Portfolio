import React from 'react';
import { PanelProps } from './Panel.types';
import { cn } from '../../../utils/cn';
import './Panel.styles.css';

export const Panel: React.FC<PanelProps> = ({
    children,
    header,
    footer,
    className,
    variant = 'glass'
}) => {
    return (
        <div className={cn('panel', `panel--${variant}`, className)}>
            {header && <div className="panel__header">{header}</div>}
            <div className="panel__body">{children}</div>
            {footer && <div className="panel__footer">{footer}</div>}
        </div>
    );
};

