/**
 * @fileoverview Resume Service
 * Service for fetching resume/CV data.
 * 
 * @author Ark.Alliance
 */

import { apiClient } from '../api/client';
import { ResumeDto, RESUME_MOCK } from '@ark/portfolio-share';

/**
 * Resume Service
 * 
 * Provides access to resume/CV data for the public portfolio.
 */
export class ResumeService {
    /**
     * Get the complete resume data.
     */
    async getResume(): Promise<ResumeDto> {
        return apiClient.get<ResumeDto>('/resume', {}, RESUME_MOCK);
    }

    /**
     * @deprecated Use getResume() instead
     */
    async getCv(): Promise<ResumeDto> {
        return this.getResume();
    }
}

export const resumeService = new ResumeService();

// Legacy export for backward compatibility
export { resumeService as cvService };
export { ResumeService as CvService };
