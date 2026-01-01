/**
 * @fileoverview Jest Test Setup
 * Global setup for all tests including mocks and utilities.
 */

// Extend Jest matchers
import '@testing-library/jest-dom';

// Mock console methods to reduce noise in tests
global.console = {
    ...console,
    error: jest.fn(),
};

export { };
