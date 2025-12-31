import { apiClient } from '../client/apiClient';
import { ProfileDto } from '../../../../Ark.Portfolio.Share';

// Mock Profile for fallback
const MOCK_PROFILE: ProfileDto = {
    firstName: 'Armand',
    lastName: 'Richelet Kleinberg',
    title: 'Full Stack Engineer',
    overview: 'Specialized in high-frequency trading platforms and scalable architectures.',
    email: 'contact@ark.com',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com/ark'
};

export class ProfileApiService {
    private static instance: ProfileApiService;

    private constructor() { }

    public static getInstance(): ProfileApiService {
        if (!ProfileApiService.instance) {
            ProfileApiService.instance = new ProfileApiService();
        }
        return ProfileApiService.instance;
    }

    public async getProfile(): Promise<ProfileDto> {
        try {
            const response = await apiClient.get<ProfileDto>('/profile');
            return response.data;
        } catch (error) {
            return MOCK_PROFILE;
        }
    }
}

