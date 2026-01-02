/**
 * @fileoverview Connection Indicator Component
 * Displays backend connection status in the header.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import { Wifi, WifiOff, Loader2, Database } from 'lucide-react';
import { useConnectionStatus, getStatusLabel } from '../../hooks/useConnectionStatus';
import './ConnectionIndicator.styles.css';

export interface ConnectionIndicatorProps {
    /** Show detailed info on hover */
    showDetails?: boolean;
    /** Additional CSS class */
    className?: string;
}

/**
 * ConnectionIndicator Component
 * Shows a visual indicator of backend connectivity.
 */
export const ConnectionIndicator: React.FC<ConnectionIndicatorProps> = ({
    showDetails = true,
    className = '',
}) => {
    const connectionInfo = useConnectionStatus(true, 30000);

    const getIcon = () => {
        switch (connectionInfo.status) {
            case 'connected':
                return <Wifi size={14} />;
            case 'disconnected':
                return <WifiOff size={14} />;
            case 'checking':
                return <Loader2 size={14} className="connection-spinner" />;
            case 'mock':
                return <Database size={14} />;
            default:
                return <WifiOff size={14} />;
        }
    };

    const getTooltipContent = () => {
        const lines = [getStatusLabel(connectionInfo.status)];

        if (connectionInfo.status === 'connected') {
            if (connectionInfo.latency !== null) {
                lines.push(`Latency: ${connectionInfo.latency}ms`);
            }
            if (connectionInfo.protocol !== 'unknown') {
                lines.push(`Protocol: ${connectionInfo.protocol.toUpperCase()}`);
            }
        }

        if (connectionInfo.status === 'mock') {
            lines.push('Using mock data');
        }

        if (connectionInfo.lastChecked) {
            lines.push(`Last check: ${connectionInfo.lastChecked.toLocaleTimeString()}`);
        }

        return lines.join('\n');
    };

    return (
        <div
            className={`connection-indicator connection-${connectionInfo.status} ${className}`}
            title={showDetails ? getTooltipContent() : getStatusLabel(connectionInfo.status)}
            role="status"
            aria-label={`Backend ${getStatusLabel(connectionInfo.status)}`}
        >
            <span className="connection-icon">
                {getIcon()}
            </span>
            <span className="connection-dot" />
        </div>
    );
};

export default ConnectionIndicator;
