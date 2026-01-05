/**
 * @fileoverview Resume Service
 * Handles retrieval of resume data including education,
 * work experience, skills, languages, hobbies, and business domains.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { EducationRepository, ExperienceRepository, SkillRepository } from '../database/repositories/resume.repository';
import { ResumeDto, SkillLevel } from '@ark/portfolio-share';
import { AppDataSource } from '../config/database';
import { Profile } from '../database/entities/profile.entity';
import { Language } from '../database/entities/language.entity';
import { Hobby } from '../database/entities/hobby.entity';
import { BusinessDomain } from '../database/entities/business-domain.entity';
import { mapProfileToDto } from '../mappers';

/**
 * Service class for Resume-related operations.
 * Aggregates education, experience, skills, languages, hobbies, and business domains.
 */
export class ResumeService {
    /**
     * Retrieves complete Resume data.
     * Education and experience are sorted by start date (most recent first).
     * Skills, languages, hobbies, and business domains are sorted by displayOrder.
     * 
     * @returns Promise resolving to complete Resume DTO
     */
    async getResume(): Promise<ResumeDto> {
        const education = await EducationRepository.find({ order: { startDate: 'DESC' } });
        const experience = await ExperienceRepository.find({ order: { startDate: 'DESC' } });
        const skills = await SkillRepository.find({
            order: { displayOrder: 'ASC', name: 'ASC' },
            relations: ['category']
        });

        // Fetch new resume sections
        const languageRepo = AppDataSource.getRepository(Language);
        const hobbyRepo = AppDataSource.getRepository(Hobby);
        const domainRepo = AppDataSource.getRepository(BusinessDomain);

        const languages = await languageRepo.find({ order: { displayOrder: 'ASC' } });
        const hobbies = await hobbyRepo.find({ order: { displayOrder: 'ASC' } });
        const businessDomains = await domainRepo.find({ order: { displayOrder: 'ASC' } });

        const profileRepo = AppDataSource.getRepository(Profile);
        const profile = await profileRepo.findOne({ where: {} });
        if (!profile) throw new Error('Profile not found');

        return {
            profile: mapProfileToDto(profile),
            education: education.map((e: any) => ({
                id: e.id,
                institution: e.institution,
                degree: e.degree,
                fieldOfStudy: e.fieldOfStudy,
                startDate: e.startDate,
                endDate: e.endDate,
                description: e.description
            })),
            experiences: experience.map((e: any) => ({
                id: e.id,
                company: e.company,
                position: e.position,
                startDate: e.startDate,
                endDate: e.endDate,
                description: e.description,
                technologies: e.technologies || []
            })),
            skills: skills.map((s: any) => ({
                name: s.name,
                level: s.level as SkillLevel,
                category: s.category?.name || 'Uncategorized'
            })),
            languages: languages.map((l: Language) => ({
                id: l.id,
                language: l.language,
                speaking: l.speaking,
                writing: l.writing,
                presenting: l.presenting,
                displayOrder: l.displayOrder
            })),
            hobbies: hobbies.map((h: Hobby) => ({
                id: h.id,
                name: h.name,
                description: h.description,
                icon: h.icon,
                displayOrder: h.displayOrder
            })),
            businessDomains: businessDomains.map((d: BusinessDomain) => ({
                id: d.id,
                domain: d.domain,
                level: d.level as any,
                description: d.description,
                yearsOfExperience: d.yearsOfExperience,
                icon: d.icon,
                displayOrder: d.displayOrder
            }))
        };
    }
}
