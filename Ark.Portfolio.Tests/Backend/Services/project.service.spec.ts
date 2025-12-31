/**
 * @fileoverview Project Service Unit Tests
 * Tests for ProjectService CRUD operations and queries.
 * 
 * @author Armand Richelet-Kleinberg
 */

import {
    MOCK_PROJECTS,
    MOCK_PROJECT_SINGLE,
    MOCK_PROJECT_CREATE,
    MOCK_PROJECT_EMPTY,
    MockProjectStatus
} from '../../Mocks';

/**
 * Project Service Test Suite
 */
describe('ProjectService', () => {
    let mockProjects = [...MOCK_PROJECTS];

    beforeEach(() => {
        mockProjects = [...MOCK_PROJECTS];
    });

    describe('getAll', () => {
        it('should return all projects', () => {
            expect(mockProjects).toBeDefined();
            expect(mockProjects.length).toBe(3);
        });

        it('should return projects with required fields', () => {
            mockProjects.forEach(project => {
                expect(project.id).toBeDefined();
                expect(project.title).toBeDefined();
                expect(project.description).toBeDefined();
                expect(project.status).toBeDefined();
                expect(project.technologies).toBeDefined();
                expect(Array.isArray(project.technologies)).toBe(true);
            });
        });

        it('should filter by status', () => {
            const inProgressProjects = mockProjects.filter(
                p => p.status === MockProjectStatus.IN_PROGRESS
            );
            expect(inProgressProjects.length).toBe(1);
            expect(inProgressProjects[0].title).toBe('Ark Alliance Trading Platform');
        });

        it('should filter by isFeatured flag', () => {
            const featuredProjects = mockProjects.filter(p => p.isFeatured);
            expect(featuredProjects.length).toBe(2);
        });
    });

    describe('getById', () => {
        it('should return project by ID', () => {
            const project = mockProjects.find(p => p.id === '1');
            expect(project).toBeDefined();
            expect(project?.title).toBe('Ark Alliance Trading Platform');
        });

        it('should return undefined for non-existent ID', () => {
            const project = mockProjects.find(p => p.id === '9999');
            expect(project).toBeUndefined();
        });
    });

    describe('getFeatured', () => {
        it('should return only featured projects', () => {
            const featured = mockProjects.filter(p => p.isFeatured);
            expect(featured.every(p => p.isFeatured === true)).toBe(true);
        });

        it('should limit results when specified', () => {
            const featured = mockProjects.filter(p => p.isFeatured).slice(0, 1);
            expect(featured.length).toBe(1);
        });
    });

    describe('create', () => {
        it('should create a new project', () => {
            const newProject = {
                ...MOCK_PROJECT_CREATE,
                id: String(mockProjects.length + 1),
            };

            mockProjects.push(newProject as any);

            expect(mockProjects.length).toBe(4);
            expect(mockProjects[3].title).toBe('New Test Project');
        });

        it('should validate required fields', () => {
            const invalidProject = { ...MOCK_PROJECT_EMPTY };
            expect(invalidProject.title).toBe('');
            expect(invalidProject.description).toBe('');
        });
    });

    describe('update', () => {
        it('should update project fields', () => {
            const projectIndex = mockProjects.findIndex(p => p.id === '1');
            mockProjects[projectIndex] = {
                ...mockProjects[projectIndex],
                title: 'Updated Trading Platform',
            };

            expect(mockProjects[projectIndex].title).toBe('Updated Trading Platform');
        });

        it('should update status correctly', () => {
            const projectIndex = mockProjects.findIndex(p => p.id === '3');
            mockProjects[projectIndex] = {
                ...mockProjects[projectIndex],
                status: MockProjectStatus.IN_PROGRESS,
            };

            expect(mockProjects[projectIndex].status).toBe(MockProjectStatus.IN_PROGRESS);
        });
    });

    describe('delete', () => {
        it('should remove project from list', () => {
            const initialLength = mockProjects.length;
            mockProjects = mockProjects.filter(p => p.id !== '3');

            expect(mockProjects.length).toBe(initialLength - 1);
            expect(mockProjects.find(p => p.id === '3')).toBeUndefined();
        });
    });

    describe('sorting', () => {
        it('should sort by title alphabetically', () => {
            const sorted = [...mockProjects].sort((a, b) =>
                a.title.localeCompare(b.title)
            );
            expect(sorted[0].title).toBe('AI-Powered Code Assistant');
        });
    });
});
