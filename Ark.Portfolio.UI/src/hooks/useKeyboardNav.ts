/**
 * @fileoverview Accessibility Hook - useKeyboardNav
 * Adds keyboard navigation to list components.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useCallback, useState, KeyboardEvent } from 'react';

export interface UseKeyboardNavOptions<T> {
    /** Items to navigate */
    items: T[];
    /** Callback when item is activated (Enter/Space) */
    onActivate?: (item: T, index: number) => void;
    /** Whether navigation wraps around */
    wrap?: boolean;
    /** Initial focus index */
    initialIndex?: number;
}

export interface UseKeyboardNavReturn {
    /** Current focused index */
    focusedIndex: number;
    /** Set focused index */
    setFocusedIndex: (index: number) => void;
    /** Keyboard event handler */
    handleKeyDown: (e: KeyboardEvent) => void;
    /** Get props for an item */
    getItemProps: (index: number) => {
        tabIndex: number;
        'aria-selected': boolean;
        onKeyDown: (e: KeyboardEvent) => void;
    };
}

/**
 * Hook to add keyboard navigation to lists and grids.
 * Implements arrow key navigation and Enter/Space activation.
 * 
 * @example
 * const { focusedIndex, getItemProps } = useKeyboardNav({
 *   items,
 *   onActivate: (item) => selectItem(item)
 * });
 */
export const useKeyboardNav = <T>(
    options: UseKeyboardNavOptions<T>
): UseKeyboardNavReturn => {
    const { items, onActivate, wrap = true, initialIndex = 0 } = options;
    const [focusedIndex, setFocusedIndex] = useState(initialIndex);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const { key } = e;

        switch (key) {
            case 'ArrowDown':
            case 'ArrowRight':
                e.preventDefault();
                setFocusedIndex(prev => {
                    const next = prev + 1;
                    if (next >= items.length) {
                        return wrap ? 0 : prev;
                    }
                    return next;
                });
                break;

            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                setFocusedIndex(prev => {
                    const next = prev - 1;
                    if (next < 0) {
                        return wrap ? items.length - 1 : prev;
                    }
                    return next;
                });
                break;

            case 'Home':
                e.preventDefault();
                setFocusedIndex(0);
                break;

            case 'End':
                e.preventDefault();
                setFocusedIndex(items.length - 1);
                break;

            case 'Enter':
            case ' ':
                e.preventDefault();
                if (onActivate && items[focusedIndex]) {
                    onActivate(items[focusedIndex], focusedIndex);
                }
                break;
        }
    }, [items, focusedIndex, wrap, onActivate]);

    const getItemProps = useCallback((index: number) => ({
        tabIndex: index === focusedIndex ? 0 : -1,
        'aria-selected': index === focusedIndex,
        onKeyDown: handleKeyDown
    }), [focusedIndex, handleKeyDown]);

    return {
        focusedIndex,
        setFocusedIndex,
        handleKeyDown,
        getItemProps
    };
};

export default useKeyboardNav;
