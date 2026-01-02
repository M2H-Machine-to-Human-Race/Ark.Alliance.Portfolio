/**
 * @fileoverview useTechnology Hook
 * Custom hook to fetch and use technology data
 * 
 * @module hooks/useTechnology
 * @author Armand Richelet-Kleinberg
 */

import { useTechnologyContext } from '../contexts/TechnologyContext';
import { TechnologyDto } from '@ark/portfolio-share';

/**
 * Custom hook to get technology data by key
 * 
 * @param key - Technology key (e.g., "react", "typescript")
 * @returns Technology object or undefined if not found
 * 
 * @example
 * ```tsx
 * const tech = useTechnology('react');
 * if (tech) {
 *   return <div style={{ color: tech.color }}>{tech.name}</div>;
 * }
 * ```
 */
export const useTechnology = (key: string): TechnologyDto | undefined => {
    const { getTechnologyByKey } = useTechnologyContext();
    return getTechnologyByKey(key);
};

/**
 * Hook to get all technologies
 */
export const useAllTechnologies = () => {
    const { technologies, categories, isLoading, error } = useTechnologyContext();
    return { technologies, categories, isLoading, error };
};
