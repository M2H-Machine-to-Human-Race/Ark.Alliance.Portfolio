import { apiClient } from '../api/client';
import { CvDto, CV_MOCK } from '@ark/portfolio-share';

export class CvService {
    async getCv(): Promise<CvDto> {
        return apiClient.get<CvDto>('/cv', {}, CV_MOCK);
    }
}

export const cvService = new CvService();

