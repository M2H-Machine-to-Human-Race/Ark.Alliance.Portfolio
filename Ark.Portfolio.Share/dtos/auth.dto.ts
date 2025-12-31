/**
 * @fileoverview Auth DTOs
 * Data Transfer Objects for Authentication.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: User's username
 *           example: admin
 *         password:
 *           type: string
 *           description: User's password
 *           example: Admin1234
 */
export interface LoginRequestDto {
    username: string;
    password: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - oldPassword
 *         - newPassword
 *       properties:
 *         oldPassword:
 *           type: string
 *           description: Current password
 *         newPassword:
 *           type: string
 *           description: New password (min 6 chars)
 */
export interface ChangePasswordRequestDto {
    oldPassword: string;
    newPassword: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT access token
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             username:
 *               type: string
 *             role:
 *               type: string
 */
export interface LoginResponseDto {
    token: string;
    user: {
        id: string;
        username: string;
        role: string;
    };
}
