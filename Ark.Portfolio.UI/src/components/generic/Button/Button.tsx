import React from 'react';
import { ButtonProps } from './Button.types';
import { cn } from '../../../utils/cn';
import './Button.styles.css';

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading,
    leftIcon,
    rightIcon,
    className,
    disabled,
    ...props
}) => {
    return (
        <button
            className={cn('btn', `btn--${variant}`, `btn--${size}`, className)}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <div className="btn__spinner" />}
            {!isLoading && leftIcon}
            {children}
            {!isLoading && rightIcon}
        </button>
    );
};

