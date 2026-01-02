/**
 * @fileoverview Resume Service
 * Service for fetching resume/CV data.
 * 
 * @author Ark.Alliance
 */

import { apiClient } from '../api/client';
import { CvDto, CV_MOCK } from '@ark/portfolio-share';

/**
 * Resume Service
 * 
 * Provides access to resume/CV data for the public portfolio.
 */
export class ResumeService {
    /**
     * Get the complete resume data.
     */
    async getResume(): Promise<CvDto> {
        return apiClient.get<CvDto>('/resume', {}, CV_MOCK);
    }

    /**
     * @deprecated Use getResume() instead
     */
    async getCv(): Promise<CvDto> {
        return this.getResume();
    }
}

export const resumeService = new ResumeService();

// Legacy export for backward compatibility
export { resumeService as cvService };
export { ResumeService as CvService };
