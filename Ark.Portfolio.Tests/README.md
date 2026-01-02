# Ark.Portfolio.Tests

<div align="center">

![Tests](https://img.shields.io/badge/Tests-185%20Passing-brightgreen?style=for-the-badge&logo=jest)
![Coverage](https://img.shields.io/badge/Coverage-80%25+-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)

**Comprehensive Test Suite for the Ark.Portfolio Ecosystem**

*Unit Tests • Integration Tests • Component Tests • Accessibility Tests*

</div>

---

## 📊 Test Statistics

| Metric | Value | Description |
|--------|-------|-------------|
| **Test Suites** | 11 | Active test files |
| **Total Tests** | 185 | All passing ✅ |
| **Frontend Tests** | 185 | UI, Pages, Components |
| **Backend Tests** | *(via Backend project)* | Services, Routes |
| **Execution Time** | ~6s | Full suite |

> **Last Verified**: 2026-01-01

---

## 🏗️ Project Architecture

### Directory Structure

```
Ark.Portfolio.Tests/
│
├── 📁 Backend/                          # Backend test suites
│   ├── Routes/                          # API route integration tests
│   │   ├── resume-routes.spec.ts        # Resume API endpoints
│   │   └── timeline-reorder.spec.ts     # Drag-drop reordering
│   └── Services/                        # Service unit tests
│       ├── media.service.spec.ts        # Media CRUD operations
│       ├── project.service.spec.ts      # Project management
│       └── resume.service.spec.ts       # Resume data handling
│
├── 📁 Frontend/                         # Frontend test suites
│   ├── Accessibility/                   # WCAG compliance
│   │   └── accessibility.spec.ts        # A11y verification
│   ├── Components/                      # UI component tests
│   │   ├── polished-ui.spec.ts          # Design system tests
│   │   └── timeline-grid.spec.ts        # Timeline components
│   ├── Navigation/                      # Router tests
│   │   └── navigation.config.spec.ts    # Route configuration
│   ├── Pages/                           # Page-level tests
│   │   ├── Admin/Projects/              # ⭐ REFACTORED MODULE
│   │   │   ├── index.ts                 # Central exports
│   │   │   ├── interfaces.ts            # Type definitions
│   │   │   ├── constants.ts             # Test constants
│   │   │   ├── helpers.tsx              # Render utilities
│   │   │   ├── mocks.ts                 # Mock data
│   │   │   ├── TestableProjectEditPage.tsx
│   │   │   ├── TestableProjectManager.tsx
│   │   │   ├── ProjectEditPage.test.tsx # 12 tests
│   │   │   └── ProjectManager.test.tsx  # 14 tests
│   │   ├── ProjectsPageV2.test.tsx      # Projects page tests
│   │   ├── ResumePageV2.test.tsx        # Resume page tests
│   │   ├── Smoke.test.tsx               # Health check
│   │   └── ai-settings.page.spec.ts     # AI settings tests
│   └── Services/                        # Frontend services
│       └── resume-api.service.spec.ts   # API client tests
│
├── 📁 Interfaces/                       # Shared test interfaces
│   ├── IProjectService.ts               # Project service contract
│   ├── IResumeService.ts                # Resume service contract
│   └── index.ts                         # Interface exports
│
├── 📁 Mocks/                            # Global mock data
│   ├── index.ts                         # Mock exports
│   ├── project.mock.ts                  # Project mock data
│   ├── resume.mock.ts                   # Resume mock data
│   ├── media.mock.ts                    # Media mock data
│   ├── styleMock.js                     # CSS module mock
│   └── fileMock.js                      # Asset file mock
│
├── 📄 jest.config.js                    # Jest configuration
├── 📄 setup.ts                          # Test setup/bootstrap
├── 📄 tsconfig.json                     # TypeScript config
├── 📄 Agents.md                         # AI agent documentation
└── 📄 README.md                         # This file
```

---

## 📐 Testing Patterns

### Test Architecture Philosophy

```
           ┌──────────────────────┐
           │    E2E / Browser     │  ← Manual / Playwright (future)
           │        Tests         │
           ├──────────────────────┤
           │   Integration Tests  │  ← Route + Service + Mock DB
           │                      │
           ├──────────────────────┤
           │     Component        │  ← React Testing Library
           │       Tests          │
           ├──────────────────────┤
           │      Unit Tests      │  ← Jest + TypeScript
           │   (Services/Utils)   │
           └──────────────────────┘
```

### The Testable Component Pattern

To avoid **dual React instance issues** when testing UI components, we use the **Testable Component Pattern**:

```typescript
/**
 * TestableComponent mirrors the real component but:
 * - Uses dependency injection for mocks
 * - Avoids importing from UI node_modules
 * - Enables isolated unit testing
 */
export const TestableMyComponent: React.FC<Props> = ({
    apiClient,    // Injected mock
    navigate,     // Injected mock
    showToast     // Injected mock
}) => {
    // Component logic using injected dependencies
};
```

**Benefits:**
- ✅ Avoids React context errors
- ✅ Full control over dependencies
- ✅ Predictable test behavior
- ✅ No module hoisting issues

---

## 🧪 Test Suites Reference

### Frontend Tests

| Test Suite | Tests | Coverage | Description |
|------------|-------|----------|-------------|
| `ProjectEditPage.test.tsx` | 12 | Create/Edit modes, form submission, validation |
| `ProjectManager.test.tsx` | 14 | List, navigation, CRUD actions |
| `ProjectsPageV2.test.tsx` | 9 | Page states, mock data rendering |
| `ResumePageV2.test.tsx` | 3 | Loading, error, content states |
| `polished-ui.spec.ts` | 35 | Design system components |
| `timeline-grid.spec.ts` | 25 | Timeline and grid components |
| `navigation.config.spec.ts` | 15 | Route configuration |
| `accessibility.spec.ts` | 30 | WCAG compliance |
| `ai-settings.page.spec.ts` | 30 | AI settings validation |
| `Smoke.test.tsx` | 1 | Basic JSX rendering health check |

### Backend Tests

| Test Suite | Tests | Coverage | Description |
|------------|-------|----------|-------------|
| `project.service.spec.ts` | 12 | CRUD, filtering, sorting |
| `resume.service.spec.ts` | 10 | Data handling, validation |
| `media.service.spec.ts` | 15 | Upload, metadata, filtering |
| `resume-routes.spec.ts` | 11 | API responses, error handling |
| `timeline-reorder.spec.ts` | 8 | Drag-drop persistence |

---

## 🚀 Usage Commands

### Running Tests

```bash
# Run all tests
npm test

# Run frontend tests only
npm run test:frontend

# Run backend tests only
npm run test:backend

# Run specific test file
npm exec jest -- Frontend/Pages/Admin/Projects --verbose

# Run tests matching pattern
npm exec jest -- -t "renders loading state"

# Watch mode (re-run on changes)
npm run test:watch
```

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
start coverage/lcov-report/index.html
```

### Debugging

```bash
# Verbose output
npm exec jest -- --verbose --no-coverage

# Single worker (easier debugging)
npm exec jest -- --maxWorkers=1

# Debug mode with inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## ⚙️ Configuration

### Jest Configuration (`jest.config.js`)

```javascript
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>'],
    testMatch: ['**/*.spec.ts', '**/*.test.tsx'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
            diagnostics: { ignoreCodes: [2322, 2786] }
        }]
    },
    moduleNameMapper: {
        '\\.(css|scss)$': '<rootDir>/Mocks/styleMock.js',
        '^@ark/portfolio-share(.*)$': '<rootDir>/../Ark.Portfolio.Share$1',
        '^@ui/(.*)$': '<rootDir>/../Ark.Portfolio.UI/src/$1'
    },
    setupFilesAfterEnv: ['<rootDir>/setup.ts'],
    verbose: true,
    testTimeout: 10000
};
```

### Path Aliases

| Alias | Resolves To | Usage |
|-------|-------------|-------|
| `@ark/portfolio-share` | `../Ark.Portfolio.Share/` | Shared DTOs, mocks, enums |
| `@ui/*` | `../Ark.Portfolio.UI/src/*` | UI components, hooks, services |

---

## 📝 Writing Tests - Best Practices

### File Documentation Standard

Every test file MUST include:

```typescript
/**
 * @fileoverview [Component/Service] Tests
 * [Brief description of what is tested]
 * 
 * Tests Cover:
 * - [Test category 1]
 * - [Test category 2]
 * 
 * @author Armand Richelet-Kleinberg
 * @module [Frontend/Backend]/[Area]
 */
```

### Component Test Template

```typescript
/**
 * @fileoverview MyComponent Tests
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock dependencies BEFORE imports
jest.mock('@ui/hooks/useMyHook', () => ({
    useMyHook: jest.fn()
}));

// Import AFTER mocks
import { MyComponent } from '@ui/components/MyComponent';

describe('MyComponent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        render(
            <MemoryRouter>
                <MyComponent />
            </MemoryRouter>
        );
        expect(screen.getByTestId('my-component')).toBeInTheDocument();
    });
});
```

### Using the Admin/Projects Module Pattern

For new admin page tests, follow the established pattern:

```typescript
// Import from centralized index
import {
    TestableMyPage,
    renderWithRouter,
    createMockApiClient,
    MY_PAGE_TEST_IDS,
    MOCK_DATA
} from './index';

describe('MyPage', () => {
    let mockApiClient = createMockApiClient();
    
    const renderComponent = () => renderWithRouter(
        <TestableMyPage apiClient={mockApiClient} />,
        { initialPath: '/admin/my-page', routePattern: '/admin/my-page' }
    );

    it('renders correctly', () => {
        renderComponent();
        expect(screen.getByTestId(MY_PAGE_TEST_IDS.PAGE)).toBeInTheDocument();
    });
});
```

---

## 🔧 Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `useNavigate() outside Router` | Component imports before mocks | Move `jest.mock()` before imports |
| `Cannot read 'useContext'` | Dual React instances | Use Testable Component pattern |
| `import.meta.env undefined` | Vite env in Jest | Mock the service that uses it |
| `TypeError: X is not a function` | Incomplete mock | Add missing mock return values |

### Dual React Instance Issue

**Symptom**: `Cannot read properties of null (reading 'useContext')`

**Cause**: Test project and UI project have different React installations.

**Solution**: Create Testable components that don't import from UI's node_modules:

```typescript
// ❌ Don't do this
import { RealComponent } from '@ui/components/RealComponent';

// ✅ Do this instead
const TestableComponent: React.FC = () => {
    // Mirror component logic with mocked dependencies
};
```

---

## 📋 Contribution Guidelines

### Adding New Tests

1. **Create test file** in appropriate directory
2. **Add @fileoverview** header with @author
3. **Follow naming convention**: `ComponentName.test.tsx` or `service-name.spec.ts`
4. **Use centralized mocks** from `Mocks/` directory
5. **Run full suite** before committing

### Code Quality Checklist

- [ ] All tests pass (`npm test`)
- [ ] File has @fileoverview header
- [ ] Uses existing mock data where possible
- [ ] Follows Testable Component pattern for UI tests
- [ ] No console errors during test run
- [ ] Coverage maintained at 80%+

---

## 📚 Related Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| Share Layer | `../Ark.Portfolio.Share/README.md` | DTOs, mocks, enums |
| UI Layer | `../Ark.Portfolio.UI/README.md` | Components, pages |
| Backend Layer | `../Ark.Portfolio.Backend/README.md` | API, services |
| Agent Notes | `./Agents.md` | AI-assisted development log |

---

<div align="center">

**Ark.Portfolio.Tests** — Part of the Ark Alliance Ecosystem

<sub>
Armand Richelet-Kleinberg © M2H.IO<br>
AI-assisted development with Anthropic Claude & Google Gemini
</sub>

</div>
