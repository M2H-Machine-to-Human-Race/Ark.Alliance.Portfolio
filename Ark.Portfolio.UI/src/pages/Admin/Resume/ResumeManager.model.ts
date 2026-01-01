/**
 * @fileoverview Resume Manager Model
 * Hook for managing Resume data (profile, experience, education, skills).
 * 
 * NOTE: This file was previously named CvManager - consolidated to use "Resume" naming
 * for consistency across the application.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    AdminCvDto, AdminProfileDto, AdminExperienceDto, AdminEducationDto,
    AdminSkillDto, SkillCategoryDto, AiSettingsDto
} from '@ark/portfolio-share';
import { authService } from '../../../services/auth.service';
import { API_CONFIG } from '../../../config/api.constants';

const API_URL = API_CONFIG.ADMIN_BASE_URL;

export type ResumeTab = 'profile' | 'experience' | 'education' | 'skills' | 'ai-settings';

export const useResumeManagerModel = () => {
    const [resumeData, setResumeData] = useState<AdminCvDto | null>(null);
    const [categories, setCategories] = useState<SkillCategoryDto[]>([]);
    const [aiSettings, setAiSettings] = useState<AiSettingsDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [activeTab, setActiveTab] = useState<ResumeTab>('profile');
    const [editingItem, setEditingItem] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${authService.getToken()}` }
    });

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
            const response = await axios.get(`${API_URL}/resume`, getAuthHeaders());
            setResumeData(response.data);
        } catch (err) {
            showError('Failed to fetch resume data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/resume/categories`, getAuthHeaders());
            setCategories(response.data);
        } catch (err) {
            console.error('Failed to fetch categories');
        }
    }, []);

    const fetchAiSettings = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/ai/settings`, getAuthHeaders());
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
            await axios.put(`${API_URL}/resume/profile`, profile, getAuthHeaders());
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
            await axios.post(`${API_URL}/resume/experience`, experience, getAuthHeaders());
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
            await axios.put(`${API_URL}/resume/experience/${id}`, experience, getAuthHeaders());
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
            await axios.delete(`${API_URL}/resume/experience/${id}`, getAuthHeaders());
            await fetchResume();
            showSuccess('Experience deleted');
        } catch (err) {
            showError('Failed to delete experience');
        }
    };

    const reorderExperiences = async (experienceIds: number[]) => {
        setIsSaving(true);
        try {
            await axios.put(`${API_URL}/resume/experience/reorder`, { experienceIds }, getAuthHeaders());
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
            await axios.post(`${API_URL}/resume/education`, education, getAuthHeaders());
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
            await axios.put(`${API_URL}/resume/education/${id}`, education, getAuthHeaders());
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
            await axios.delete(`${API_URL}/resume/education/${id}`, getAuthHeaders());
            await fetchResume();
            showSuccess('Education deleted');
        } catch (err) {
            showError('Failed to delete education');
        }
    };

    const reorderEducation = async (educationIds: number[]) => {
        setIsSaving(true);
        try {
            await axios.put(`${API_URL}/resume/education/reorder`, { educationIds }, getAuthHeaders());
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
            await axios.post(`${API_URL}/resume/skill`, skill, getAuthHeaders());
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
            await axios.put(`${API_URL}/resume/skill/${id}`, skill, getAuthHeaders());
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
            await axios.delete(`${API_URL}/resume/skill/${id}`, getAuthHeaders());
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
            await axios.post(`${API_URL}/resume/category`, category, getAuthHeaders());
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
            await axios.put(`${API_URL}/resume/category/${id}`, category, getAuthHeaders());
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
            await axios.delete(`${API_URL}/resume/category/${id}`, getAuthHeaders());
            await fetchCategories();
            await fetchResume();
            showSuccess('Category deleted');
        } catch (err) {
            showError('Failed to delete category');
        }
    };

    // ============================================
    // AI Settings & Operations
    // ============================================

    const updateAiSettings = async (settings: AiSettingsDto) => {
        setIsSaving(true);
        try {
            await axios.put(`${API_URL}/ai/settings`, settings, getAuthHeaders());
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
            const response = await axios.post(`${API_URL}/ai/test`, {}, getAuthHeaders());
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
            const response = await axios.post(`${API_URL}/ai/organize-skills`, {
                skills: resumeData.skills.map(s => ({ id: s.id, name: s.name, level: s.level }))
            }, getAuthHeaders());

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
            const response = await axios.post(`${API_URL}/ai/improve-text`, { text, context }, getAuthHeaders());
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

        // AI
        updateAiSettings,
        testAiConnection,
        organizeSkillsWithAi,
        improveTextWithAi
    };
};

// Legacy export for backward compatibility
export const useCvManagerModel = useResumeManagerModel;
export type CvTab = ResumeTab;
