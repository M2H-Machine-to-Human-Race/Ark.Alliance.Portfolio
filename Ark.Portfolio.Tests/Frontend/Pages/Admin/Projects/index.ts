/**
 * @fileoverview Admin Projects Test Module Index
 * Central export for all Admin/Projects test infrastructure.
 * 
 * Responsibilities:
 * - Provide single import point for tests
 * - Export all interfaces, constants, helpers, and mocks
 * - Export testable components
 * 
 * @author Armand Richelet-Kleinberg
 * @module Frontend/Pages/Admin/Projects
 */

// =============================================================================
// INTERFACES
// =============================================================================

export type {
    IProjectFormData,
    IProjectListItem,
    IProjectManagerModelReturn,
    IMockApiClient,
} from './interfaces';

// =============================================================================
// CONSTANTS
// =============================================================================

export {
    API_BASE_URL,
    API_CREATE_PROJECT,
    getProjectEndpoint,
    ROUTE_PROJECT_NEW,
    ROUTE_PROJECT_EDIT,
    ROUTE_PROJECT_LIST,
    getEditRoute,
    DEFAULT_FORM_DATA,
    EDIT_PAGE_TEST_IDS,
    MANAGER_TEST_IDS,
    TOAST_MESSAGES,
} from './constants';

// =============================================================================
// HELPERS
// =============================================================================

export {
    renderWithRouter,
    renderWithSimpleRouter,
    getByTestId,
    queryByTestId,
    getAllByTestId,
    expectInputValue,
    expectElementExists,
    expectElementNotExists,
    createMockNavigate,
    createMockShowToast,
    createMockApiClient,
    resetMocks,
} from './helpers';

export type { RenderWithRouterOptions } from './helpers';

// =============================================================================
// MOCKS
// =============================================================================

export {
    MOCK_PROJECT_WITH_PACKAGE,
    MOCK_PROJECT_APP,
    MOCK_PROJECT_MINIMAL,
    MOCK_PROJECT_FEATURED,
    MOCK_PROJECT_LIST,
    MOCK_FORM_DATA_EXISTING,
    MOCK_FORM_DATA_NEW,
    MOCK_CREATE_RESPONSE,
    MOCK_UPDATE_RESPONSE,
    MOCK_ERROR_RESPONSE,
} from './mocks';

// =============================================================================
// TESTABLE COMPONENTS
// =============================================================================

export { TestableProjectEditPage } from './TestableProjectEditPage';
export type { TestableProjectEditPageProps } from './TestableProjectEditPage';

export { TestableProjectManager } from './TestableProjectManager';
export type { TestableProjectManagerProps } from './TestableProjectManager';
