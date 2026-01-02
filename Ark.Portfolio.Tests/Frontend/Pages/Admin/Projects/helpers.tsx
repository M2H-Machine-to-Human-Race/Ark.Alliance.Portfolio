/**
 * @fileoverview Admin Project Test Helpers
 * Common utility functions for Project Edit/Manager tests.
 * 
 * Responsibilities:
 * - Provide reusable render helpers
 * - Provide form interaction utilities
 * - Provide assertion helpers
 * 
 * @author Armand Richelet-Kleinberg
 * @module Frontend/Pages/Admin/Projects
 */

import React from 'react';
import { render, screen, RenderResult } from '@testing-library/react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

// Fix for React 18/Router v6 type mismatch
const MemoryRouter = Router as any;

// =============================================================================
// RENDER HELPERS
// =============================================================================

/**
 * Render options for test components
 */
export interface RenderWithRouterOptions {
    /** Initial route path */
    initialPath: string;
    /** Route pattern (e.g., '/admin/projects/edit/:id') */
    routePattern: string;
}

/**
 * Renders a component within a MemoryRouter with the specified route
 * 
 * @param component - React component to render
 * @param options - Router configuration options
 * @returns RenderResult from @testing-library/react
 * 
 * @example
 * ```typescript
 * renderWithRouter(<TestableProjectEditPage />, {
 *     initialPath: '/admin/projects/new',
 *     routePattern: '/admin/projects/new'
 * });
 * ```
 */
export function renderWithRouter(
    component: React.ReactElement,
    options: RenderWithRouterOptions
): RenderResult {
    return render(
        <MemoryRouter initialEntries={ [options.initialPath]} >
    <Routes>
    <Route path={ options.routePattern } element = { component } />
    </Routes>
    </MemoryRouter>
    );
}

/**
 * Renders a component within a simple MemoryRouter (no routes)
 * 
 * @param component - React component to render
 * @returns RenderResult from @testing-library/react
 */
export function renderWithSimpleRouter(
    component: React.ReactElement
): RenderResult {
    return render(
        <MemoryRouter>
        { component }
        </MemoryRouter>
    );
}

// =============================================================================
// ELEMENT GETTERS
// =============================================================================

/**
 * Gets an element by test ID with type safety
 * 
 * @param testId - The data-testid value
 * @returns HTMLElement
 * @throws Error if element not found
 */
export function getByTestId(testId: string): HTMLElement {
    return screen.getByTestId(testId);
}

/**
 * Queries an element by test ID (returns null if not found)
 * 
 * @param testId - The data-testid value
 * @returns HTMLElement | null
 */
export function queryByTestId(testId: string): HTMLElement | null {
    return screen.queryByTestId(testId);
}

/**
 * Gets all elements matching a test ID pattern
 * 
 * @param testId - The data-testid value
 * @returns HTMLElement[]
 */
export function getAllByTestId(testId: string): HTMLElement[] {
    return screen.getAllByTestId(testId);
}

// =============================================================================
// ASSERTION HELPERS
// =============================================================================

/**
 * Asserts that an input element has a specific value
 * 
 * @param testId - The data-testid of the input
 * @param expectedValue - Expected input value
 */
export function expectInputValue(testId: string, expectedValue: string): void {
    const input = screen.getByTestId(testId) as HTMLInputElement;
    expect(input.value).toBe(expectedValue);
}

/**
 * Asserts that an element with the given test ID exists
 * 
 * @param testId - The data-testid value
 */
export function expectElementExists(testId: string): void {
    expect(screen.getByTestId(testId)).toBeInTheDocument();
}

/**
 * Asserts that an element with the given test ID does NOT exist
 * 
 * @param testId - The data-testid value
 */
export function expectElementNotExists(testId: string): void {
    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
}

// =============================================================================
// MOCK HELPERS
// =============================================================================

/**
 * Creates a mock navigate function
 * 
 * @returns jest.Mock configured for navigation testing
 */
export function createMockNavigate(): jest.Mock {
    return jest.fn();
}

/**
 * Creates a mock showToast function
 * 
 * @returns jest.Mock configured for toast testing
 */
export function createMockShowToast(): jest.Mock {
    return jest.fn();
}

/**
 * Creates a mock API client with all methods
 * 
 * @returns Object with mocked get, post, put, delete methods
 */
export function createMockApiClient(): {
    get: jest.Mock;
    post: jest.Mock;
    put: jest.Mock;
    delete: jest.Mock;
} {
    return {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn()
    };
}

/**
 * Resets all mock functions in an object
 * 
 * @param mocks - Object containing jest.Mock functions
 */
export function resetMocks(mocks: Record<string, jest.Mock>): void {
    Object.values(mocks).forEach(mock => {
        if (typeof mock.mockReset === 'function') {
            mock.mockReset();
        }
    });
}
