/**
 * @fileoverview ProjectManager Tests
 * Tests the Project Manager view layer functionality.
 * 
 * Tests Cover:
 * - Loading and error states
 * - Project list rendering
 * - Featured projects and package links
 * - Navigation actions
 * - Delete functionality
 * 
 * @author Armand Richelet-Kleinberg
 * @module Frontend/Pages/Admin/Projects
 */

import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { ProjectStatus } from '@ark/portfolio-share';

// Import test infrastructure from index
import {
    TestableProjectManager,
    renderWithSimpleRouter,
    createMockNavigate,
    ROUTE_PROJECT_NEW,
    getEditRoute,
    MANAGER_TEST_IDS,
    MOCK_PROJECT_WITH_PACKAGE,
    MOCK_PROJECT_APP,
    MOCK_PROJECT_MINIMAL,
    MOCK_PROJECT_FEATURED,
    MOCK_PROJECT_LIST,
    IProjectManagerModelReturn,
} from './index';

// =============================================================================
// TEST SETUP
// =============================================================================

describe('ProjectManager', () => {
    /** Mock navigation function */
    let mockNavigate: jest.Mock;

    /** Mock model return value */
    let mockModel: IProjectManagerModelReturn;

    /**
     * Reset all mocks before each test
     */
    beforeEach(() => {
        mockNavigate = createMockNavigate();
        mockModel = {
            projects: [],
            isLoading: false,
            error: null,
            handleDelete: jest.fn(),
        };
    });

    /**
     * Renders the component with required router context
     */
    const renderComponent = () => {
        return renderWithSimpleRouter(
            <TestableProjectManager
                model={mockModel}
                navigate={mockNavigate}
            />
        );
    };

    // =========================================================================
    // LOADING STATE TESTS
    // =========================================================================

    describe('Loading State', () => {
        it('renders loading indicator when loading', () => {
            mockModel = { ...mockModel, isLoading: true };
            renderComponent();

            expect(screen.getByTestId(MANAGER_TEST_IDS.LOADING)).toBeInTheDocument();
            expect(screen.getByText('Loading projects...')).toBeInTheDocument();
        });

        it('does not render project grid when loading', () => {
            mockModel = { ...mockModel, isLoading: true };
            renderComponent();

            expect(screen.queryByTestId(MANAGER_TEST_IDS.GRID)).not.toBeInTheDocument();
        });
    });

    // =========================================================================
    // ERROR STATE TESTS
    // =========================================================================

    describe('Error State', () => {
        it('renders error message', () => {
            mockModel = { ...mockModel, error: 'Failed to load projects' };
            renderComponent();

            expect(screen.getByTestId(MANAGER_TEST_IDS.ERROR)).toBeInTheDocument();
            expect(screen.getByText('Failed to load projects')).toBeInTheDocument();
        });
    });

    // =========================================================================
    // PROJECT LIST TESTS
    // =========================================================================

    describe('Project List', () => {
        it('renders projects correctly', () => {
            mockModel = { ...mockModel, projects: MOCK_PROJECT_LIST };
            renderComponent();

            expect(screen.getByText('React Component Library')).toBeInTheDocument();
            expect(screen.getByText('Portfolio Application')).toBeInTheDocument();
            expect(screen.getByText('Minimal Project')).toBeInTheDocument();
        });

        it('renders project cards with correct test IDs', () => {
            mockModel = { ...mockModel, projects: MOCK_PROJECT_LIST };
            renderComponent();

            expect(screen.getByTestId(MANAGER_TEST_IDS.projectCard('1'))).toBeInTheDocument();
            expect(screen.getByTestId(MANAGER_TEST_IDS.projectCard('2'))).toBeInTheDocument();
            expect(screen.getByTestId(MANAGER_TEST_IDS.projectCard('3'))).toBeInTheDocument();
        });

        it('renders package link for projects with packageUrl', () => {
            mockModel = { ...mockModel, projects: [MOCK_PROJECT_WITH_PACKAGE] };
            renderComponent();

            const packageLink = screen.getByTestId(MANAGER_TEST_IDS.packageLink('1'));
            expect(packageLink).toBeInTheDocument();
            expect(packageLink).toHaveAttribute('href', MOCK_PROJECT_WITH_PACKAGE.packageUrl);
        });

        it('does not render package link for projects without packageUrl', () => {
            mockModel = { ...mockModel, projects: [MOCK_PROJECT_APP] };
            renderComponent();

            expect(screen.queryByTestId(MANAGER_TEST_IDS.packageLink('2'))).not.toBeInTheDocument();
        });

        it('renders featured badge for featured projects', () => {
            mockModel = { ...mockModel, projects: [MOCK_PROJECT_FEATURED] };
            renderComponent();

            expect(screen.getByText('★ Featured')).toBeInTheDocument();
        });

        it('does not render featured badge for non-featured projects', () => {
            mockModel = { ...mockModel, projects: [MOCK_PROJECT_APP] };
            renderComponent();

            expect(screen.queryByText('★ Featured')).not.toBeInTheDocument();
        });
    });

    // =========================================================================
    // NAVIGATION TESTS
    // =========================================================================

    describe('Navigation', () => {
        it('navigates to create page on Add Project click', () => {
            renderComponent();

            fireEvent.click(screen.getByTestId(MANAGER_TEST_IDS.ADD_BUTTON));
            expect(mockNavigate).toHaveBeenCalledWith(ROUTE_PROJECT_NEW);
        });

        it('navigates to edit page when clicking edit button', () => {
            mockModel = { ...mockModel, projects: [MOCK_PROJECT_WITH_PACKAGE] };
            renderComponent();

            fireEvent.click(screen.getByTestId(MANAGER_TEST_IDS.editButton('1')));
            expect(mockNavigate).toHaveBeenCalledWith(getEditRoute('1'));
        });
    });

    // =========================================================================
    // DELETE FUNCTIONALITY TESTS
    // =========================================================================

    describe('Delete Functionality', () => {
        it('calls handleDelete when delete button is clicked', () => {
            const mockDelete = jest.fn();
            mockModel = {
                ...mockModel,
                projects: [MOCK_PROJECT_WITH_PACKAGE],
                handleDelete: mockDelete,
            };
            renderComponent();

            fireEvent.click(screen.getByTestId(MANAGER_TEST_IDS.deleteButton('1')));
            expect(mockDelete).toHaveBeenCalledWith('1');
        });
    });

    // =========================================================================
    // HEADER TESTS
    // =========================================================================

    describe('Header', () => {
        it('renders page title', () => {
            renderComponent();

            expect(screen.getByText('All Projects')).toBeInTheDocument();
        });

        it('renders Add Project button', () => {
            renderComponent();

            expect(screen.getByTestId(MANAGER_TEST_IDS.ADD_BUTTON)).toBeInTheDocument();
            expect(screen.getByText('Add Project')).toBeInTheDocument();
        });
    });
});
