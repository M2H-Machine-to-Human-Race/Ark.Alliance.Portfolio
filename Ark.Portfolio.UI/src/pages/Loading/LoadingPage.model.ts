/**
 * @fileoverview LoadingPage ViewModel
 * Manages loading page state and coordinates startup data loading.
 * 
 * @author Ark.Alliance
 */

import { useState, useEffect, useCallback } from 'react';
import { startupService, StartupStatus } from '../../services/startup.service';

/**
 * LoadingPage props interface
 */
export interface LoadingPageProps {
    /** Callback when loading completes and app is ready */
    onComplete: () => void;
}

/**
 * LoadingPage ViewModel state
 */
export interface LoadingPageModel {
    /** Whether data is still loading */
    isLoading: boolean;
    /** Current status message */
    status: string;
    /** Loading progress (0-100) */
    progress: number;
    /** Error message if any */
    error: string | null;
}

/**
 * LoadingPage ViewModel hook
 * 
 * Coordinates startup data loading and exposes state to the view.
 */
export const useLoadingPageModel = ({ onComplete }: LoadingPageProps): LoadingPageModel => {
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState('Initializing...');
    const [progress, setProgress] = useState(10);
    const [error, setError] = useState<string | null>(null);

    /**
     * Handle status updates from startup service
     */
    const handleStatusUpdate = useCallback((update: StartupStatus) => {
        setStatus(update.message);
        setProgress(update.progress);

        if (update.error) {
            setError(update.error);
        }
    }, []);

    /**
     * Initialize application data
     */
    const initializeApp = useCallback(async () => {
        const startTime = Date.now();
        const MINIMUM_LOADING_TIME = 1500; // Minimum 1.5 seconds for polished UX

        try {
            setIsLoading(true);
            setError(null);
            setStatus('Loading application data...');
            setProgress(20);

            // Load all startup data
            await startupService.initialize(handleStatusUpdate);

            // Complete loading
            setStatus('Ready!');
            setProgress(100);
            setIsLoading(false);

            // Calculate remaining time to meet minimum loading duration
            const elapsed = Date.now() - startTime;
            const remainingTime = Math.max(0, MINIMUM_LOADING_TIME - elapsed);

            // Wait for minimum duration, then transition
            setTimeout(() => {
                onComplete();
            }, remainingTime + 300); // +300ms for smooth "Ready" display
        } catch (err) {
            setError('Failed to initialize application. Retrying...');
            setIsLoading(false);

            // Retry after delay, or just proceed with fallback data
            setTimeout(() => {
                onComplete();
            }, 2000);
        }
    }, [onComplete, handleStatusUpdate]);

    useEffect(() => {
        initializeApp();
    }, [initializeApp]);

    return {
        isLoading,
        status,
        progress,
        error,
    };
};

export default useLoadingPageModel;
