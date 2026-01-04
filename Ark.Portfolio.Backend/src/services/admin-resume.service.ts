/**
 * @fileoverview Admin Resume Service
 * Handles administrative operations for Resume (Profile, Experience, Education, Skills, Categories,
 * Languages, Hobbies, Business Domains).
 * 
 * @author Armand Richelet-Kleinberg
 */

import { AppDataSource } from '../config/database';
import { Profile } from '../database/entities/profile.entity';
import { Experience } from '../database/entities/experience.entity';
import { Education } from '../database/entities/education.entity';
import { Skill } from '../database/entities/skill.entity';
import { SkillCategory } from '../database/entities/skill-category.entity';
import { Language } from '../database/entities/language.entity';
import { Hobby } from '../database/entities/hobby.entity';
import { BusinessDomain } from '../database/entities/business-domain.entity';
import {
    AdminResumeDto,
    CrudResponseDto,
    AdminExperienceDto,
    AdminEducationDto,
    AdminSkillDto,
    SkillCategoryDto,
    ReorderSkillsDto,
    LanguageDto,
    HobbyDto,
    BusinessDomainDto,
    validateLanguageDto,
    validateHobbyDto,
    validateBusinessDomainDto
} from '@ark/portfolio-share';

export class AdminResumeService {
    private profileRepo = AppDataSource.getRepository(Profile);
    private experienceRepo = AppDataSource.getRepository(Experience);
    private educationRepo = AppDataSource.getRepository(Education);
    private skillRepo = AppDataSource.getRepository(Skill);
    private categoryRepo = AppDataSource.getRepository(SkillCategory);
    private languageRepo = AppDataSource.getRepository(Language);
    private hobbyRepo = AppDataSource.getRepository(Hobby);
    private businessDomainRepo = AppDataSource.getRepository(BusinessDomain);

    // ============================================
    // Full Resume Retrieval
    // ============================================

    async getFullResume(): Promise<AdminResumeDto> {
        const profile = await this.profileRepo.findOne({ where: {} }) || new Profile();
        const experiences = await this.experienceRepo.find({ order: { displayOrder: 'ASC', startDate: 'DESC' } });
        const education = await this.educationRepo.find({ order: { startDate: 'DESC' } });
        const skills = await this.skillRepo.find({ order: { displayOrder: 'ASC' }, relations: ['category'] });
        const languages = await this.languageRepo.find({ order: { displayOrder: 'ASC' } });
        const hobbies = await this.hobbyRepo.find({ order: { displayOrder: 'ASC' } });
        const businessDomains = await this.businessDomainRepo.find({ order: { displayOrder: 'ASC' } });

        return {
            profile: {
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                title: profile.title || '',
                overview: profile.overview || '',
                email: profile.email || '',
                linkedinUrl: profile.linkedinUrl,
                githubUrl: profile.githubUrl,
                avatarUrl: profile.avatarUrl
            },
            experiences: experiences.map(e => ({
                id: e.id,
                company: e.company,
                position: e.position,
                description: e.description,
                startDate: e.startDate?.toISOString?.() || '',
                endDate: e.endDate?.toISOString?.() || undefined,
                technologies: e.technologies || [],
                isHighlighted: e.isHighlighted
            })),
            education: education.map(e => ({
                id: e.id,
                institution: e.institution,
                degree: e.degree,
                fieldOfStudy: e.fieldOfStudy,
                startDate: e.startDate?.toISOString?.() || '',
                endDate: e.endDate?.toISOString?.() || undefined,
                description: e.description
            })),
            skills: skills.map(s => ({
                id: s.id,
                name: s.name,
                level: s.level as any,
                category: s.category?.name || 'Uncategorized',
                yearsOfExperience: s.yearsOfExperience
            })),
            languages: languages.map(l => ({
                id: l.id,
                language: l.language,
                speaking: l.speaking,
                writing: l.writing,
                presenting: l.presenting,
                displayOrder: l.displayOrder
            })),
            hobbies: hobbies.map(h => ({
                id: h.id,
                name: h.name,
                description: h.description,
                icon: h.icon,
                displayOrder: h.displayOrder
            })),
            businessDomains: businessDomains.map(d => ({
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

    // ============================================
    // Profile CRUD
    // ============================================

    async updateProfile(dto: AdminResumeDto['profile']): Promise<CrudResponseDto<Profile>> {
        try {
            let profile = await this.profileRepo.findOne({ where: {} });
            if (!profile) {
                profile = this.profileRepo.create(dto);
            } else {
                this.profileRepo.merge(profile, dto);
            }

            const saved = await this.profileRepo.save(profile);
            return {
                success: true,
                message: 'Profile updated successfully',
                data: saved,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to update profile',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    // ============================================
    // Experience CRUD
    // ============================================

    async createExperience(dto: AdminExperienceDto): Promise<CrudResponseDto<Experience>> {
        try {
            const experience = this.experienceRepo.create({
                company: dto.company,
                position: dto.position,
                description: dto.description,
                startDate: dto.startDate ? new Date(dto.startDate) : undefined,
                endDate: dto.endDate ? new Date(dto.endDate) : null,
                technologies: dto.technologies,
                isHighlighted: dto.isHighlighted || false,
                displayOrder: await this.getNextExperienceOrder()
            });

            const saved = await this.experienceRepo.save(experience);
            return { success: true, message: 'Experience created', data: saved, timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to create experience', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    async updateExperience(id: number, dto: AdminExperienceDto): Promise<CrudResponseDto<Experience>> {
        try {
            const experience = await this.experienceRepo.findOneBy({ id });
            if (!experience) {
                return { success: false, message: 'Experience not found', timestamp: new Date().toISOString() };
            }

            experience.company = dto.company;
            experience.position = dto.position;
            experience.description = dto.description;
            experience.startDate = dto.startDate ? new Date(dto.startDate) : experience.startDate;
            experience.endDate = dto.endDate ? new Date(dto.endDate) : null;
            experience.technologies = dto.technologies;
            experience.isHighlighted = dto.isHighlighted ?? experience.isHighlighted;

            const saved = await this.experienceRepo.save(experience);
            return { success: true, message: 'Experience updated', data: saved, timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to update experience', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    async deleteExperience(id: number): Promise<CrudResponseDto<void>> {
        try {
            await this.experienceRepo.delete(id);
            return { success: true, message: 'Experience deleted', timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to delete experience', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    /**
     * Reorder experiences by updating their displayOrder values.
     * @param experienceIds - Array of experience IDs in new order
     */
    async reorderExperiences(experienceIds: number[]): Promise<CrudResponseDto<void>> {
        try {
            for (let i = 0; i < experienceIds.length; i++) {
                await this.experienceRepo.update(experienceIds[i], { displayOrder: i });
            }
            return { success: true, message: 'Experiences reordered', timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to reorder experiences', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    // ============================================
    // Education CRUD
    // ============================================

    async createEducation(dto: AdminEducationDto): Promise<CrudResponseDto<Education>> {
        try {
            const education = this.educationRepo.create({
                institution: dto.institution,
                degree: dto.degree,
                fieldOfStudy: dto.fieldOfStudy,
                startDate: dto.startDate ? new Date(dto.startDate) : undefined,
                endDate: dto.endDate ? new Date(dto.endDate) : undefined,
                description: dto.description
            });

            const saved = await this.educationRepo.save(education);
            return { success: true, message: 'Education created', data: saved, timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to create education', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    async updateEducation(id: number, dto: AdminEducationDto): Promise<CrudResponseDto<Education>> {
        try {
            const education = await this.educationRepo.findOneBy({ id });
            if (!education) {
                return { success: false, message: 'Education not found', timestamp: new Date().toISOString() };
            }

            education.institution = dto.institution;
            education.degree = dto.degree;
            education.fieldOfStudy = dto.fieldOfStudy;
            education.startDate = dto.startDate ? new Date(dto.startDate) : education.startDate;
            education.endDate = dto.endDate ? new Date(dto.endDate) : education.endDate;
            education.description = dto.description ?? education.description;

            const saved = await this.educationRepo.save(education);
            return { success: true, message: 'Education updated', data: saved, timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to update education', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    async deleteEducation(id: number): Promise<CrudResponseDto<void>> {
        try {
            await this.educationRepo.delete(id);
            return { success: true, message: 'Education deleted', timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to delete education', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    /**
     * Reorder education entries by updating their displayOrder values.
     * @param educationIds - Array of education IDs in new order
     */
    async reorderEducation(educationIds: number[]): Promise<CrudResponseDto<void>> {
        try {
            for (let i = 0; i < educationIds.length; i++) {
                await this.educationRepo.update(educationIds[i], { displayOrder: i });
            }
            return { success: true, message: 'Education reordered', timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to reorder education', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }


    // ============================================
    // Skill CRUD
    // ============================================

    async createSkill(dto: AdminSkillDto): Promise<CrudResponseDto<Skill>> {
        try {
            // Find or create category
            let category = await this.categoryRepo.findOneBy({ name: dto.category });
            if (!category && dto.category) {
                category = await this.categoryRepo.save(this.categoryRepo.create({
                    name: dto.category,
                    displayOrder: await this.getNextCategoryOrder()
                }));
            }

            const skill = this.skillRepo.create({
                name: dto.name,
                level: dto.level,
                categoryId: category?.id,
                yearsOfExperience: dto.yearsOfExperience,
                displayOrder: await this.getNextSkillOrder(category?.id)
            });

            const saved = await this.skillRepo.save(skill);
            return { success: true, message: 'Skill created', data: saved, timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to create skill', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    async updateSkill(id: number, dto: AdminSkillDto): Promise<CrudResponseDto<Skill>> {
        try {
            const skill = await this.skillRepo.findOneBy({ id });
            if (!skill) {
                return { success: false, message: 'Skill not found', timestamp: new Date().toISOString() };
            }

            // Find or create category
            let category = await this.categoryRepo.findOneBy({ name: dto.category });
            if (!category && dto.category) {
                category = await this.categoryRepo.save(this.categoryRepo.create({
                    name: dto.category,
                    displayOrder: await this.getNextCategoryOrder()
                }));
            }

            skill.name = dto.name;
            skill.level = dto.level;
            skill.categoryId = category?.id || skill.categoryId;
            skill.yearsOfExperience = dto.yearsOfExperience ?? skill.yearsOfExperience;

            const saved = await this.skillRepo.save(skill);
            return { success: true, message: 'Skill updated', data: saved, timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to update skill', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    async deleteSkill(id: number): Promise<CrudResponseDto<void>> {
        try {
            await this.skillRepo.delete(id);
            return { success: true, message: 'Skill deleted', timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to delete skill', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    async reorderSkills(dto: ReorderSkillsDto): Promise<CrudResponseDto<void>> {
        try {
            for (let i = 0; i < dto.skillIds.length; i++) {
                await this.skillRepo.update(dto.skillIds[i], { displayOrder: i });
            }
            return { success: true, message: 'Skills reordered', timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to reorder skills', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    // ============================================
    // Skill Categories CRUD
    // ============================================

    async getSkillCategories(): Promise<SkillCategoryDto[]> {
        const categories = await this.categoryRepo.find({
            order: { displayOrder: 'ASC' },
            relations: ['skills']
        });
        return categories.map(c => ({
            id: c.id,
            name: c.name,
            description: c.description,
            icon: c.icon,
            color: c.color,
            displayOrder: c.displayOrder
        }));
    }

    async createSkillCategory(dto: SkillCategoryDto): Promise<CrudResponseDto<SkillCategory>> {
        try {
            const category = this.categoryRepo.create({
                name: dto.name,
                description: dto.description,
                icon: dto.icon,
                color: dto.color || '#3b82f6',
                displayOrder: dto.displayOrder ?? await this.getNextCategoryOrder()
            });

            const saved = await this.categoryRepo.save(category);
            return { success: true, message: 'Category created', data: saved, timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to create category', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    async updateSkillCategory(id: number, dto: SkillCategoryDto): Promise<CrudResponseDto<SkillCategory>> {
        try {
            const category = await this.categoryRepo.findOneBy({ id });
            if (!category) {
                return { success: false, message: 'Category not found', timestamp: new Date().toISOString() };
            }

            category.name = dto.name;
            category.description = dto.description ?? category.description;
            category.icon = dto.icon ?? category.icon;
            category.color = dto.color ?? category.color;

            const saved = await this.categoryRepo.save(category);
            return { success: true, message: 'Category updated', data: saved, timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to update category', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    async deleteSkillCategory(id: number): Promise<CrudResponseDto<void>> {
        try {
            // Move skills to uncategorized first
            await this.skillRepo.update({ categoryId: id }, { categoryId: undefined as any });
            await this.categoryRepo.delete(id);
            return { success: true, message: 'Category deleted', timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to delete category', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    // ============================================
    // Language CRUD
    // ============================================

    async createLanguage(dto: LanguageDto): Promise<CrudResponseDto<Language>> {
        try {
            // Validate DTO
            const validation = validateLanguageDto(dto);
            if (!validation.isValid) {
                return { success: false, message: 'Validation failed', errors: validation.errors, timestamp: new Date().toISOString() };
            }

            const language = this.languageRepo.create({
                language: dto.language,
                speaking: dto.speaking,
                writing: dto.writing,
                presenting: dto.presenting,
                displayOrder: await this.getNextLanguageOrder()
            });

            const saved = await this.languageRepo.save(language);
            return { success: true, message: 'Language created', data: saved, timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to create language', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    async updateLanguage(id: number, dto: LanguageDto): Promise<CrudResponseDto<Language>> {
        try {
            const language = await this.languageRepo.findOneBy({ id });
            if (!language) {
                return { success: false, message: 'Language not found', timestamp: new Date().toISOString() };
            }

            // Validate DTO
            const validation = validateLanguageDto(dto);
            if (!validation.isValid) {
                return { success: false, message: 'Validation failed', errors: validation.errors, timestamp: new Date().toISOString() };
            }

            language.language = dto.language;
            language.speaking = dto.speaking;
            language.writing = dto.writing;
            language.presenting = dto.presenting;

            const saved = await this.languageRepo.save(language);
            return { success: true, message: 'Language updated', data: saved, timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to update language', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    async deleteLanguage(id: number): Promise<CrudResponseDto<void>> {
        try {
            await this.languageRepo.delete(id);
            return { success: true, message: 'Language deleted', timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to delete language', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    async reorderLanguages(languageIds: number[]): Promise<CrudResponseDto<void>> {
        try {
            for (let i = 0; i < languageIds.length; i++) {
                await this.languageRepo.update(languageIds[i], { displayOrder: i });
            }
            return { success: true, message: 'Languages reordered', timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to reorder languages', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    // ============================================
    // Hobby CRUD
    // ============================================

    async createHobby(dto: HobbyDto): Promise<CrudResponseDto<Hobby>> {
        try {
            // Validate DTO
            const validation = validateHobbyDto(dto);
            if (!validation.isValid) {
                return { success: false, message: 'Validation failed', errors: validation.errors, timestamp: new Date().toISOString() };
            }

            const hobby = this.hobbyRepo.create({
                name: dto.name,
                description: dto.description,
                icon: dto.icon,
                displayOrder: await this.getNextHobbyOrder()
            });

            const saved = await this.hobbyRepo.save(hobby);
            return { success: true, message: 'Hobby created', data: saved, timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to create hobby', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    async updateHobby(id: number, dto: HobbyDto): Promise<CrudResponseDto<Hobby>> {
        try {
            const hobby = await this.hobbyRepo.findOneBy({ id });
            if (!hobby) {
                return { success: false, message: 'Hobby not found', timestamp: new Date().toISOString() };
            }

            // Validate DTO
            const validation = validateHobbyDto(dto);
            if (!validation.isValid) {
                return { success: false, message: 'Validation failed', errors: validation.errors, timestamp: new Date().toISOString() };
            }

            hobby.name = dto.name;
            hobby.description = dto.description ?? hobby.description;
            hobby.icon = dto.icon ?? hobby.icon;

            const saved = await this.hobbyRepo.save(hobby);
            return { success: true, message: 'Hobby updated', data: saved, timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to update hobby', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    async deleteHobby(id: number): Promise<CrudResponseDto<void>> {
        try {
            await this.hobbyRepo.delete(id);
            return { success: true, message: 'Hobby deleted', timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to delete hobby', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    async reorderHobbies(hobbyIds: number[]): Promise<CrudResponseDto<void>> {
        try {
            for (let i = 0; i < hobbyIds.length; i++) {
                await this.hobbyRepo.update(hobbyIds[i], { displayOrder: i });
            }
            return { success: true, message: 'Hobbies reordered', timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to reorder hobbies', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    // ============================================
    // Business Domain CRUD
    // ============================================

    async createBusinessDomain(dto: BusinessDomainDto): Promise<CrudResponseDto<BusinessDomain>> {
        try {
            // Validate DTO
            const validation = validateBusinessDomainDto(dto);
            if (!validation.isValid) {
                return { success: false, message: 'Validation failed', errors: validation.errors, timestamp: new Date().toISOString() };
            }

            const domain = this.businessDomainRepo.create({
                domain: dto.domain,
                level: dto.level,
                description: dto.description,
                yearsOfExperience: dto.yearsOfExperience,
                icon: dto.icon,
                displayOrder: await this.getNextBusinessDomainOrder()
            });

            const saved = await this.businessDomainRepo.save(domain);
            return { success: true, message: 'Business domain created', data: saved, timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to create business domain', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    async updateBusinessDomain(id: number, dto: BusinessDomainDto): Promise<CrudResponseDto<BusinessDomain>> {
        try {
            const domain = await this.businessDomainRepo.findOneBy({ id });
            if (!domain) {
                return { success: false, message: 'Business domain not found', timestamp: new Date().toISOString() };
            }

            // Validate DTO
            const validation = validateBusinessDomainDto(dto);
            if (!validation.isValid) {
                return { success: false, message: 'Validation failed', errors: validation.errors, timestamp: new Date().toISOString() };
            }

            domain.domain = dto.domain;
            domain.level = dto.level ?? domain.level;
            domain.description = dto.description ?? domain.description;
            domain.yearsOfExperience = dto.yearsOfExperience ?? domain.yearsOfExperience;
            domain.icon = dto.icon ?? domain.icon;

            const saved = await this.businessDomainRepo.save(domain);
            return { success: true, message: 'Business domain updated', data: saved, timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to update business domain', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    async deleteBusinessDomain(id: number): Promise<CrudResponseDto<void>> {
        try {
            await this.businessDomainRepo.delete(id);
            return { success: true, message: 'Business domain deleted', timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to delete business domain', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    async reorderBusinessDomains(domainIds: number[]): Promise<CrudResponseDto<void>> {
        try {
            for (let i = 0; i < domainIds.length; i++) {
                await this.businessDomainRepo.update(domainIds[i], { displayOrder: i });
            }
            return { success: true, message: 'Business domains reordered', timestamp: new Date().toISOString() };
        } catch (error) {
            return { success: false, message: 'Failed to reorder business domains', errors: [(error as Error).message], timestamp: new Date().toISOString() };
        }
    }

    // ============================================
    // Helper Methods
    // ============================================

    private async getNextExperienceOrder(): Promise<number> {
        const max = await this.experienceRepo.createQueryBuilder('e')
            .select('MAX(e.displayOrder)', 'max')
            .getRawOne();
        return (max?.max ?? -1) + 1;
    }

    private async getNextSkillOrder(categoryId?: number): Promise<number> {
        const qb = this.skillRepo.createQueryBuilder('s')
            .select('MAX(s.displayOrder)', 'max');
        if (categoryId) {
            qb.where('s.categoryId = :categoryId', { categoryId });
        }
        const max = await qb.getRawOne();
        return (max?.max ?? -1) + 1;
    }

    private async getNextCategoryOrder(): Promise<number> {
        const max = await this.categoryRepo.createQueryBuilder('c')
            .select('MAX(c.displayOrder)', 'max')
            .getRawOne();
        return (max?.max ?? -1) + 1;
    }

    private async getNextLanguageOrder(): Promise<number> {
        const max = await this.languageRepo.createQueryBuilder('l')
            .select('MAX(l.displayOrder)', 'max')
            .getRawOne();
        return (max?.max ?? -1) + 1;
    }

    private async getNextHobbyOrder(): Promise<number> {
        const max = await this.hobbyRepo.createQueryBuilder('h')
            .select('MAX(h.displayOrder)', 'max')
            .getRawOne();
        return (max?.max ?? -1) + 1;
    }

    private async getNextBusinessDomainOrder(): Promise<number> {
        const max = await this.businessDomainRepo.createQueryBuilder('d')
            .select('MAX(d.displayOrder)', 'max')
            .getRawOne();
        return (max?.max ?? -1) + 1;
    }
}


