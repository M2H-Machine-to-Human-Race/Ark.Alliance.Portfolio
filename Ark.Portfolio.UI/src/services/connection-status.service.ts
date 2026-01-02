/**
 * @fileoverview Backend Connection Status Service
 * Monitors backend connectivity with auto-detection of HTTP/HTTPS protocol.
 * 
 * @author Armand Richelet-Kleinberg
 */

export type ConnectionStatus = 'connected' | 'disconnected' | 'checking' | 'mock';

export interface ConnectionInfo {
    status: ConnectionStatus;
    protocol: 'http' | 'https' | 'unknown';
    latency: number | null;
    lastChecked: Date | null;
    backendVersion?: string;
    usingMocks: boolean;
}

/**
 * ConnectionStatusService
 * Monitors and reports backend connection status.
 */
class ConnectionStatusService {
    private status: ConnectionStatus = 'checking';
    private protocol: 'http' | 'https' | 'unknown' = 'unknown';
    private latency: number | null = null;
    private lastChecked: Date | null = null;
    private backendVersion: string | undefined;
    private usingMocks = false;
    private listeners: Set<(info: ConnectionInfo) => void> = new Set();
    private checkInterval: ReturnType<typeof setInterval> | null = null;

    /**
     * Get the base URL for API calls with protocol auto-detection
     * Defaults to HTTP, falls back to detected protocol
     */
    getBaseUrl(): string {
        const envUrl = import.meta.env.VITE_API_BASE_URL;
        if (envUrl) return envUrl;

        // Default to HTTP protocol (can be proxied if using HTTPS frontend)
        return '/api';
    }

    /**
     * Check connection to backend
     */
    async checkConnection(): Promise<ConnectionInfo> {
        const startTime = Date.now();
        this.status = 'checking';
        this.notifyListeners();

        try {
            // Try HTTP first (default)
            const response = await fetch('/api/health', {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                signal: AbortSignal.timeout(5000), // 5 second timeout
            });

            if (response.ok) {
                this.status = 'connected';
                this.protocol = 'http';
                this.latency = Date.now() - startTime;
                this.lastChecked = new Date();
                this.usingMocks = false;

                try {
                    const data = await response.json();
                    this.backendVersion = data.version;
                } catch {
                    // Health endpoint might not return JSON
                }
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            // Check if we're using mocks
            const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';
            const allowFallback = import.meta.env.DEV || import.meta.env.VITE_ALLOW_MOCK_FALLBACK === 'true';

            if (useMocks || allowFallback) {
                this.status = 'mock';
                this.usingMocks = true;
                this.protocol = 'unknown';
                this.latency = null;
            } else {
                this.status = 'disconnected';
                this.usingMocks = false;
            }
            this.lastChecked = new Date();
        }

        this.notifyListeners();
        return this.getInfo();
    }

    /**
     * Get current connection info
     */
    getInfo(): ConnectionInfo {
        return {
            status: this.status,
            protocol: this.protocol,
            latency: this.latency,
            lastChecked: this.lastChecked,
            backendVersion: this.backendVersion,
            usingMocks: this.usingMocks,
        };
    }

    /**
     * Subscribe to connection status changes
     */
    subscribe(listener: (info: ConnectionInfo) => void): () => void {
        this.listeners.add(listener);
        // Immediately notify with current status
        listener(this.getInfo());

        return () => {
            this.listeners.delete(listener);
        };
    }

    /**
     * Start automatic connection monitoring
     */
    startMonitoring(intervalMs: number = 30000): void {
        // Initial check
        this.checkConnection();

        // Stop any existing interval
        this.stopMonitoring();

        // Start new interval
        this.checkInterval = setInterval(() => {
            this.checkConnection();
        }, intervalMs);
    }

    /**
     * Stop automatic connection monitoring
     */
    stopMonitoring(): void {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    private notifyListeners(): void {
        const info = this.getInfo();
        this.listeners.forEach(listener => listener(info));
    }
}

// Singleton instance
export const connectionStatusService = new ConnectionStatusService();
