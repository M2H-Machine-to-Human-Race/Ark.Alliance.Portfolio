/**
 * @fileoverview Profile Mock Data
 * Mock data for profile matching backend seed data.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { ProfileDto } from '../dtos/profile.dto';
import { SEED_PROFILE } from './seed-data';

/**
 * Profile mock using centralized seed data.
 * Matches: InitDbAsset/JsonDatas/profile.json
 */
export const PROFILE_MOCK: ProfileDto = {
    firstName: SEED_PROFILE.firstName,
    lastName: SEED_PROFILE.lastName,
    title: SEED_PROFILE.title,
    overview: SEED_PROFILE.overview,
    email: SEED_PROFILE.email,
    githubUrl: SEED_PROFILE.githubUrl,
    linkedinUrl: SEED_PROFILE.linkedinUrl,
    avatarUrl: SEED_PROFILE.avatarUrl
};
