/**
 * @fileoverview User Repository
 * Data access layer for user entities.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { GenericRepository } from './generic.repository';
import { User } from '../entities/user.entity';

export class UserRepository extends GenericRepository<User> {
    constructor() {
        super(User);
    }

    /**
     * Find user by username.
     */
    async findByUsername(username: string): Promise<User | null> {
        return this.repository.findOne({ where: { username } });
    }

    /**
     * Check if username exists.
     */
    async usernameExists(username: string): Promise<boolean> {
        const count = await this.repository.count({ where: { username } });
        return count > 0;
    }
}

