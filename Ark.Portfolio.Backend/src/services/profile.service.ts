/**
 * @fileoverview Profile Service
 * Handles retrieval of portfolio owner's profile information.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { ProfileRepository } from '../database/repositories/profile.repository';
import { ProfileDto } from '@ark/portfolio-share';

/**
 * Service class for profile-related operations.
 * Manages portfolio owner's personal and contact information.
 */
export class ProfileService {
    /**
     * Retrieves the portfolio owner's profile.
     * Assumes a single profile with ID 1 exists in the database.
     * 
     * @returns Promise resolving to profile DTO or null if not found
     */
    async getProfile(): Promise<ProfileDto | null> {
        const profile = await ProfileRepository.findOne({ where: { id: 1 } });
        if (!profile) return null;

        return {
            firstName: profile.firstName,
            lastName: profile.lastName,
            title: profile.title,
            overview: profile.overview,
            email: profile.email,
            linkedinUrl: profile.linkedinUrl,
            githubUrl: profile.githubUrl,
            avatarUrl: profile.avatarUrl
        };
    }
}

