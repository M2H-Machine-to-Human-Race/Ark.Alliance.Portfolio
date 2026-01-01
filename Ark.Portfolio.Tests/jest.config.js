/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>'],
    testMatch: [
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/*.spec.tsx',
        '**/*.test.tsx'
    ],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
            diagnostics: {
                ignoreCodes: [2322, 2786]
            }
        }]
    },
    transformIgnorePatterns: [
        'node_modules/(?!(lucide-react|framer-motion)/)'
    ],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': '<rootDir>/Mocks/styleMock.js',
        '^@ark/portfolio-share/(.*)$': '<rootDir>/../Ark.Portfolio.Share/$1',
        '^@ark/portfolio-share$': '<rootDir>/../Ark.Portfolio.Share/index.ts',
        '^@ui/(.*)$': '<rootDir>/../Ark.Portfolio.UI/src/$1',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/Mocks/fileMock.js'
    },
    collectCoverageFrom: [
        '**/*.ts',
        '**/*.tsx',
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
