export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconRotation = 0 | 90 | 180 | 270;

export interface IconProps {
    name: string;
    size?: IconSize;
    className?: string;
    color?: string;
    rotation?: IconRotation;
    flip?: 'horizontal' | 'vertical';
    spin?: boolean;
    ariaLabel?: string;
    onClick?: () => void;
}

export interface IconDefinition {
    name: string;
    path: string;
    viewBox?: string;
}

