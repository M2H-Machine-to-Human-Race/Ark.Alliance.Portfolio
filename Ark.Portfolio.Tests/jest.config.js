/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>'],
    testMatch: [
        '**/*.spec.ts',
        '**/*.test.ts'
    ],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'tsconfig.json'
        }]
    },
    collectCoverageFrom: [
        '**/*.ts',
        '!**/*.d.ts',
        '!**/node_modules/**',
        '!**/dist/**'
    ],
    coverageDirectory: './coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    setupFilesAfterEnv: ['<rootDir>/setup.ts'],
    verbose: true,
    testTimeout: 10000
};
