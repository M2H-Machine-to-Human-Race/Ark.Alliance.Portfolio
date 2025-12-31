import { AppDataSource } from '../config/database';
import { User } from '../database/entities/user.entity';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
    private userRepository = AppDataSource.getRepository(User);
    private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    private readonly TOKEN_EXPIRY = '24h';

    async login(username: string, password: string): Promise<{ token: string; user: User } | null> {
        const user = await this.userRepository.findOne({ where: { username } });

        if (!user) {
            return null;
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return null;
        }

        // Update last login
        user.lastLogin = new Date();
        await this.userRepository.save(user);

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            this.JWT_SECRET,
            { expiresIn: this.TOKEN_EXPIRY }
        );

        return { token, user };
    }

    async register(username: string, password: string): Promise<User> {
        const existingUser = await this.userRepository.findOne({ where: { username } });
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({
            username,
            passwordHash,
            role: 'admin'
        });

        return await this.userRepository.save(user);
    }

    async validateToken(token: string): Promise<any> {
        try {
            return jwt.verify(token, this.JWT_SECRET);
        } catch (error) {
            return null;
        }
    }

    async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }

        const isValidPassword = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isValidPassword) {
            return false;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        user.passwordHash = passwordHash;
        await this.userRepository.save(user);

        return true;
    }

    async seedAdminUser(): Promise<void> {
        const adminUser = await this.userRepository.findOne({ where: { username: 'admin' } });

        if (!adminUser) {
            console.log('Seeding initial admin user...');
            await this.register('admin', 'Admin1234');
            console.log('Admin user seeded.');
        } else {
            console.log('Admin user exists. Updating password to default...');
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash('Admin1234', salt);
            adminUser.passwordHash = passwordHash;
            await this.userRepository.save(adminUser);
            console.log('Admin password updated to default.');
        }
    }
}

