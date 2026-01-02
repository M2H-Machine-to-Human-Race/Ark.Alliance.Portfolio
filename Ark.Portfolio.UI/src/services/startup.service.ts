/**
 * @fileoverview Startup Service
 * Coordinates application initialization and data preloading.
 * 
 * @author Ark.Alliance
 */

import axios from 'axios';
import { API_CONFIG } from '../config/api.constants';

const API_URL = API_CONFIG.BASE_URL;

/**
 * Status update callback payload
 */
export interface StartupStatus {
    /** Current status message */
    message: string;
    /** Progress percentage (0-100) */
    progress: number;
    /** Error message if any */
    error?: string;
}

/**
 * Preloaded data from startup
 */
export interface StartupData {
    /** Carousel items for home page */
    carousel: any[];
    /** User profile data */
    profile: any | null;
}

/**
 * Status update callback type
 */
type StatusCallback = (status: StartupStatus) => void;

/**
 * Startup Service
 * 
 * Responsible for coordinating all startup tasks including:
 * - Preloading carousel data
 * - Preloading profile data
 * - Reporting progress to the loading page
 */
class StartupService {
    private data: StartupData = {
        carousel: [],
        profile: null,
    };

    /**
     * Initialize the application by preloading all required data.
     * 
     * @param onStatus - Callback to receive status updates
     * @returns Promise that resolves when initialization is complete
     */
    async initialize(onStatus?: StatusCallback): Promise<StartupData> {
        try {
            // Step 1: Starting initialization
            onStatus?.({
                message: 'Connecting to server...',
                progress: 20,
            });

            // Small delay for visual effect
            await this.delay(300);

            // Step 2: Load carousel data
            onStatus?.({
                message: 'Loading carousel data...',
                progress: 40,
            });

            const carouselPromise = this.loadCarousel();

            // Step 3: Load profile data
            onStatus?.({
                message: 'Loading profile data...',
                progress: 60,
            });

            const profilePromise = this.loadProfile();

            // Wait for all data to load in parallel
            const [carousel, profile] = await Promise.all([
                carouselPromise,
                profilePromise,
            ]);

            this.data = { carousel, profile };

            // Step 4: Finalizing
            onStatus?.({
                message: 'Finalizing...',
                progress: 90,
            });

            await this.delay(200);

            // Step 5: Complete
            onStatus?.({
                message: 'Ready!',
                progress: 100,
            });

            return this.data;
        } catch (error) {
            onStatus?.({
                message: 'Initialization failed',
                progress: 100,
                error: 'Failed to load application data. Using cached data.',
            });

            // Return empty/default data on error - app will use mock fallbacks
            return this.data;
        }
    }

    /**
     * Load carousel data from backend
     */
    private async loadCarousel(): Promise<any[]> {
        try {
            const response = await axios.get(`${API_URL}/carousel`, {
                timeout: 5000,
            });
            return response.data || [];
        } catch (error) {
            console.warn('Failed to load carousel data, using fallback');
            return [];
        }
    }

    /**
     * Load profile data from backend
     */
    private async loadProfile(): Promise<any | null> {
        try {
            const response = await axios.get(`${API_URL}/profile`, {
                timeout: 5000,
            });
            return response.data || null;
        } catch (error) {
            console.warn('Failed to load profile data, using fallback');
            return null;
        }
    }

    /**
     * Get preloaded data
     */
    getData(): StartupData {
        return this.data;
    }

    /**
     * Utility delay function
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export const startupService = new StartupService();
