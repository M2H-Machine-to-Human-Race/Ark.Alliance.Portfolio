/**
 * @fileoverview Base Controller
 * Provides common HTTP response helper methods for all API controllers.
 * Implements a consistent response format across the application.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { Response } from 'express';

/**
 * Abstract base controller with standardized HTTP response methods.
 * All API controllers should extend this class to ensure consistent
 * error handling and response formatting.
 * 
 * @example
 * ```typescript
 * class MyController extends BaseController {
 *   async getResource(req: Request, res: Response) {
 *     const data = await service.getData();
 *     return data ? this.ok(res, data) : this.notFound(res);
 *   }
 * }
 * ```
 */
export abstract class BaseController {
    /**
     * Sends a 200 OK response with optional data payload.
     * @param res - Express response object
     * @param dto - Optional data to include in response body
     */
    protected ok<T>(res: Response, dto?: T) {
        if (!!dto) {
            return res.status(200).json(dto);
        } else {
            return res.sendStatus(200);
        }
    }

    /**
     * Sends a 201 Created response.
     * @param res - Express response object
     */
    protected created(res: Response) {
        return res.sendStatus(201);
    }

    /**
     * Sends a 400 Bad Request response.
     * @param res - Express response object
     * @param message - Optional error message (defaults to 'Bad Request')
     */
    protected clientError(res: Response, message?: string) {
        return res.status(400).json({ message: message ? message : 'Bad Request' });
    }

    /**
     * Sends a 401 Unauthorized response.
     * @param res - Express response object
     * @param message - Optional error message (defaults to 'Unauthorized')
     */
    protected unauthorized(res: Response, message?: string) {
        return res.status(401).json({ message: message ? message : 'Unauthorized' });
    }

    /**
     * Sends a 403 Forbidden response.
     * @param res - Express response object
     * @param message - Optional error message (defaults to 'Forbidden')
     */
    protected forbidden(res: Response, message?: string) {
        return res.status(403).json({ message: message ? message : 'Forbidden' });
    }

    /**
     * Sends a 404 Not Found response.
     * @param res - Express response object
     * @param message - Optional error message (defaults to 'Not Found')
     */
    protected notFound(res: Response, message?: string) {
        return res.status(404).json({ message: message ? message : 'Not Found' });
    }

    /**
     * Sends a 500 Internal Server Error response.
     * Logs the error to console for debugging.
     * @param res - Express response object
     * @param error - Error object or message string
     */
    protected fail(res: Response, error: Error | string) {
        console.error(error);
        return res.status(500).json({
            message: error.toString()
        });
    }
}

