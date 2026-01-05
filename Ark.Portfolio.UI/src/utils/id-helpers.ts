/**
 * @fileoverview ID Generation Utility
 * Provides functions for generating unique identifiers.
 * 
 * @module utils/id-helpers
 * @author Armand Richelet-Kleinberg
 * @license MIT
 */

/**
 * Generates a unique identifier string.
 * 
 * @remarks
 * Combines timestamp with a random string for uniqueness.
 * Suitable for client-side ID generation (e.g., message IDs, temporary keys).
 * Not suitable for cryptographic purposes.
 * 
 * @param prefix - Optional prefix for the generated ID
 * @returns A unique identifier string in format `{prefix}-{timestamp}-{random}`
 * 
 * @example
 * ```typescript
 * // Without prefix
 * generateUniqueId(); // "1704369600000-x7k9m2b4f"
 * 
 * // With prefix
 * generateUniqueId("msg"); // "msg-1704369600000-x7k9m2b4f"
 * ```
 */
export function generateUniqueId(prefix?: string): string {
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 11);

    return prefix
        ? `${prefix}-${timestamp}-${randomPart}`
        : `${timestamp}-${randomPart}`;
}

/**
 * Generates a short random string.
 * 
 * @remarks
 * Uses base36 encoding for alphanumeric output.
 * Useful for temporary identifiers where uniqueness is not critical.
 * 
 * @param length - Desired length of the random string (default: 8)
 * @returns A random alphanumeric string
 * 
 * @example
 * ```typescript
 * generateRandomString(); // "x7k9m2b4"
 * generateRandomString(4); // "x7k9"
 * ```
 */
export function generateRandomString(length: number = 8): string {
    return Math.random().toString(36).substring(2, 2 + length);
}
