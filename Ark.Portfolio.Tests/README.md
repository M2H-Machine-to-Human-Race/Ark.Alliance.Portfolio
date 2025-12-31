# Ark.Portfolio.Tests

Dedicated test project for Ark.Portfolio application following Clean Architecture principles.

## Project Structure

```
Ark.Portfolio.Tests/
├── Backend/               # Backend layer tests
│   └── Services/         # Service unit tests
│       ├── project.service.spec.ts
│       ├── resume.service.spec.ts
│       └── media.service.spec.ts
├── Frontend/             # Frontend layer tests
│   ├── Components/       # Component tests
│   └── ViewModels/       # ViewModel tests
├── Share/                # Shared layer tests
│   └── DTOs/             # DTO validation tests
├── Integration/          # Integration tests
├── Interfaces/           # Service interfaces
│   ├── IProjectService.ts
│   └── IResumeService.ts
├── Mocks/                # Mock data
│   ├── project.mock.ts
│   ├── resume.mock.ts
│   └── media.mock.ts
├── jest.config.js
├── tsconfig.json
└── setup.ts
```

## Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Layer-specific tests
npm run test:backend
npm run test:frontend
npm run test:share
npm run test:integration
```

## Test Coverage Goals

| Layer | Target | Status |
|-------|--------|--------|
| Backend Services | 80% | 🟡 In Progress |
| Frontend ViewModels | 80% | ⬜ Planned |
| Share DTOs | 90% | ⬜ Planned |
| Integration | 70% | ⬜ Planned |

## Mock Data

All mock data is realistic and matches production schemas:
- **Projects**: 3 complete project records
- **Resume**: 3 experiences, 2 education, 12 skills
- **Media**: 4 media items (images, SVG)

## Interfaces

Service interfaces enable dependency injection for testing:
- `IProjectService` - CRUD + query operations
- `IResumeService` - Resume sections + timeline ordering
