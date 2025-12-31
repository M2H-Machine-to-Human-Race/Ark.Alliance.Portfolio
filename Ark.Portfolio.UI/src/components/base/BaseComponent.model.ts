/**
 * @fileoverview Base Component Model
 * Abstract base class for all ViewModels in the application.
 * Implements the MVVM pattern for React components.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { IBaseComponentModel } from './BaseComponent.types';

/**
 * Abstract base class for component ViewModels.
 * 
 * Provides common state management and lifecycle hooks for all ViewModels.
 * In React, these ViewModels work alongside functional components,
 * with state being synced via React hooks (useState, useMemo, useRef).
 * 
 * @example
 * ```typescript
 * class MyViewModel extends BaseComponentModel {
 *   private data: MyData | null = null;
 * 
 *   async onInit(): Promise<void> {
 *     this.isLoading = true;
 *     try {
 *       this.data = await fetchData();
 *     } catch (e) {
 *       this.error = this.handleError(e);
 *     } finally {
 *       this.isLoading = false;
 *     }
 *   }
 * }
 * ```
 */
export abstract class BaseComponentModel implements IBaseComponentModel {
    /** Indicates if the component is currently loading data */
    public isLoading: boolean = false;

    /** Error message if an error occurred, null otherwise */
    public error: string | null = null;

    /** Controls component visibility */
    public isVisible: boolean = true;

    /**
     * Lifecycle hook called when component initializes.
     * Override in subclass to perform initialization logic.
     */
    public onInit(): void { }

    /**
     * Lifecycle hook called when component is destroyed.
     * Override in subclass to perform cleanup logic.
     */
    public onDestroy(): void { }

    /**
     * Utility method to extract error message from various error types.
     * @param error - The error to process
     * @returns Human-readable error message
     */
    protected handleError(error: unknown): string {
        if (error instanceof Error) return error.message;
        return String(error);
    }

    /**
     * Toggles the visibility state of the component.
     */
    public toggleVisibility(): void {
        this.isVisible = !this.isVisible;
    }
}

