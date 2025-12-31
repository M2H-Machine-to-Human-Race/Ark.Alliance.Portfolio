/**
 * @fileoverview Base Component Types
 * Defines the interface contract for all ViewModel classes.
 * Part of the MVVM pattern implementation.
 * 
 * @author Armand Richelet-Kleinberg
 */

/**
 * Interface for base component model (ViewModel).
 * All ViewModel classes should implement this interface to ensure
 * consistent lifecycle management and state handling.
 */
export interface IBaseComponentModel {
    /** Indicates if the component is currently loading data */
    isLoading: boolean;
    /** Error message if an error occurred, null otherwise */
    error: string | null;
    /** Controls component visibility */
    isVisible: boolean;

    /**
     * Lifecycle hook called when component initializes.
     * Use for data fetching, subscription setup, etc.
     */
    onInit(): void;

    /**
     * Lifecycle hook called when component is destroyed.
     * Use for cleanup, unsubscription, etc.
     */
    onDestroy(): void;

    /**
     * Toggles the visibility state of the component.
     */
    toggleVisibility(): void;
}

