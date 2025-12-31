/**
 * @fileoverview Common DTOs
 * Shared Data Transfer Objects for generic responses.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CrudResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Operation success status
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           type: object
 *           description: Response payload
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *           description: List of error messages
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Response timestamp
 */
export interface CrudResponseDto<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    errors?: string[];
    timestamp: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     PaginatedResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *           description: List of items
 *         total:
 *           type: integer
 *           description: Total number of items
 *         page:
 *           type: integer
 *           description: Current page number
 *         pageSize:
 *           type: integer
 *           description: Items per page
 *         hasNext:
 *           type: boolean
 *           description: Has next page
 *         hasPrevious:
 *           type: boolean
 *           description: Has previous page
 */
export interface PaginatedResponseDto<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
