/**
 * @fileoverview API Configuration Constants
 * Centralized API endpoint configuration for the UI layer.
 * 
 * Responsibilities:
 * - Define base URLs for all API endpoints
 * - Support environment variable overrides
 * - Configure timeouts and retry policies
 * 
 * Inputs: Environment variables (VITE_API_URL)
 * Outputs: Typed constant object for API configuration
 * Side Effects: None (pure constants)
 * Invariants: All URLs must be valid HTTP/HTTPS URLs
 * 
 * @example
 * ```typescript
 * import { API_CONFIG } from '../config/api.constants';
 * 
 * const response = await axios.get(`${API_CONFIG.BASE_URL}/projects`);
 * ```
 * 
 * @author Armand Richelet-Kleinberg
 */

/**
 * API Configuration
 * 
 * Default values point to local development environment.
 * Override via VITE_API_URL environment variable for production.
 * 
 * Backend default port: 8085 (as per backend/.env)
 * UI dev server port: 3080 (as per package.json)
 */
export const API_CONFIG = {
    /**
     * Base URL for all public API endpoints
     * Default: https://localhost:3085/api
     */
    BASE_URL: import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api`
        : 'https://localhost:3085/api',

    /**
     * Base URL for admin API endpoints (protected)
     * Default: https://localhost:3085/api/admin
     */
    ADMIN_BASE_URL: import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api/admin`
        : 'https://localhost:3085/api/admin',

    /**
     * Request timeout in milliseconds
     * Default: 30 seconds
     */
    TIMEOUT: 30000,

    /**
     * Number of retry attempts for failed requests
     * Default: 2 retries
     */
    RETRY_ATTEMPTS: 2,

    /**
     * Delay between retries in milliseconds
     * Default: 1 second
     */
    RETRY_DELAY: 1000,
} as const;

/**
 * API Configuration Type
 * Ensures type safety when using API_CONFIG
 */
export type ApiConfig = typeof API_CONFIG;

