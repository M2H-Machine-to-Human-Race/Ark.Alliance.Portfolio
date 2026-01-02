/**
 * @fileoverview useConnectionStatus Hook
 * React hook for subscribing to backend connection status.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useState, useEffect } from 'react';
import { connectionStatusService, ConnectionInfo, ConnectionStatus } from '../services/connection-status.service';

/**
 * Hook to monitor backend connection status
 * @param autoStart Whether to auto-start monitoring on mount
 * @param intervalMs Interval between connection checks (default: 30000ms)
 */
export const useConnectionStatus = (
    autoStart: boolean = true,
    intervalMs: number = 30000
): ConnectionInfo => {
    const [info, setInfo] = useState<ConnectionInfo>(connectionStatusService.getInfo());

    useEffect(() => {
        // Subscribe to status changes
        const unsubscribe = connectionStatusService.subscribe(setInfo);

        // Start monitoring if requested
        if (autoStart) {
            connectionStatusService.startMonitoring(intervalMs);
        }

        return () => {
            unsubscribe();
            // Note: We don't stop monitoring on unmount as other components may still need it
        };
    }, [autoStart, intervalMs]);

    return info;
};

/**
 * Get a simple status label for display
 */
export const getStatusLabel = (status: ConnectionStatus): string => {
    switch (status) {
        case 'connected':
            return 'Connected';
        case 'disconnected':
            return 'Disconnected';
        case 'checking':
            return 'Checking...';
        case 'mock':
            return 'Mock Mode';
        default:
            return 'Unknown';
    }
};

/**
 * Get status color for styling
 */
export const getStatusColor = (status: ConnectionStatus): string => {
    switch (status) {
        case 'connected':
            return 'var(--color-success, #22c55e)';
        case 'disconnected':
            return 'var(--color-error, #ef4444)';
        case 'checking':
            return 'var(--color-warning, #f59e0b)';
        case 'mock':
            return 'var(--color-info, #0ea5e9)';
        default:
            return 'var(--text-muted, #64748b)';
    }
};

export default useConnectionStatus;
