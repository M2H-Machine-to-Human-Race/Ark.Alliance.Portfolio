import { apiClient } from '../api/client';
import { ProfileDto, PROFILE_MOCK } from '@ark/portfolio-share';

export class ProfileService {
    async getProfile(): Promise<ProfileDto> {
        return apiClient.get<ProfileDto>('/profile', {}, PROFILE_MOCK);
    }
}

export const profileService = new ProfileService();

