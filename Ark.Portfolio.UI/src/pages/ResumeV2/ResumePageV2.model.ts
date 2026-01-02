/**
 * @fileoverview ResumePageV2 ViewModel
 * Manages resume data, timeline items, and skills visualization.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { resumeService } from '../../services/resume.service';
import { TimelineItem } from '../../components/TimelineV2';

/**
 * Skill data with category and proficiency
 */
export interface SkillData {
    id: number | string;
    name: string;
    category: string;
    proficiency?: number; // 0-100
    yearsOfExperience?: number;
}

/**
 * Skill category with grouped skills
 */
export interface SkillCategory {
    id: string;
    name: string;
    icon: string;
    gradient: string;
    skills: SkillData[];
}

/**
 * ResumePageV2 ViewModel state
 */
export interface ResumePageV2Model {
    /** Is data loading */
    isLoading: boolean;
    /** Error message if any */
    error: string | null;
    /** Timeline items for Experience */
    experienceItems: TimelineItem[];
    /** Timeline items for Education */
    educationItems: TimelineItem[];
    /** All timeline items combined */
    allTimelineItems: TimelineItem[];
    /** Skill categories with skills */
    skillCategories: SkillCategory[];
    /** Profile summary */
    profileSummary: string | null;
    /** Is admin mode */
    isAdmin: boolean;

    // Actions
    refetch: () => void;
    handleEditTimeline: (item: TimelineItem) => void;
}

/**
 * Map experience data to timeline items
 */
const mapExperience = (exp: any): TimelineItem => ({
    id: exp.id || Math.random(),
    type: 'experience',
    title: exp.position || exp.title,
    organization: exp.company || exp.organization,
    location: exp.location,
    startDate: exp.startDate,
    endDate: exp.endDate,
    isCurrent: !exp.endDate,
    description: exp.description || '',
    highlights: exp.highlights || [],
    skills: exp.technologies || exp.skills || [],
});

/**
 * Map education data to timeline items
 */
const mapEducation = (edu: any): TimelineItem => ({
    id: edu.id || Math.random(),
    type: 'education',
    title: edu.degree || edu.title,
    organization: edu.institution || edu.school,
    location: edu.location,
    startDate: edu.startDate,
    endDate: edu.endDate,
    isCurrent: !edu.endDate,
    description: edu.description || edu.fieldOfStudy || '',
    highlights: edu.achievements || [],
    skills: [],
});

/**
 * Default skill categories with gradients
 */
const createSkillCategories = (skills: any[]): SkillCategory[] => {
    const categories: { [key: string]: SkillData[] } = {
        'Backend': [],
        'Frontend': [],
        'DevOps': [],
        'Database': [],
        'Specialized': [],
        'Other': [],
    };

    skills.forEach(skill => {
        const cat = skill.category || 'Other';
        if (!categories[cat]) {
            categories[cat] = [];
        }
        categories[cat].push({
            id: skill.id || skill.name,
            name: skill.name,
            category: cat,
            proficiency: skill.proficiency || skill.level || 80,
            yearsOfExperience: skill.yearsOfExperience,
        });
    });

    const categoryConfig: { [key: string]: { icon: string; gradient: string } } = {
        'Backend': { icon: 'Server', gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' },
        'Frontend': { icon: 'Monitor', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' },
        'DevOps': { icon: 'Cloud', gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' },
        'Database': { icon: 'Database', gradient: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' },
        'Specialized': { icon: 'Cpu', gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' },
        'Other': { icon: 'Wrench', gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)' },
    };

    return Object.entries(categories)
        .filter(([_, skills]) => skills.length > 0)
        .map(([name, skills]) => ({
            id: name.toLowerCase(),
            name,
            icon: categoryConfig[name]?.icon || 'Wrench',
            gradient: categoryConfig[name]?.gradient || categoryConfig['Other'].gradient,
            skills: skills.sort((a, b) => (b.proficiency || 0) - (a.proficiency || 0)),
        }));
};

/**
 * ResumePageV2 ViewModel hook
 */
export const useResumePageV2Model = (): ResumePageV2Model => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [experienceItems, setExperienceItems] = useState<TimelineItem[]>([]);
    const [educationItems, setEducationItems] = useState<TimelineItem[]>([]);
    const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
    const [profileSummary, setProfileSummary] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const cvData = await resumeService.getResume();

            // Map experiences
            const experiences = (cvData.experiences || []).map(mapExperience);
            setExperienceItems(experiences);

            // Map education
            const education = (cvData.education || []).map(mapEducation);
            setEducationItems(education);

            // Map skills
            const categories = createSkillCategories(cvData.skills || []);
            setSkillCategories(categories);

            // Profile summary (if available)
            if (cvData.profile?.overview) {
                setProfileSummary(cvData.profile.overview);
            }

            // Check admin status
            const token = localStorage.getItem('auth_token');
            setIsAdmin(!!token);

        } catch (err) {
            setError('Failed to load resume data');
            console.error('Resume fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Combine timeline items
    const allTimelineItems = useMemo(() => {
        return [...experienceItems, ...educationItems];
    }, [experienceItems, educationItems]);

    const handleEditTimeline = useCallback((item: TimelineItem) => {
        // Navigate to admin edit page
        const type = item.type === 'experience' ? 'experience' : 'education';
        window.location.href = `/admin/resume?edit=${type}&id=${item.id}`;
    }, []);

    return {
        isLoading,
        error,
        experienceItems,
        educationItems,
        allTimelineItems,
        skillCategories,
        profileSummary,
        isAdmin,
        refetch: fetchData,
        handleEditTimeline,
    };
};

export default useResumePageV2Model;
