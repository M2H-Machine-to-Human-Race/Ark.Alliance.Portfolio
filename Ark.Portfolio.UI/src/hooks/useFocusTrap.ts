/**
 * @fileoverview Accessibility Hook - useFocusTrap
 * Traps focus within a container for modal dialogs.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useEffect, useRef, useCallback } from 'react';

export interface UseFocusTrapOptions {
    /** Whether focus trap is active */
    isActive: boolean;
    /** Callback when Escape key is pressed */
    onEscape?: () => void;
    /** Auto focus first element */
    autoFocus?: boolean;
    /** Element to return focus to when trap closes */
    returnFocusTo?: HTMLElement | null;
}

/**
 * Hook to trap focus within a container.
 * Used for modal dialogs to prevent focus from escaping.
 * 
 * @example
 * const modalRef = useFocusTrap({
 *   isActive: isModalOpen,
 *   onEscape: closeModal
 * });
 * return <div ref={modalRef}>...</div>
 */
export const useFocusTrap = <T extends HTMLElement = HTMLDivElement>(
    options: UseFocusTrapOptions
) => {
    const { isActive, onEscape, autoFocus = true, returnFocusTo } = options;
    const containerRef = useRef<T>(null);
    const previouslyFocused = useRef<HTMLElement | null>(null);

    const getFocusableElements = useCallback(() => {
        if (!containerRef.current) return [];

        return Array.from(
            containerRef.current.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
        ).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
    }, []);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isActive) return;

        // Handle Escape
        if (e.key === 'Escape' && onEscape) {
            e.preventDefault();
            onEscape();
            return;
        }

        // Handle Tab
        if (e.key === 'Tab') {
            const focusable = getFocusableElements();
            if (focusable.length === 0) return;

            const firstElement = focusable[0];
            const lastElement = focusable[focusable.length - 1];

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }, [isActive, onEscape, getFocusableElements]);

    useEffect(() => {
        if (isActive) {
            // Store previously focused element
            previouslyFocused.current = returnFocusTo || document.activeElement as HTMLElement;

            // Auto focus first element
            if (autoFocus) {
                const focusable = getFocusableElements();
                if (focusable.length > 0) {
                    // Small delay to ensure DOM is ready
                    requestAnimationFrame(() => {
                        focusable[0].focus();
                    });
                }
            }

            // Add event listener
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);

            // Return focus when deactivating
            if (isActive && previouslyFocused.current) {
                previouslyFocused.current.focus();
            }
        };
    }, [isActive, autoFocus, handleKeyDown, getFocusableElements, returnFocusTo]);

    return containerRef;
};

export default useFocusTrap;
