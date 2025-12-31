import React, { useState, useEffect } from 'react';
import { BaseComponentModel } from '../../base/BaseComponent.model';
import { Label } from '../Label';
import { Icon } from '../Icon'; // Reuse our Icon component
import { cn } from '../../../utils/cn';

/* TYPES */
export interface CheckBoxProps {
    id?: string;
    label?: string;
    checked?: boolean | 'indeterminate';
    disabled?: boolean;
    required?: boolean;
    error?: boolean;
    onChange?: (checked: boolean) => void;
    className?: string;
}

/* MODEL */
export class CheckBoxViewModel extends BaseComponentModel {
    // Logic simplified for checkbox, mostly handled in component or parent form
}

/* STYLES (Inline simple styles or CSS module) */
// We will use tailwind utility classes heavily here combined with some custom css 
// but sticking to the pattern of separate CSS file
import './CheckBox.styles.css';

/* COMPONENT */
export const CheckBox: React.FC<CheckBoxProps> = ({
    id,
    label,
    checked = false,
    disabled = false,
    required = false,
    error = false,
    onChange,
    className
}) => {
    const [isChecked, setIsChecked] = useState(checked);

    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    const toggle = () => {
        if (disabled) return;
        const newValue = isChecked === true ? false : true; // Indeterminate -> True
        setIsChecked(newValue);
        if (onChange) onChange(newValue);
    };

    return (
        <div className={cn("ark-checkbox-container", className)}>
            <div
                className={cn(
                    "ark-checkbox",
                    isChecked === true && "ark-checkbox--checked",
                    isChecked === 'indeterminate' && "ark-checkbox--indeterminate",
                    disabled && "ark-checkbox--disabled",
                    error && "ark-checkbox--error"
                )}
                onClick={toggle}
                role="checkbox"
                aria-checked={isChecked === 'indeterminate' ? 'mixed' : isChecked}
                tabIndex={disabled ? -1 : 0}
                onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        toggle();
                    }
                }}
                id={id}
            >
                {isChecked === true && <Icon name="check" size="sm" />}
                {isChecked === 'indeterminate' && <div className="ark-checkbox-dash" />}
            </div>

            {label && (
                <Label
                    text={label}
                    htmlFor={id}
                    required={required}
                    className="cursor-pointer select-none"
                    variant={error ? 'error' : 'default'}
                // Click on label toggles box
                />
            )}
        </div>
    );
};

