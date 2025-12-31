/**
 * @fileoverview Port Killer Utility
 * Ensures a port is free before server startup.
 * Includes proper delays and retry logic to handle race conditions.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Delay helper function.
 * @param ms - Milliseconds to wait
 */
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Check if port is currently in use.
 * @param port - Port number to check
 * @returns True if port is in use
 */
async function isPortInUse(port: number): Promise<boolean> {
    try {
        if (process.platform === 'win32') {
            const { stdout } = await execAsync(`netstat -ano | findstr LISTENING | findstr :${port}`);
            // Check if any line actually contains our exact port in LISTENING state
            const lines = stdout.split('\n').filter(line => {
                const match = line.match(/:(\d+)\s+/);
                return match && parseInt(match[1]) === port;
            });
            return lines.length > 0;
        } else {
            const { stdout } = await execAsync(`lsof -t -i:${port}`);
            return stdout.trim().length > 0;
        }
    } catch {
        return false; // Error means port not in use
    }
}

/**
 * Kills all processes using a specific port on Windows.
 * @param port - Port number to free
 */
async function killProcessesOnPort(port: number): Promise<void> {
    try {
        if (process.platform === 'win32') {
            // Find PIDs listening on the exact port
            const { stdout } = await execAsync(`netstat -ano | findstr LISTENING | findstr :${port}`);
            if (!stdout) return;

            const pids = new Set<number>();
            const lines = stdout.split('\n').filter(line => line.trim());

            for (const line of lines) {
                // Match exact port (e.g., :8085 not :80850)
                const portMatch = line.match(/:(\d+)\s+/);
                if (portMatch && parseInt(portMatch[1]) === port) {
                    const parts = line.trim().split(/\s+/);
                    const pid = parseInt(parts[parts.length - 1]);
                    if (pid > 0 && pid !== process.pid) {
                        pids.add(pid);
                    }
                }
            }

            // Kill each unique PID
            for (const pid of pids) {
                console.log(`Killing process ${pid} on port ${port}...`);
                try {
                    await execAsync(`taskkill /F /PID ${pid}`);
                } catch {
                    // Process might already be dead
                }
            }
        } else {
            // Linux/Mac
            try {
                const { stdout } = await execAsync(`lsof -t -i:${port}`);
                if (stdout) {
                    const pids = stdout.split('\n').filter(p => p.trim());
                    for (const pid of pids) {
                        if (parseInt(pid) !== process.pid) {
                            await execAsync(`kill -9 ${pid}`);
                        }
                    }
                }
            } catch {
                // Ignore errors
            }
        }
    } catch {
        // Ignore errors
    }
}

/**
 * Ensures a port is free by killing any processes using it.
 * Includes retry logic and delays to handle race conditions.
 * 
 * @param port - Port number to free
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param delayMs - Delay between retries in milliseconds (default: 500)
 */
export const killPort = async (
    port: number,
    maxRetries: number = 3,
    delayMs: number = 500
): Promise<void> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        // Check if port is in use
        const inUse = await isPortInUse(port);

        if (!inUse) {
            return; // Port is free
        }

        console.log(`Port ${port} is in use. Attempt ${attempt}/${maxRetries} to free it...`);

        // Kill processes
        await killProcessesOnPort(port);

        // Wait for processes to fully terminate
        await delay(delayMs);
    }

    // Final check
    const stillInUse = await isPortInUse(port);
    if (stillInUse) {
        console.warn(`Warning: Port ${port} may still be in use after ${maxRetries} attempts.`);
    }
};


