/**
 * @fileoverview LoadingPage ViewModel
 * Manages loading page state and coordinates startup data loading.
 * Includes phased intro animation and profile data from DB.
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
 * Animation phases for the intro screen
 */
export type AnimationPhase = 0 | 1 | 2 | 3;
// 0: Spinning Globe
// 1: Data Extraction (Strands pulling out)
// 2: Convergence (Forming graphic)
// 3: Ready State (UI visible, Enter button)

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
    /** Current animation phase */
    phase: AnimationPhase;
    /** Profile name from DB (null if backend unavailable) */
    profileName: string | null;
    /** Whether backend is available */
    isBackendAvailable: boolean;
    /** Manually skip intro */
    skipIntro: () => void;
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
    const [phase, setPhase] = useState<AnimationPhase>(0);
    const [profileName, setProfileName] = useState<string | null>(null);
    const [isBackendAvailable, setIsBackendAvailable] = useState(false);

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
     * Skip intro and proceed immediately
     */
    const skipIntro = useCallback(() => {
        onComplete();
    }, [onComplete]);

    /**
     * Initialize application data
     */
    const initializeApp = useCallback(async () => {
        const startTime = Date.now();
        const MINIMUM_LOADING_TIME = 5500; // Allow time for full animation sequence

        try {
            setIsLoading(true);
            setError(null);
            setStatus('Connecting to system...');
            setProgress(20);

            // Start animation phases
            setTimeout(() => setPhase(1), 1200); // Start extraction
            setTimeout(() => setPhase(2), 4000); // Start formation
            setTimeout(() => setPhase(3), 5000); // Show UI

            // Load all startup data
            const result = await startupService.initialize(handleStatusUpdate);

            // Extract profile name if backend is available
            if (result && result.profile) {
                const firstName = result.profile.firstName || '';
                const lastName = result.profile.lastName || '';
                const fullName = `${firstName} ${lastName}`.trim();
                if (fullName) {
                    setProfileName(fullName);
                    setIsBackendAvailable(true);
                }
            }

            // Complete loading
            setStatus('System Ready');
            setProgress(100);
            setIsLoading(false);

            // Calculate remaining time to meet minimum loading duration
            const elapsed = Date.now() - startTime;
            const remainingTime = Math.max(0, MINIMUM_LOADING_TIME - elapsed);

            // Wait for minimum duration, then user clicks Enter
            // (onComplete will be called by skipIntro or Enter button)
        } catch (err) {
            setError('Establishing fallback connection...');
            setIsLoading(false);
            setPhase(3); // Show UI anyway

            // Proceed with fallback data after delay
            setTimeout(() => {
                // User can still click Enter
            }, 2000);
        }
    }, [handleStatusUpdate]);

    useEffect(() => {
        initializeApp();
    }, [initializeApp]);

    return {
        isLoading,
        status,
        progress,
        error,
        phase,
        profileName,
        isBackendAvailable,
        skipIntro,
    };
};

export default useLoadingPageModel;
