import React from 'react';

export interface InputBoxProps {
    id?: string;
    name?: string;
    label?: string;
    placeholder?: string;
    value?: string;
    type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';
    error?: string;
    helperText?: string;
    disabled?: boolean;
    required?: boolean;
    readOnly?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;

    // Events
    onChange?: (value: string) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onEnterPress?: () => void;

    // Validation (Simple built-in)
    validate?: (value: string) => string | null; // Returns error message or null
}

