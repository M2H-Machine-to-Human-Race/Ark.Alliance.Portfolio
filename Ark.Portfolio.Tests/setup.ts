/**
 * @fileoverview Jest Test Setup
 * Global setup for all tests including mocks and utilities.
 * 
 * @author Armand Richelet-Kleinberg
 */

// Extend Jest matchers if needed
// import '@testing-library/jest-dom';

// Mock console methods to reduce noise in tests
global.console = {
    ...console,
    // Uncomment to suppress logs during tests
    // log: jest.fn(),
    // debug: jest.fn(),
    // info: jest.fn(),
    // warn: jest.fn(),
    error: jest.fn(),
};

// Global test utilities
export { };
