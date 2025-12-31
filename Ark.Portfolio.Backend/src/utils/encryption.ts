/**
 * @fileoverview Encryption Utility
 * AES-256-GCM encryption/decryption for sensitive data storage.
 * 
 * @module utils/encryption
 * @author Armand Richelet-Kleinberg
 * @since 1.0.0
 * 
 * @description
 * Provides secure encryption and decryption functions using industry-standard
 * AES-256-GCM algorithm with PBKDF2 key derivation. Designed for storing
 * sensitive data like API keys in the database.
 * 
 * @security
 * - Uses AES-256-GCM authenticated encryption
 * - PBKDF2 with 100,000 iterations for key derivation
 * - Random salt and IV for each encryption operation
 * - Authentication tag prevents tampering
 * 
 * @example
 * // Encrypt an API key before storage
 * import { encrypt, decrypt, maskApiKey } from './encryption';
 * 
 * const encrypted = encrypt('sk-abc123...');
 * // Store encrypted in database
 * 
 * // Decrypt when needed
 * const apiKey = decrypt(encrypted);
 * 
 * // Mask for display
 * const masked = maskApiKey(apiKey); // 'sk-a...3xyz'
 * 
 * @requires ENCRYPTION_KEY environment variable for production use
 */

import * as crypto from 'crypto';

/**
 * Encryption algorithm identifier.
 * @constant {string}
 * @private
 */
const ALGORITHM = 'aes-256-gcm';

/**
 * Initialization vector length in bytes.
 * @constant {number}
 * @private
 */
const IV_LENGTH = 16;

/**
 * Authentication tag length in bytes.
 * @constant {number}
 * @private
 */
const TAG_LENGTH = 16;

/**
 * Salt length in bytes for key derivation.
 * @constant {number}
 * @private
 */
const SALT_LENGTH = 64;

/**
 * Derived key length in bytes.
 * @constant {number}
 * @private
 */
const KEY_LENGTH = 32;

/**
 * PBKDF2 iteration count for key derivation.
 * @constant {number}
 * @private
 * @remarks Higher values increase security but slow down encryption/decryption
 */
const ITERATIONS = 100000;

/**
 * Get the encryption key from environment.
 * 
 * @returns {string} The encryption key
 * @private
 * 
 * @description
 * Retrieves the ENCRYPTION_KEY from environment variables.
 * Falls back to a default key if not set (NOT SECURE FOR PRODUCTION).
 * 
 * @security
 * - MUST set ENCRYPTION_KEY in production environment
 * - Key should be at least 32 characters
 * - Use a cryptographically secure random string
 * - Store securely (secrets manager recommended)
 */
function getEncryptionKey(): string {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
        console.warn('⚠️ ENCRYPTION_KEY not set, using default (NOT SECURE FOR PRODUCTION)');
        return 'ark-portfolio-default-encryption-key-change-me';
    }
    return key;
}

/**
 * Derive a cryptographic key from password and salt.
 * 
 * @param password - The master password/key
 * @param salt - Random salt buffer
 * @returns {Buffer} Derived key buffer
 * @private
 * 
 * @description
 * Uses PBKDF2 with SHA-512 for secure key derivation.
 * The high iteration count makes brute-force attacks impractical.
 */
function deriveKey(password: string, salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha512');
}

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * 
 * @param plaintext - The string to encrypt
 * @returns {string} Base64-encoded encrypted string (salt + iv + tag + ciphertext)
 * 
 * @description
 * Encrypts the input using AES-256-GCM authenticated encryption.
 * The result includes all components needed for decryption.
 * 
 * @example
 * const encrypted = encrypt('my-secret-api-key');
 * // Returns: 'base64-encoded-string'
 * 
 * @remarks
 * - Returns empty string for empty/null input
 * - Each call produces different output due to random salt/IV
 * - Output format: base64(salt || iv || tag || ciphertext)
 */
export function encrypt(plaintext: string): string {
    if (!plaintext) return '';

    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = deriveKey(getEncryptionKey(), salt);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([
        cipher.update(plaintext, 'utf8'),
        cipher.final()
    ]);

    const tag = cipher.getAuthTag();

    // Combine: salt + iv + tag + ciphertext
    const combined = Buffer.concat([salt, iv, tag, encrypted]);
    return combined.toString('base64');
}

/**
 * Decrypt an encrypted string using AES-256-GCM.
 * 
 * @param encryptedBase64 - Base64-encoded encrypted string
 * @returns {string} Decrypted plaintext string
 * 
 * @description
 * Decrypts data that was encrypted with the encrypt() function.
 * Verifies the authentication tag to ensure data integrity.
 * 
 * @example
 * const encrypted = encrypt('secret');
 * const decrypted = decrypt(encrypted);
 * console.log(decrypted); // 'secret'
 * 
 * @remarks
 * - Returns empty string for empty/null input
 * - Returns empty string if decryption fails (logs error)
 * - Requires same ENCRYPTION_KEY used during encryption
 */
export function decrypt(encryptedBase64: string): string {
    if (!encryptedBase64) return '';

    try {
        const combined = Buffer.from(encryptedBase64, 'base64');

        // Extract components
        const salt = combined.subarray(0, SALT_LENGTH);
        const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
        const tag = combined.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
        const ciphertext = combined.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

        const key = deriveKey(getEncryptionKey(), salt);

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(tag);

        const decrypted = Buffer.concat([
            decipher.update(ciphertext),
            decipher.final()
        ]);

        return decrypted.toString('utf8');
    } catch (error) {
        console.error('🔐 Decryption failed:', error);
        return '';
    }
}

/**
 * Mask an API key for safe display.
 * 
 * @param key - The API key to mask
 * @returns {string} Masked key showing first 4 and last 4 characters
 * 
 * @description
 * Creates a masked version of an API key suitable for display
 * in logs, UI, or error messages without exposing the full key.
 * 
 * @example
 * maskApiKey('sk-abc123456789xyz');
 * // Returns: 'sk-a...9xyz'
 * 
 * @example
 * maskApiKey('short');
 * // Returns: '****'
 * 
 * @remarks
 * - Keys shorter than 10 characters return '****'
 * - Shows 4 characters at start and end
 * - Use for logging and UI display only
 */
export function maskApiKey(key: string): string {
    if (!key || key.length < 10) return '****';
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
}

