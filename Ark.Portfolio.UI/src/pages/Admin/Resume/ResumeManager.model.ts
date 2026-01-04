/**
 * @fileoverview Resume Manager Model
 * Hook for managing Resume data (profile, experience, education, skills,
 * languages, hobbies, business domains).
 * 
 * NOTE: This file was previously named CvManager - consolidated to use "Resume" naming
 * for consistency across the application.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useState, useEffect, useCallback } from 'react';
import {
    AdminResumeDto, AdminProfileDto, AdminExperienceDto, AdminEducationDto,
    AdminSkillDto, SkillCategoryDto, AiSettingsDto,
    LanguageDto, HobbyDto, BusinessDomainDto,
    ResumeTabEnum
} from '@ark/portfolio-share';
import { apiClient } from '../../../api/client/apiClient';
import { API_CONFIG } from '../../../config/api.constants';

const API_URL = API_CONFIG.ADMIN_BASE_URL;

export const useResumeManagerModel = () => {
    const [resumeData, setResumeData] = useState<AdminResumeDto | null>(null);
    const [categories, setCategories] = useState<SkillCategoryDto[]>([]);
    const [aiSettings, setAiSettings] = useState<AiSettingsDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [activeTab, setActiveTab] = useState<ResumeTabEnum>(ResumeTabEnum.PROFILE);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const showError = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(''), 5000);
    };

    // ============================================
    // Data Fetching
    // ============================================

    const fetchResume = useCallback(async () => {
        setIsLoading(true);
        try {
            // Using apiClient - base URL handled by client config if relative, 
            // otherwise full URL is supported if it starts with http
            const response = await apiClient.get(`${API_URL}/resume`);
            setResumeData(response.data);
        } catch (err) {
            showError('Failed to fetch resume data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await apiClient.get(`${API_URL}/resume/categories`);
            setCategories(response.data);
        } catch (err) {
            console.error('Failed to fetch categories');
        }
    }, []);

    const fetchAiSettings = useCallback(async () => {
        try {
            const response = await apiClient.get(`${API_URL}/ai/settings`);
            setAiSettings(response.data);
        } catch (err) {
            console.error('Failed to fetch AI settings');
        }
    }, []);

    useEffect(() => {
        fetchResume();
        fetchCategories();
        fetchAiSettings();
    }, [fetchResume, fetchCategories, fetchAiSettings]);

    // ============================================
    // Profile CRUD
    // ============================================

    const updateProfile = async (profile: AdminProfileDto) => {
        setIsSaving(true);
        try {
            await apiClient.put(`${API_URL}/resume/profile`, profile);
            await fetchResume();
            showSuccess('Profile updated successfully');
        } catch (err) {
            showError('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    // ============================================
    // Experience CRUD
    // ============================================

    const createExperience = async (experience: AdminExperienceDto) => {
        setIsSaving(true);
        try {
            await apiClient.post(`${API_URL}/resume/experience`, experience);
            await fetchResume();
            showSuccess('Experience added');
            closeModal();
        } catch (err) {
            showError('Failed to create experience');
        } finally {
            setIsSaving(false);
        }
    };

    const updateExperience = async (id: number, experience: AdminExperienceDto) => {
        setIsSaving(true);
        try {
            await apiClient.put(`${API_URL}/resume/experience/${id}`, experience);
            await fetchResume();
            showSuccess('Experience updated');
            closeModal();
        } catch (err) {
            showError('Failed to update experience');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteExperience = async (id: number) => {
        if (!confirm('Delete this experience?')) return;
        try {
            await apiClient.delete(`${API_URL}/resume/experience/${id}`);
            await fetchResume();
            showSuccess('Experience deleted');
        } catch (err) {
            showError('Failed to delete experience');
        }
    };

    const reorderExperiences = async (experienceIds: number[]) => {
        setIsSaving(true);
        try {
            await apiClient.put(`${API_URL}/resume/experience/reorder`, { experienceIds });
            await fetchResume();
            showSuccess('Experiences reordered');
        } catch (err) {
            showError('Failed to reorder experiences');
        } finally {
            setIsSaving(false);
        }
    };

    // ============================================
    // Education CRUD
    // ============================================

    const createEducation = async (education: AdminEducationDto) => {
        setIsSaving(true);
        try {
            await apiClient.post(`${API_URL}/resume/education`, education);
            await fetchResume();
            showSuccess('Education added');
            closeModal();
        } catch (err) {
            showError('Failed to create education');
        } finally {
            setIsSaving(false);
        }
    };

    const updateEducation = async (id: number, education: AdminEducationDto) => {
        setIsSaving(true);
        try {
            await apiClient.put(`${API_URL}/resume/education/${id}`, education);
            await fetchResume();
            showSuccess('Education updated');
            closeModal();
        } catch (err) {
            showError('Failed to update education');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteEducation = async (id: number) => {
        if (!confirm('Delete this education entry?')) return;
        try {
            await apiClient.delete(`${API_URL}/resume/education/${id}`);
            await fetchResume();
            showSuccess('Education deleted');
        } catch (err) {
            showError('Failed to delete education');
        }
    };

    const reorderEducation = async (educationIds: number[]) => {
        setIsSaving(true);
        try {
            await apiClient.put(`${API_URL}/resume/education/reorder`, { educationIds });
            await fetchResume();
            showSuccess('Education reordered');
        } catch (err) {
            showError('Failed to reorder education');
        } finally {
            setIsSaving(false);
        }
    };


    // ============================================
    // Skills CRUD
    // ============================================

    const createSkill = async (skill: AdminSkillDto) => {
        setIsSaving(true);
        try {
            await apiClient.post(`${API_URL}/resume/skill`, skill);
            await fetchResume();
            await fetchCategories();
            showSuccess('Skill added');
            closeModal();
        } catch (err) {
            showError('Failed to create skill');
        } finally {
            setIsSaving(false);
        }
    };

    const updateSkill = async (id: number, skill: AdminSkillDto) => {
        setIsSaving(true);
        try {
            await apiClient.put(`${API_URL}/resume/skill/${id}`, skill);
            await fetchResume();
            await fetchCategories();
            showSuccess('Skill updated');
            closeModal();
        } catch (err) {
            showError('Failed to update skill');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteSkill = async (id: number) => {
        if (!confirm('Delete this skill?')) return;
        try {
            await apiClient.delete(`${API_URL}/resume/skill/${id}`);
            await fetchResume();
            showSuccess('Skill deleted');
        } catch (err) {
            showError('Failed to delete skill');
        }
    };

    // ============================================
    // Skill Categories CRUD
    // ============================================

    const createCategory = async (category: SkillCategoryDto) => {
        setIsSaving(true);
        try {
            await apiClient.post(`${API_URL}/resume/category`, category);
            await fetchCategories();
            showSuccess('Category created');
            closeModal();
        } catch (err) {
            showError('Failed to create category');
        } finally {
            setIsSaving(false);
        }
    };

    const updateCategory = async (id: number, category: SkillCategoryDto) => {
        setIsSaving(true);
        try {
            await apiClient.put(`${API_URL}/resume/category/${id}`, category);
            await fetchCategories();
            showSuccess('Category updated');
            closeModal();
        } catch (err) {
            showError('Failed to update category');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteCategory = async (id: number) => {
        if (!confirm('Delete this category? Skills will become uncategorized.')) return;
        try {
            await apiClient.delete(`${API_URL}/resume/category/${id}`);
            await fetchCategories();
            await fetchResume();
            showSuccess('Category deleted');
        } catch (err) {
            showError('Failed to delete category');
        }
    };

    // ============================================
    // Language CRUD
    // ============================================

    const createLanguage = async (language: LanguageDto) => {
        setIsSaving(true);
        try {
            await apiClient.post(`${API_URL}/resume/language`, language);
            await fetchResume();
            showSuccess('Language added');
            closeModal();
        } catch (err) {
            showError('Failed to create language');
        } finally {
            setIsSaving(false);
        }
    };

    const updateLanguage = async (id: number, language: LanguageDto) => {
        setIsSaving(true);
        try {
            await apiClient.put(`${API_URL}/resume/language/${id}`, language);
            await fetchResume();
            showSuccess('Language updated');
            closeModal();
        } catch (err) {
            showError('Failed to update language');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteLanguage = async (id: number) => {
        if (!confirm('Delete this language?')) return;
        try {
            await apiClient.delete(`${API_URL}/resume/language/${id}`);
            await fetchResume();
            showSuccess('Language deleted');
        } catch (err) {
            showError('Failed to delete language');
        }
    };

    const reorderLanguages = async (languageIds: number[]) => {
        setIsSaving(true);
        try {
            await apiClient.put(`${API_URL}/resume/language/reorder`, { languageIds });
            await fetchResume();
            showSuccess('Languages reordered');
        } catch (err) {
            showError('Failed to reorder languages');
        } finally {
            setIsSaving(false);
        }
    };

    // ============================================
    // Hobby CRUD
    // ============================================

    const createHobby = async (hobby: HobbyDto) => {
        setIsSaving(true);
        try {
            await apiClient.post(`${API_URL}/resume/hobby`, hobby);
            await fetchResume();
            showSuccess('Hobby added');
            closeModal();
        } catch (err) {
            showError('Failed to create hobby');
        } finally {
            setIsSaving(false);
        }
    };

    const updateHobby = async (id: number, hobby: HobbyDto) => {
        setIsSaving(true);
        try {
            await apiClient.put(`${API_URL}/resume/hobby/${id}`, hobby);
            await fetchResume();
            showSuccess('Hobby updated');
            closeModal();
        } catch (err) {
            showError('Failed to update hobby');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteHobby = async (id: number) => {
        if (!confirm('Delete this hobby?')) return;
        try {
            await apiClient.delete(`${API_URL}/resume/hobby/${id}`);
            await fetchResume();
            showSuccess('Hobby deleted');
        } catch (err) {
            showError('Failed to delete hobby');
        }
    };

    const reorderHobbies = async (hobbyIds: number[]) => {
        setIsSaving(true);
        try {
            await apiClient.put(`${API_URL}/resume/hobby/reorder`, { hobbyIds });
            await fetchResume();
            showSuccess('Hobbies reordered');
        } catch (err) {
            showError('Failed to reorder hobbies');
        } finally {
            setIsSaving(false);
        }
    };

    // ============================================
    // Business Domain CRUD
    // ============================================

    const createBusinessDomain = async (domain: BusinessDomainDto) => {
        setIsSaving(true);
        try {
            await apiClient.post(`${API_URL}/resume/business-domain`, domain);
            await fetchResume();
            showSuccess('Business domain added');
            closeModal();
        } catch (err) {
            showError('Failed to create business domain');
        } finally {
            setIsSaving(false);
        }
    };

    const updateBusinessDomain = async (id: number, domain: BusinessDomainDto) => {
        setIsSaving(true);
        try {
            await apiClient.put(`${API_URL}/resume/business-domain/${id}`, domain);
            await fetchResume();
            showSuccess('Business domain updated');
            closeModal();
        } catch (err) {
            showError('Failed to update business domain');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteBusinessDomain = async (id: number) => {
        if (!confirm('Delete this business domain?')) return;
        try {
            await apiClient.delete(`${API_URL}/resume/business-domain/${id}`);
            await fetchResume();
            showSuccess('Business domain deleted');
        } catch (err) {
            showError('Failed to delete business domain');
        }
    };

    const reorderBusinessDomains = async (domainIds: number[]) => {
        setIsSaving(true);
        try {
            await apiClient.put(`${API_URL}/resume/business-domain/reorder`, { domainIds });
            await fetchResume();
            showSuccess('Business domains reordered');
        } catch (err) {
            showError('Failed to reorder business domains');
        } finally {
            setIsSaving(false);
        }
    };

    // ============================================
    // AI Settings & Operations
    // ============================================

    const updateAiSettings = async (settings: AiSettingsDto) => {
        setIsSaving(true);
        try {
            await apiClient.put(`${API_URL}/ai/settings`, settings);
            await fetchAiSettings();
            showSuccess('AI settings saved');
        } catch (err) {
            showError('Failed to save AI settings');
        } finally {
            setIsSaving(false);
        }
    };

    const testAiConnection = async (): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await apiClient.post(`${API_URL}/ai/test`, {});
            return response.data;
        } catch (err) {
            return { success: false, message: 'Connection test failed' };
        }
    };

    const organizeSkillsWithAi = async () => {
        if (!resumeData?.skills?.length) {
            showError('No skills to organize');
            return;
        }
        setIsSaving(true);
        try {
            const response = await apiClient.post(`${API_URL}/ai/organize-skills`, {
                skills: resumeData.skills.map(s => ({ id: s.id, name: s.name, level: s.level }))
            });

            if (response.data.categories?.length) {
                showSuccess(`AI suggested ${response.data.categories.length} categories`);
            }
            return response.data;
        } catch (err) {
            showError('AI organization failed');
        } finally {
            setIsSaving(false);
        }
    };

    const improveTextWithAi = async (text: string, context?: string): Promise<string> => {
        try {
            const response = await apiClient.post(`${API_URL}/ai/improve-text`, { text, context });
            return response.data.result || text;
        } catch (err) {
            showError('AI text improvement failed');
            return text;
        }
    };

    // ============================================
    // Modal Helpers
    // ============================================

    const openModal = (item: any = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingItem(null);
        setIsModalOpen(false);
    };

    return {
        // Data (renamed from cvData to resumeData)
        resumeData,
        categories,
        aiSettings,

        // State
        isLoading,
        isSaving,
        error,
        successMessage,
        activeTab,
        setActiveTab,
        editingItem,
        isModalOpen,

        // Modal
        openModal,
        closeModal,

        // Profile
        updateProfile,

        // Experience
        createExperience,
        updateExperience,
        deleteExperience,
        reorderExperiences,

        // Education
        createEducation,
        updateEducation,
        deleteEducation,
        reorderEducation,

        // Skills
        createSkill,
        updateSkill,
        deleteSkill,

        // Categories
        createCategory,
        updateCategory,
        deleteCategory,

        // Languages
        createLanguage,
        updateLanguage,
        deleteLanguage,
        reorderLanguages,

        // Hobbies
        createHobby,
        updateHobby,
        deleteHobby,
        reorderHobbies,

        // Business Domains
        createBusinessDomain,
        updateBusinessDomain,
        deleteBusinessDomain,
        reorderBusinessDomains,

        // AI
        updateAiSettings,
        testAiConnection,
        organizeSkillsWithAi,
        improveTextWithAi
    };
};

// Legacy export for backward compatibility
export const useCvManagerModel = useResumeManagerModel;
