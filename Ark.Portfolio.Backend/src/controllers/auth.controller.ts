import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { AuthService } from '../services/auth.service';

export class AuthController extends BaseController {
    private authService: AuthService;

    constructor() {
        super();
        this.authService = new AuthService();
    }

    async login(req: Request, res: Response) {
        const { username, password } = req.body;

        if (!username || !password) {
            return this.clientError(res, 'Username and password are required');
        }

        const result = await this.authService.login(username, password);

        if (!result) {
            return this.unauthorized(res, 'Invalid credentials');
        }

        return this.ok(res, result);
    }

    async getMe(req: Request, res: Response) {
        // The user is attached to the request by the auth middleware
        const user = (req as any).user;
        if (!user) {
            return this.unauthorized(res, 'Not authenticated');
        }
        return this.ok(res, {
            id: user.id,
            username: user.username,
            role: user.role
        });
    }

    async changePassword(req: Request, res: Response) {
        const user = (req as any).user;
        if (!user) {
            return this.unauthorized(res, 'Not authenticated');
        }

        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return this.clientError(res, 'Old password and new password are required');
        }

        try {
            const success = await this.authService.changePassword(user.id, oldPassword, newPassword);
            if (!success) {
                return this.clientError(res, 'Invalid old password');
            }
            return this.ok(res, { message: 'Password changed successfully' });
        } catch (error: any) {
            return this.fail(res, error.message);
        }
    }
}

