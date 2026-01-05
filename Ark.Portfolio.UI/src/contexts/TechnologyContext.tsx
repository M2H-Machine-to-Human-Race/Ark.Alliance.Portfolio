/**
 * @fileoverview Technology Context
 * Provides global access to technology master data for the application
 * 
 * @module contexts/TechnologyContext
 * @author Armand Richelet-Kleinberg
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TechnologyDto, TechnologiesResponseDto } from '@ark/portfolio-share';
import { apiClient } from '../api/client';

interface TechnologyContextValue {
    technologies: TechnologyDto[];
    categories: any[];
    getTechnologyByKey: (key: string) => TechnologyDto | undefined;
    isLoading: boolean;
    error: string | null;
}

const TechnologyContext = createContext<TechnologyContextValue | undefined>(undefined);

interface TechnologyProviderProps {
    children: ReactNode;
}

/**
 * Technology Provider Component
 * Loads all technologies on mount and provides lookup functionality
 */
export const TechnologyProvider: React.FC<TechnologyProviderProps> = ({ children }) => {
    const [data, setData] = useState<TechnologiesResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTechnologies = async () => {
            try {
                setIsLoading(true);
                const data = await apiClient.get<TechnologiesResponseDto>('/technologies');
                setData(data);
                setError(null);
            } catch (err) {
                console.error('Failed to load technologies:', err);
                setError('Failed to load technologies');
            } finally {
                setIsLoading(false);
            }
        };

        loadTechnologies();
    }, []);

    const getTechnologyByKey = (key: string): TechnologyDto | undefined => {
        // First try exact key match
        let found = data?.technologies.find(t => t.key === key);
        // If not found, try case-insensitive key match
        if (!found) {
            found = data?.technologies.find(t => t.key?.toLowerCase() === key?.toLowerCase());
        }
        // If still not found, try name match (case-insensitive)
        if (!found) {
            found = data?.technologies.find(t => t.name?.toLowerCase() === key?.toLowerCase());
        }
        return found;
    };

    const value: TechnologyContextValue = {
        technologies: data?.technologies || [],
        categories: data?.categories || [],
        getTechnologyByKey,
        isLoading,
        error
    };

    return (
        <TechnologyContext.Provider value={value}>
            {children}
        </TechnologyContext.Provider>
    );
};

/**
 * Hook to access technology context
 * @throws Error if used outside TechnologyProvider
 */
export const useTechnologyContext = () => {
    const context = useContext(TechnologyContext);
    if (!context) {
        throw new Error('useTechnologyContext must be used within TechnologyProvider');
    }
    return context;
};
