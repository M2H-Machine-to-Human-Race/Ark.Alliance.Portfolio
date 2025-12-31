/**
 * @fileoverview File Upload Middleware
 * Multer configuration for handling multipart file uploads.
 * 
 * @module middleware/upload
 * @author Armand Richelet-Kleinberg
 * @since 1.0.0
 * 
 * @description
 * This middleware handles file uploads using Multer with disk storage.
 * Files are organized into type-specific subdirectories (image, video, audio, etc.)
 * and renamed with UUIDs to prevent conflicts.
 * 
 * @example
 * // Using in a route
 * import { mediaUpload } from '../middleware/upload.middleware';
 * 
 * router.post('/upload', 
 *     authMiddleware, 
 *     mediaUpload.single('file'), 
 *     uploadHandler
 * );
 * 
 * @example
 * // Getting public URL for uploaded file
 * import { getPublicUrl, getMediaType } from '../middleware/upload.middleware';
 * 
 * const url = getPublicUrl(req.file.path);
 * const type = getMediaType(req.file.mimetype);
 */

import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

/**
 * Base directory for file uploads.
 * @constant {string}
 * @default './uploads'
 * @remarks Can be overridden via UPLOAD_DIR environment variable
 */
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

// Ensure upload directory exists on startup
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * MIME type to MediaType mapping.
 * 
 * @constant {Record<string, string>}
 * @description Maps standard MIME types to internal media type categories.
 * Used for organizing files into subdirectories and setting the MediaType field.
 * 
 * @example
 * MIME_TYPE_MAP['image/jpeg'] // returns 'image'
 * MIME_TYPE_MAP['application/pdf'] // returns 'pdf'
 */
export const MIME_TYPE_MAP: Record<string, string> = {
    // Images
    'image/jpeg': 'image',
    'image/png': 'image',
    'image/gif': 'image',
    'image/webp': 'image',
    'image/svg+xml': 'image',
    'image/x-icon': 'icon',
    // Videos
    'video/mp4': 'video',
    'video/webm': 'video',
    'video/quicktime': 'video',
    'video/x-msvideo': 'video',
    // Audio
    'audio/mpeg': 'audio',
    'audio/wav': 'audio',
    'audio/ogg': 'audio',
    'audio/mp3': 'audio',
    'audio/x-m4a': 'audio',
    // Documents
    'application/pdf': 'pdf',
    'application/msword': 'word',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word',
    'application/vnd.ms-excel': 'excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel',
    'text/markdown': 'markdown',
    'text/x-markdown': 'markdown',
    'application/json': 'json',
    'text/plain': 'other'
};

/**
 * Allowed file extensions for upload.
 * 
 * @constant {string[]}
 * @description Whitelist of permitted file extensions.
 * Files with extensions not in this list will be rejected.
 * 
 * @remarks
 * - Case-insensitive comparison is performed
 * - Add new extensions here to support additional file types
 */
const ALLOWED_EXTENSIONS: string[] = [
    // Images
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico',
    // Videos
    '.mp4', '.webm', '.mov', '.avi',
    // Audio
    '.mp3', '.wav', '.ogg', '.m4a', '.flac',
    // Documents
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.md', '.json', '.txt'
];

/**
 * Maximum allowed file size in bytes.
 * 
 * @constant {number}
 * @default 52428800 (50MB)
 * @remarks Requests exceeding this limit will be rejected with a 413 error
 */
const MAX_FILE_SIZE: number = 50 * 1024 * 1024;

/**
 * Multer disk storage configuration.
 * 
 * @description
 * - Destination: Files are organized into type-based subdirectories
 * - Filename: Original names are replaced with UUID + original extension
 * 
 * @remarks
 * Subdirectories are created automatically if they don't exist.
 */
const storage = multer.diskStorage({
    /**
     * Destination callback - determines target directory.
     * @param req - Express request object
     * @param file - Uploaded file info
     * @param cb - Callback function
     */
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        const mediaType = MIME_TYPE_MAP[file.mimetype] || 'other';
        const typeDir = path.join(UPLOAD_DIR, mediaType);

        if (!fs.existsSync(typeDir)) {
            fs.mkdirSync(typeDir, { recursive: true });
        }

        cb(null, typeDir);
    },
    /**
     * Filename callback - generates unique filename.
     * @param req - Express request object
     * @param file - Uploaded file info
     * @param cb - Callback function
     */
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueName = `${uuidv4()}${ext}`;
        cb(null, uniqueName);
    }
});

/**
 * File filter function for validating uploads.
 * 
 * @param req - Express request object
 * @param file - Uploaded file information
 * @param cb - Multer callback function
 * 
 * @description
 * Validates file extensions against ALLOWED_EXTENSIONS whitelist.
 * Rejects files with disallowed extensions.
 */
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
): void => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (ALLOWED_EXTENSIONS.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(`File type not allowed: ${ext}. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`));
    }
};

/**
 * Configured Multer instance for media uploads.
 * 
 * @constant
 * @description Pre-configured multer instance with disk storage, file filtering, and size limits.
 * 
 * @example
 * // Single file upload
 * router.post('/upload', mediaUpload.single('file'), handler);
 * 
 * @example
 * // Multiple files upload
 * router.post('/upload-multiple', mediaUpload.array('files', 10), handler);
 */
export const mediaUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE
    }
});

/**
 * Get media type from MIME type.
 * 
 * @param mimeType - The MIME type string (e.g., 'image/jpeg')
 * @returns {string} MediaType string (e.g., 'image', 'pdf', 'video')
 * 
 * @example
 * getMediaType('image/png'); // returns 'image'
 * getMediaType('application/pdf'); // returns 'pdf'
 * getMediaType('unknown/type'); // returns 'other'
 */
export function getMediaType(mimeType: string): string {
    return MIME_TYPE_MAP[mimeType] || 'other';
}

/**
 * Generate public URL for an uploaded file.
 * 
 * @param filePath - Absolute or relative file path from multer
 * @returns {string} Public-facing URL for the file
 * 
 * @description
 * Converts the local file path to a URL accessible via the static file server.
 * Uses API_BASE_URL environment variable for the domain.
 * 
 * @example
 * getPublicUrl('./uploads/image/abc123.jpg');
 * // returns 'http://localhost:5085/uploads/image/abc123.jpg'
 * 
 * @remarks
 * Ensure API_BASE_URL is set correctly in production environments.
 */
export function getPublicUrl(filePath: string): string {
    const relativePath = filePath.replace(UPLOAD_DIR, '').replace(/\\/g, '/');
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:5085';
    return `${baseUrl}/uploads${relativePath}`;
}

