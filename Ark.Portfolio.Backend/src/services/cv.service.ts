/**
 * @fileoverview CV Service
 * Handles retrieval of curriculum vitae data including education,
 * work experience, and skills.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { EducationRepository, ExperienceRepository, SkillRepository } from '../database/repositories/cv.repository';
import { CvDto, SkillLevel, Technology } from '@ark/portfolio-share';

/**
 * Service class for CV-related operations.
 * Aggregates education, experience, and skills data.
 */
export class CvService {
    /**
     * Retrieves complete CV data.
     * Education and experience are sorted by start date (most recent first).
     * Skills are sorted by category and name.
     * 
     * @returns Promise resolving to complete CV DTO
     */
    async getCv(): Promise<CvDto> {
        const education = await EducationRepository.find({ order: { startDate: 'DESC' } });
        const experience = await ExperienceRepository.find({ order: { startDate: 'DESC' } });
        const skills = await SkillRepository.find({
            order: { displayOrder: 'ASC', name: 'ASC' },
            relations: ['category']
        });

        return {
            education: education.map((e: any) => ({
                id: e.id,
                institution: e.institution,
                degree: e.degree,
                fieldOfStudy: e.fieldOfStudy,
                startDate: e.startDate,
                endDate: e.endDate,
                description: e.description
            })),
            experience: experience.map((e: any) => ({
                id: e.id,
                company: e.company,
                position: e.position,
                startDate: e.startDate,
                endDate: e.endDate,
                description: e.description,
                technologies: [] // TODO: Add relation if needed
            })),
            skills: skills.map((s: any) => ({
                name: s.name,
                level: s.level as SkillLevel,
                category: s.category?.name || 'Uncategorized'
            }))
        };
    }
}

