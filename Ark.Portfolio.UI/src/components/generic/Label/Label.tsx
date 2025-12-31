import React from 'react';
import { LabelProps } from './Label.types';
import { cn } from '../../../utils/cn';
import './Label.styles.css';

export const Label: React.FC<LabelProps> = ({
    text,
    htmlFor,
    variant = 'default',
    size = 'md',
    required = false,
    className
}) => {
    return (
        <label
            htmlFor={htmlFor}
            className={cn(
                'ark-label',
                `ark-label--${variant}`,
                `ark-label--${size}`,
                className
            )}
        >
            {text}
            {required && <span className="ark-label__required">*</span>}
        </label>
    );
};

