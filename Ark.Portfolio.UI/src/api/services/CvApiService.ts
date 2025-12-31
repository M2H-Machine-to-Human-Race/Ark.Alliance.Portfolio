import { apiClient } from '../client/apiClient';
import { CvDto, SkillLevel, Technology } from '../../../../Ark.Portfolio.Share';

// Mock CV for fallback
const MOCK_CV: CvDto = {
    education: [],
    experience: [],
    skills: [
        { name: 'React', level: SkillLevel.EXPERT, category: 'Frontend' },
        { name: 'Node.js', level: SkillLevel.ADVANCED, category: 'Backend' }
    ]
};

export class CvApiService {
    private static instance: CvApiService;

    private constructor() { }

    public static getInstance(): CvApiService {
        if (!CvApiService.instance) {
            CvApiService.instance = new CvApiService();
        }
        return CvApiService.instance;
    }

    public async getCV(): Promise<CvDto> {
        try {
            const response = await apiClient.get<CvDto>('/cv');
            return response.data;
        } catch (error) {
            return MOCK_CV;
        }
    }
}

