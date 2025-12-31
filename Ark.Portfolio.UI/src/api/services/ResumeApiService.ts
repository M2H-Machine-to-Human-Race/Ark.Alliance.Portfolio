/**
 * @fileoverview Resume API Service
 * Public API service for fetching resume data.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { apiClient } from '../client/apiClient';
import { AdminResumeDto, SkillLevel } from '@ark/portfolio-share';

/** Resume DTO type (using AdminResumeDto for compatibility) */
export type ResumeDto = AdminResumeDto;

/**
 * Mock resume data for fallback
 */
const MOCK_RESUME: ResumeDto = {
    profile: {
        firstName: '',
        lastName: '',
        title: '',
        overview: '',
        email: '',
    },
    education: [],
    experiences: [],
    skills: [
        { name: 'React', level: SkillLevel.EXPERT, category: 'Frontend' },
        { name: 'Node.js', level: SkillLevel.ADVANCED, category: 'Backend' }
    ]
};

/**
 * Resume API Service
 * Singleton service for fetching public resume data.
 */
export class ResumeApiService {
    private static instance: ResumeApiService;

    private constructor() { }

    public static getInstance(): ResumeApiService {
        if (!ResumeApiService.instance) {
            ResumeApiService.instance = new ResumeApiService();
        }
        return ResumeApiService.instance;
    }

    /**
     * Fetches the public resume data
     * @returns Promise<ResumeDto>
     */
    public async getResume(): Promise<ResumeDto> {
        try {
            const response = await apiClient.get<ResumeDto>('/resume');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch resume:', error);
            return MOCK_RESUME;
        }
    }

    /**
     * @deprecated Use getResume() instead
     */
    public async getCV(): Promise<ResumeDto> {
        return this.getResume();
    }
}

/**
 * @deprecated Use ResumeApiService instead
 */
export const CvApiService = ResumeApiService;
