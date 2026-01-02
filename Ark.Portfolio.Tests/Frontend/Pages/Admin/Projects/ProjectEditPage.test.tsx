/**
 * @fileoverview ProjectEditPage Tests
 * Tests the Project Edit Page view layer functionality.
 * 
 * Tests Cover:
 * - Create mode (new project form)
 * - Edit mode (existing project form)
 * - Form submission and validation
 * - Error handling
 * - Navigation behavior
 * 
 * @author Armand Richelet-Kleinberg
 * @module Frontend/Pages/Admin/Projects
 */

import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { ProjectStatus } from '@ark/portfolio-share';

// Import test infrastructure from index
import {
    TestableProjectEditPage,
    renderWithRouter,
    createMockApiClient,
    createMockNavigate,
    createMockShowToast,
    ROUTE_PROJECT_NEW,
    ROUTE_PROJECT_EDIT,
    ROUTE_PROJECT_LIST,
    EDIT_PAGE_TEST_IDS,
    TOAST_MESSAGES,
    MOCK_FORM_DATA_EXISTING,
    MOCK_CREATE_RESPONSE,
    IMockApiClient,
} from './index';

// =============================================================================
// TEST SETUP
// =============================================================================

describe('ProjectEditPage', () => {
    /** Mock API client instance */
    let mockApiClient: IMockApiClient;

    /** Mock navigation function */
    let mockNavigate: jest.Mock;

    /** Mock toast function */
    let mockShowToast: jest.Mock;

    /**
     * Reset all mocks before each test
     */
    beforeEach(() => {
        mockApiClient = createMockApiClient();
        mockNavigate = createMockNavigate();
        mockShowToast = createMockShowToast();
    });

    /**
     * Renders the component with required router context
     * @param path - Initial route path
     * @param pattern - Route pattern to match
     */
    const renderComponent = (path: string, pattern: string) => {
        return renderWithRouter(
            <TestableProjectEditPage
                apiClient={mockApiClient}
                navigate={mockNavigate}
                showToast={mockShowToast}
            />,
            { initialPath: path, routePattern: pattern }
        );
    };

    // =========================================================================
    // CREATE MODE TESTS
    // =========================================================================

    describe('Create Mode', () => {
        it('renders empty form for new project', () => {
            renderComponent(ROUTE_PROJECT_NEW, ROUTE_PROJECT_NEW);

            expect(screen.getByText('Create New Project')).toBeInTheDocument();
            expect(screen.getByTestId(EDIT_PAGE_TEST_IDS.TITLE_INPUT)).toHaveValue('');
            expect(screen.getByTestId(EDIT_PAGE_TEST_IDS.DESCRIPTION_INPUT)).toHaveValue('');
            expect(screen.getByTestId(EDIT_PAGE_TEST_IDS.PACKAGE_URL_INPUT)).toHaveValue('');
        });

        it('renders Create Project button', () => {
            renderComponent(ROUTE_PROJECT_NEW, ROUTE_PROJECT_NEW);

            expect(screen.getByTestId(EDIT_PAGE_TEST_IDS.SUBMIT_BUTTON))
                .toHaveTextContent('Create Project');
        });

        it('submits new project successfully', async () => {
            mockApiClient.post.mockResolvedValue(MOCK_CREATE_RESPONSE);
            renderComponent(ROUTE_PROJECT_NEW, ROUTE_PROJECT_NEW);

            // Fill form
            fireEvent.change(screen.getByTestId(EDIT_PAGE_TEST_IDS.TITLE_INPUT), {
                target: { value: 'New Project' }
            });
            fireEvent.change(screen.getByTestId(EDIT_PAGE_TEST_IDS.DESCRIPTION_INPUT), {
                target: { value: 'Description' }
            });
            fireEvent.change(screen.getByTestId(EDIT_PAGE_TEST_IDS.PACKAGE_URL_INPUT), {
                target: { value: 'https://npmjs.com/package/test' }
            });

            // Submit
            fireEvent.click(screen.getByTestId(EDIT_PAGE_TEST_IDS.SUBMIT_BUTTON));

            await waitFor(() => {
                expect(mockApiClient.post).toHaveBeenCalledWith(
                    '/api/admin/projects',
                    expect.objectContaining({
                        title: 'New Project',
                        description: 'Description',
                        packageUrl: 'https://npmjs.com/package/test'
                    })
                );
                expect(mockShowToast).toHaveBeenCalledWith(
                    TOAST_MESSAGES.CREATE_SUCCESS,
                    'success'
                );
                expect(mockNavigate).toHaveBeenCalledWith(ROUTE_PROJECT_LIST);
            });
        });

        it('handles back button navigation', () => {
            renderComponent(ROUTE_PROJECT_NEW, ROUTE_PROJECT_NEW);

            fireEvent.click(screen.getByTestId(EDIT_PAGE_TEST_IDS.BACK_BUTTON));
            expect(mockNavigate).toHaveBeenCalledWith(ROUTE_PROJECT_LIST);
        });

        it('handles cancel button navigation', () => {
            renderComponent(ROUTE_PROJECT_NEW, ROUTE_PROJECT_NEW);

            fireEvent.click(screen.getByTestId(EDIT_PAGE_TEST_IDS.CANCEL_BUTTON));
            expect(mockNavigate).toHaveBeenCalledWith(ROUTE_PROJECT_LIST);
        });
    });

    // =========================================================================
    // EDIT MODE TESTS
    // =========================================================================

    describe('Edit Mode', () => {
        const mockProject = {
            id: '1',
            ...MOCK_FORM_DATA_EXISTING,
        };

        it('loads and displays existing project data', async () => {
            mockApiClient.get.mockResolvedValue(mockProject);
            renderComponent(`${ROUTE_PROJECT_EDIT}/1`, `${ROUTE_PROJECT_EDIT}/:id`);

            await waitFor(() => {
                expect(screen.getByTestId(EDIT_PAGE_TEST_IDS.TITLE_INPUT))
                    .toHaveValue('Existing Project');
                expect(screen.getByTestId(EDIT_PAGE_TEST_IDS.DESCRIPTION_INPUT))
                    .toHaveValue('Existing project description for edit testing.');
                expect(screen.getByTestId(EDIT_PAGE_TEST_IDS.PACKAGE_URL_INPUT))
                    .toHaveValue('https://npmjs.com/package/existing');
            });
        });

        it('renders Edit Project header', async () => {
            mockApiClient.get.mockResolvedValue(mockProject);
            renderComponent(`${ROUTE_PROJECT_EDIT}/1`, `${ROUTE_PROJECT_EDIT}/:id`);

            await waitFor(() => {
                expect(screen.getByText('Edit Project')).toBeInTheDocument();
            });
        });

        it('renders Save Changes button', async () => {
            mockApiClient.get.mockResolvedValue(mockProject);
            renderComponent(`${ROUTE_PROJECT_EDIT}/1`, `${ROUTE_PROJECT_EDIT}/:id`);

            await waitFor(() => {
                expect(screen.getByTestId(EDIT_PAGE_TEST_IDS.SUBMIT_BUTTON))
                    .toHaveTextContent('Save Changes');
            });
        });

        it('updates existing project successfully', async () => {
            mockApiClient.get.mockResolvedValue(mockProject);
            mockApiClient.put.mockResolvedValue({ ...mockProject, title: 'Updated Title' });
            renderComponent(`${ROUTE_PROJECT_EDIT}/1`, `${ROUTE_PROJECT_EDIT}/:id`);

            // Wait for load
            await waitFor(() => {
                expect(screen.getByTestId(EDIT_PAGE_TEST_IDS.TITLE_INPUT))
                    .toHaveValue('Existing Project');
            });

            // Modify title
            fireEvent.change(screen.getByTestId(EDIT_PAGE_TEST_IDS.TITLE_INPUT), {
                target: { value: 'Updated Title' }
            });

            // Save
            fireEvent.click(screen.getByTestId(EDIT_PAGE_TEST_IDS.SUBMIT_BUTTON));

            await waitFor(() => {
                expect(mockApiClient.put).toHaveBeenCalledWith(
                    '/api/admin/projects/1',
                    expect.objectContaining({ title: 'Updated Title' })
                );
                expect(mockShowToast).toHaveBeenCalledWith(
                    TOAST_MESSAGES.UPDATE_SUCCESS,
                    'success'
                );
                expect(mockNavigate).toHaveBeenCalledWith(ROUTE_PROJECT_LIST);
            });
        });

        it('shows loading state while fetching project', async () => {
            mockApiClient.get.mockImplementation(
                () => new Promise(resolve => setTimeout(() => resolve(mockProject), 100))
            );
            renderComponent(`${ROUTE_PROJECT_EDIT}/1`, `${ROUTE_PROJECT_EDIT}/:id`);

            expect(screen.getByTestId(EDIT_PAGE_TEST_IDS.LOADING)).toBeInTheDocument();
            expect(screen.getByText('Loading project...')).toBeInTheDocument();
        });
    });

    // =========================================================================
    // ERROR HANDLING TESTS
    // =========================================================================

    describe('Error Handling', () => {
        it('shows error toast when project load fails', async () => {
            mockApiClient.get.mockRejectedValue(new Error('Network error'));
            renderComponent(`${ROUTE_PROJECT_EDIT}/1`, `${ROUTE_PROJECT_EDIT}/:id`);

            await waitFor(() => {
                expect(mockShowToast).toHaveBeenCalledWith(
                    TOAST_MESSAGES.LOAD_ERROR,
                    'error'
                );
                expect(mockNavigate).toHaveBeenCalledWith(ROUTE_PROJECT_LIST);
            });
        });

        it('shows error toast when save fails', async () => {
            mockApiClient.post.mockRejectedValue(new Error('Save failed'));
            renderComponent(ROUTE_PROJECT_NEW, ROUTE_PROJECT_NEW);

            // Fill required fields
            fireEvent.change(screen.getByTestId(EDIT_PAGE_TEST_IDS.TITLE_INPUT), {
                target: { value: 'Test' }
            });
            fireEvent.change(screen.getByTestId(EDIT_PAGE_TEST_IDS.DESCRIPTION_INPUT), {
                target: { value: 'Test desc' }
            });

            // Submit
            fireEvent.click(screen.getByTestId(EDIT_PAGE_TEST_IDS.SUBMIT_BUTTON));

            await waitFor(() => {
                expect(mockShowToast).toHaveBeenCalledWith(
                    TOAST_MESSAGES.SAVE_ERROR,
                    'error'
                );
            });
        });
    });
});
