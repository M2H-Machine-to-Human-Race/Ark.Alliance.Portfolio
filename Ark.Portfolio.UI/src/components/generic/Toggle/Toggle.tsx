import React, { useState, useEffect } from 'react';
import { BaseComponentModel } from '../../base/BaseComponent.model';
import { Label } from '../Label';
import { cn } from '../../../utils/cn';
import './Toggle.styles.css';

/* TYPES */
export interface ToggleProps {
    id?: string;
    label?: string;
    checked?: boolean;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    onChange?: (checked: boolean) => void;
    className?: string;
}

/* MODEL */
export class ToggleViewModel extends BaseComponentModel {
}

/* COMPONENT */
export const Toggle: React.FC<ToggleProps> = ({
    id,
    label,
    checked = false,
    disabled = false,
    size = 'md',
    onChange,
    className
}) => {
    const [isOn, setIsOn] = useState(checked);

    useEffect(() => {
        setIsOn(checked);
    }, [checked]);

    const handleToggle = () => {
        if (disabled) return;
        const newValue = !isOn;
        setIsOn(newValue);
        if (onChange) onChange(newValue);
    };

    return (
        <div className={cn("ark-toggle-container", className)}>
            <div
                className={cn(
                    "ark-toggle",
                    isOn && "ark-toggle--on",
                    disabled && "ark-toggle--disabled",
                    `ark-toggle--${size}`
                )}
                onClick={handleToggle}
                role="switch"
                aria-checked={isOn}
                tabIndex={disabled ? -1 : 0}
                id={id}
            >
                <div className="ark-toggle-thumb" />
            </div>

            {label && (
                <Label
                    text={label}
                    htmlFor={id}
                    className="cursor-pointer select-none"
                />
            )}
        </div>
    );
};

