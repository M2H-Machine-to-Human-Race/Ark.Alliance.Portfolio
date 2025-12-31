import { ReactNode } from 'react';
import { IBaseComponentModel } from '../../base/BaseComponent.types';

export interface PanelProps {
    header?: ReactNode;
    footer?: ReactNode;
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'glass' | 'bordered';
}

export interface IPanelViewModel extends IBaseComponentModel {
    // Add specific Panel logic if needed (e.g., collapse interaction)
}

