/**
 * @fileoverview TimelineV2 ViewModel
 * Manages timeline state, filtering, and search.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useState, useMemo, useCallback } from 'react';

/**
 * Timeline item category
 */
export type TimelineCategory = 'experience' | 'education' | 'achievement' | 'all';

/**
 * Timeline item structure
 */
export interface TimelineItem {
    id: number | string;
    type: 'experience' | 'education' | 'achievement';
    title: string;
    organization: string;
    location?: string;
    startDate: string;
    endDate?: string;
    isCurrent?: boolean;
    description: string;
    highlights?: string[];
    imageUrl?: string;
    skills?: string[];
}

/**
 * TimelineV2 ViewModel configuration
 */
export interface TimelineV2Config {
    items: TimelineItem[];
    initialCategory?: TimelineCategory;
    showAdmin?: boolean;
    onEdit?: (item: TimelineItem) => void;
}

/**
 * TimelineV2 ViewModel state
 */
export interface TimelineV2Model {
    /** All timeline items */
    allItems: TimelineItem[];
    /** Filtered items based on category and search */
    filteredItems: TimelineItem[];
    /** Current category filter */
    category: TimelineCategory;
    /** Current search query */
    searchQuery: string;
    /** Available categories */
    categories: { id: TimelineCategory; label: string; count: number }[];
    /** Is admin mode enabled */
    showAdmin: boolean;

    // Actions
    setCategory: (category: TimelineCategory) => void;
    setSearchQuery: (query: string) => void;
    handleEdit: (item: TimelineItem) => void;
    clearFilters: () => void;
}

/**
 * Parse date string for sorting
 */
const parseDate = (dateStr: string): Date => {
    return new Date(dateStr);
};

/**
 * TimelineV2 ViewModel hook
 */
export const useTimelineV2Model = (config: TimelineV2Config): TimelineV2Model => {
    const {
        items,
        initialCategory = 'all',
        showAdmin = false,
        onEdit,
    } = config;

    const [category, setCategory] = useState<TimelineCategory>(initialCategory);
    const [searchQuery, setSearchQuery] = useState('');

    // Sort items by date (most recent first)
    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const dateA = parseDate(a.startDate);
            const dateB = parseDate(b.startDate);
            return dateB.getTime() - dateA.getTime();
        });
    }, [items]);

    // Calculate category counts
    const categories = useMemo(() => {
        const counts = {
            experience: 0,
            education: 0,
            achievement: 0,
        };

        items.forEach(item => {
            counts[item.type]++;
        });

        return [
            { id: 'all' as TimelineCategory, label: 'All', count: items.length },
            { id: 'experience' as TimelineCategory, label: 'Experience', count: counts.experience },
            { id: 'education' as TimelineCategory, label: 'Education', count: counts.education },
            { id: 'achievement' as TimelineCategory, label: 'Achievements', count: counts.achievement },
        ];
    }, [items]);

    // Filter items based on category and search
    const filteredItems = useMemo(() => {
        let result = sortedItems;

        // Filter by category
        if (category !== 'all') {
            result = result.filter(item => item.type === category);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.organization.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                (item.skills && item.skills.some(skill =>
                    skill.toLowerCase().includes(query)
                ))
            );
        }

        return result;
    }, [sortedItems, category, searchQuery]);

    const handleEdit = useCallback((item: TimelineItem) => {
        if (onEdit) {
            onEdit(item);
        }
    }, [onEdit]);

    const clearFilters = useCallback(() => {
        setCategory('all');
        setSearchQuery('');
    }, []);

    return {
        allItems: items,
        filteredItems,
        category,
        searchQuery,
        categories,
        showAdmin,
        setCategory,
        setSearchQuery,
        handleEdit,
        clearFilters,
    };
};

export default useTimelineV2Model;
