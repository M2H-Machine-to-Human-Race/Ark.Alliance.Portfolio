/**
 * @fileoverview Global Error Handling Middleware
 * Provides centralized error handling for all API routes.
 * Ensures errors are logged without crashing the service.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

/**
 * Error response structure.
 */
interface ErrorResponse {
    success: false;
    message: string;
    error?: string;
    stack?: string;
}

/**
 * Logs error details to console with timestamp.
 * @param error - Error object to log
 * @param req - Express request object for context
 */
function logError(error: Error, req: Request): void {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR in ${req.method} ${req.path}:`);
    console.error(`  Message: ${error.message}`);
    console.error(`  Stack: ${error.stack}`);
}

/**
 * Global error handling middleware.
 * Catches all unhandled errors from route handlers and prevents service crashes.
 * Must be registered AFTER all routes.
 */
export const globalErrorHandler: ErrorRequestHandler = (
    error: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // Log the error
    logError(error, req);

    // Determine if we're in development mode
    const isDev = process.env.NODE_ENV !== 'production';

    // Build error response
    const errorResponse: ErrorResponse = {
        success: false,
        message: 'Internal Server Error',
        error: error.message
    };

    // Include stack trace in development
    if (isDev) {
        errorResponse.stack = error.stack;
    }

    // Send error response (don't crash)
    res.status(500).json(errorResponse);
};

/**
 * Middleware to wrap async route handlers and catch errors.
 * Use this to wrap controller methods that are async.
 * 
 * @example
 * router.get('/profile', asyncHandler(controller.getProfile.bind(controller)));
 */
export function asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

/**
 * 404 Not Found handler for undefined routes.
 */
export function notFoundHandler(req: Request, res: Response): void {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`
    });
}

