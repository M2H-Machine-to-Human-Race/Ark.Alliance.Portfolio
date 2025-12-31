/**
 * @fileoverview Project Mock Data
 * Realistic mock data for Project entity testing.
 * Uses inline types to avoid Share layer compilation issues.
 * 
 * @author Armand Richelet-Kleinberg
 */

/**
 * Project status enum (mirroring Share layer)
 */
export enum MockProjectStatus {
    PLANNING = 'PLANNING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    ON_HOLD = 'ON_HOLD',
    CANCELLED = 'CANCELLED',
}

/**
 * Mock project interface (matches ProjectDto)
 */
export interface MockProjectDto {
    id?: string;
    title: string;
    description: string;
    status: MockProjectStatus;
    isFeatured?: boolean;
    technologies: string[];
    imageUrl?: string;
    liveUrl?: string;
    repoUrl?: string;
    startDate?: string;
    endDate?: string;
}

/**
 * Complete list of mock projects
 */
export const MOCK_PROJECTS: MockProjectDto[] = [
    {
        id: '1',
        title: 'Ark Alliance Trading Platform',
        description: 'A comprehensive cryptocurrency trading platform with real-time market data, automated trading strategies, and portfolio management.',
        status: MockProjectStatus.IN_PROGRESS,
        isFeatured: true,
        technologies: ['React', 'TypeScript', 'Node.js'],
        imageUrl: '/images/projects/trading-platform-thumb.png',
        liveUrl: 'https://trading.arkalliance.com',
        repoUrl: 'https://github.com/ark-alliance/trading-platform',
        startDate: '2023-01-15',
        endDate: undefined,
    },
    {
        id: '2',
        title: 'Personal Portfolio Website',
        description: 'Dynamic portfolio website built with React and Node.js, featuring admin panel, resume management, and project showcase.',
        status: MockProjectStatus.COMPLETED,
        isFeatured: true,
        technologies: ['React', 'TypeScript', 'Express'],
        imageUrl: '/images/projects/portfolio-thumb.png',
        liveUrl: 'https://portfolio.armand.dev',
        repoUrl: 'https://github.com/armand/portfolio',
        startDate: '2024-06-01',
        endDate: '2024-12-15',
    },
    {
        id: '3',
        title: 'AI-Powered Code Assistant',
        description: 'An intelligent coding assistant that uses LLMs to help developers write, review, and refactor code.',
        status: MockProjectStatus.PLANNING,
        isFeatured: false,
        technologies: ['Python', 'TypeScript'],
        imageUrl: '/images/projects/ai-assistant-thumb.png',
        liveUrl: undefined,
        repoUrl: 'https://github.com/armand/ai-assistant',
        startDate: '2025-01-01',
        endDate: undefined,
    },
];

/**
 * Single mock project for unit tests
 */
export const MOCK_PROJECT_SINGLE: MockProjectDto = MOCK_PROJECTS[0];

/**
 * Empty project for edge case testing
 */
export const MOCK_PROJECT_EMPTY: Partial<MockProjectDto> = {
    id: undefined,
    title: '',
    description: '',
    technologies: [],
};

/**
 * New project creation data (without id)
 */
export const MOCK_PROJECT_CREATE: Partial<MockProjectDto> = {
    title: 'New Test Project',
    description: 'A project created for testing purposes',
    status: MockProjectStatus.PLANNING,
    technologies: ['TypeScript'],
    isFeatured: false,
};
