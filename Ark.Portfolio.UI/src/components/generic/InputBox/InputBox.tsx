import React, { useState, useEffect, useMemo } from 'react';
import { InputBoxProps } from './InputBox.types';
import { InputBoxViewModel } from './InputBox.model';
import { Label } from '../Label';
import { cn } from '../../../utils/cn';
import './InputBox.styles.css';

export const InputBox: React.FC<InputBoxProps> = ({
    id,
    name,
    label,
    placeholder,
    value = '',
    type = 'text',
    error,
    helperText,
    disabled,
    required,
    readOnly,
    leftIcon,
    rightIcon,
    onChange,
    onBlur,
    onFocus,
    onEnterPress,
    validate
}) => {
    // We use VM logic but bridge it to React state for controlled input
    const vm = useMemo(() => new InputBoxViewModel(value, validate), [validate]); // Value prop is initial for VM, but we update it

    // React State to drive UI
    const [currentValue, setCurrentValue] = useState(value);
    const [internalError, setInternalError] = useState<string | null>(null);

    // Sync prop changes
    useEffect(() => {
        if (value !== currentValue) {
            setCurrentValue(value);
            vm.setValue(value);
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        setCurrentValue(newVal);
        vm.setValue(newVal);
        setInternalError(vm.errorMessage);

        if (onChange) onChange(newVal);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onEnterPress) {
            onEnterPress();
        }
    };

    // effective error is either prop error or validation error
    const effectiveError = error || internalError;

    return (
        <div className="ark-input-container">
            {label && (
                <Label
                    text={label}
                    htmlFor={id || name}
                    required={required}
                    variant={effectiveError ? 'error' : 'default'}
                />
            )}

            <div className={cn(
                'ark-input-wrapper',
                effectiveError && 'ark-input-wrapper--error',
                disabled && 'ark-input-wrapper--disabled'
            )}>
                {leftIcon && <div className="ark-input-icon pl-3 pr-0">{leftIcon}</div>}

                <input
                    id={id || name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={currentValue}
                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}
                    className="ark-input"
                    onChange={handleChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onKeyDown={handleKeyDown}
                />

                {rightIcon && <div className="ark-input-icon pr-3 pl-0">{rightIcon}</div>}
            </div>

            {(effectiveError || helperText) && (
                <div className="flex flex-col gap-1">
                    {effectiveError && (
                        <span className="ark-input-error-msg">{effectiveError}</span>
                    )}
                    {!effectiveError && helperText && (
                        <span className="ark-input-helper">{helperText}</span>
                    )}
                </div>
            )}
        </div>
    );
};

