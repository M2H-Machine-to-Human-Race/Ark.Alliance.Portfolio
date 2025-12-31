/**
 * @fileoverview Static Data Context
 * Provides pre-fetched data for static builds without API calls.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { ProfileDto, ProjectDto, ExperienceDto, SkillDto } from '@ark/portfolio-share';

/**
 * Static portfolio data structure
 */
export interface StaticPortfolioData {
    profile: ProfileDto | null;
    projects: ProjectDto[];
    experiences: ExperienceDto[];
    skills: SkillDto[];
    generatedAt: string;
}

/**
 * Context for static data
 */
const StaticDataContext = createContext<StaticPortfolioData | null>(null);

/**
 * Props for StaticDataProvider
 */
interface StaticDataProviderProps {
    data: StaticPortfolioData;
    children: ReactNode;
}

/**
 * Provider component for static data
 */
export const StaticDataProvider: React.FC<StaticDataProviderProps> = ({ data, children }) => {
    return (
        <StaticDataContext.Provider value={data}>
            {children}
        </StaticDataContext.Provider>
    );
};

/**
 * Hook to access static data
 */
export const useStaticData = (): StaticPortfolioData => {
    const context = useContext(StaticDataContext);
    if (!context) {
        throw new Error('useStaticData must be used within a StaticDataProvider');
    }
    return context;
};

/**
 * Check if we're in static mode
 */
export const isStaticMode = (): boolean => {
    return typeof (window as any).__STATIC_DATA__ !== 'undefined';
};

/**
 * Get embedded static data from window
 */
export const getEmbeddedStaticData = (): StaticPortfolioData | null => {
    return (window as any).__STATIC_DATA__ || null;
};
