# Ark.Portfolio.Share

<div align="center">

![npm](https://img.shields.io/badge/npm-local%20package-orange?style=for-the-badge&logo=npm)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![DTOs](https://img.shields.io/badge/DTOs-15%2B-green?style=for-the-badge)
![Enums](https://img.shields.io/badge/Enums-60%2B%20values-purple?style=for-the-badge)

**Shared Contract Layer for Frontend and Backend**

*Type-Safe DTOs • Enumerations • Constants • Mock Data*

</div>

---

The **Shared Library** serves as the contract layer between Frontend and Backend, ensuring type safety and consistency across the entire solution. It provides Data Transfer Objects (DTOs), Enumerations, Constants, and Mock data.

---

## 📦 Functional Capabilities

| Domain | Capability | Description | Code Reference |
| :--- | :--- | :--- | :--- |
| **Contracts** | **DTOs** | Centralized interfaces ensuring Frontend/Backend type parity. | `dtos/*.dto.ts` |
| **Type Safety** | **Enums** | Strict enumerations for statuses, technologies (60+ values), and categories. | `enums/*.enum.ts` |
| **Constants** | **Terminology** | Unified UI strings and layout configuration. | `constants/*.ts` |
| **Testing** | **Mock Data** | Static datasets synced with backend seeds for testing without API. | `mocks/*.mock.ts` |
| **Exports** | **Barrel File** | Clean public API via index.ts barrel export. | `index.ts` |

---

## 🏗️ Project Structure

```text
Ark.Portfolio.Share/
├── 📁 constants/                 # Global UX strings & Layout config
│   ├── terminology.constants.ts  # UI text strings
│   └── ui-layout.constants.ts    # Layout configuration
│
├── 📁 dtos/                      # Data Transfer Objects (15+ files)
│   ├── auth.dto.ts               # Authentication DTOs
│   ├── project.dto.ts            # Project & Admin DTOs
│   ├── resume.dto.ts             # Resume/CV DTOs
│   ├── ai.dto.ts                 # AI settings DTOs
│   ├── media.dto.ts              # Media/upload DTOs
│   ├── carousel.dto.ts           # Carousel DTOs
│   ├── crud-response.dto.ts      # API response wrappers
│   └── ...                       # Additional DTOs
│
├── 📁 enums/                     # Typed Enumerations (5+ files)
│   ├── project-status.enum.ts    # IN_PROGRESS, COMPLETED, etc.
│   ├── technology.enum.ts        # 60+ technologies
│   ├── skill-level.enum.ts       # Beginner to Expert
│   └── ...                       # Additional enums
│
├── 📁 mocks/                     # Static test data
│   ├── index.ts                  # Mock exports
│   ├── projects.mock.ts          # Project mock data
│   ├── cv.mock.ts                # CV/Resume mock data
│   └── profile.mock.ts           # Profile mock data
│
├── 📄 index.ts                   # Public API barrel
├── 📄 package.json               # Package configuration
└── 📄 tsconfig.json              # TypeScript config
```

---

## 📐 Architecture

### DTO Relationships

```mermaid
classDiagram
    class ProjectDto {
        +string id
        +string title
        +string description
        +ProjectStatus status
        +Technology[] technologies
        +string imageUrl
        +ProjectFeatureDto[] features
        +ProjectPageDto[] pages
    }

    class ProjectFeatureDto {
        +string id
        +string title
        +string description
        +string icon
    }

    class ProjectPageDto {
        +string id
        +ProjectSection type
        +string title
        +string content
        +number order
    }

    class Technology {
        <<Enumeration>>
        REACT
        TYPESCRIPT
        NODEJS
        CSHARP
        PYTHON
        ...60+ values
    }

    ProjectDto *-- ProjectFeatureDto
    ProjectDto *-- ProjectPageDto
    ProjectDto ..> Technology
```

### Data Flow

```mermaid
sequenceDiagram
    participant DB as Database
    participant Backend as Backend Service
    participant Share as Shared DTO
    participant UI as Frontend

    DB->>Backend: Entity (Raw)
    Backend->>Backend: Map to DTO
    Backend->>Share: Validate against Interface
    Backend->>UI: JSON Response
    UI->>UI: TypeScript Autocomplete
```

---

## 📋 Technology Enum

The `Technology` enum contains **60+ values** organized by category:

| Category | Examples |
|----------|----------|
| **Frontend** | React, Angular, Vue, Svelte, Next.js, Three.js |
| **Languages** | TypeScript, Python, C#, Go, Rust, COBOL |
| **Runtimes** | Node.js, .NET 5-8, Unity, Unreal |
| **Databases** | PostgreSQL, MongoDB, Redis, SQLite |
| **Cloud** | AWS, Azure, GCP, DigitalOcean |
| **DevOps** | Docker, Kubernetes, Terraform |
| **AI/ML** | PyTorch, TensorFlow, OpenAI, Anthropic |
| **Patterns** | Microservices, CQRS, GraphQL, gRPC |

---

## 🚀 Usage

### Installation

This package is referenced locally within the monorepo:

```json
// package.json in UI or Backend
{
  "dependencies": {
    "@ark/portfolio-share": "file:../Ark.Portfolio.Share"
  }
}
```

### Import Examples

```typescript
// Import DTOs
import { ProjectDto, ResumeDto } from '@ark/portfolio-share';

// Import Enums
import { ProjectStatus, Technology } from '@ark/portfolio-share';

// Import Mock Data
import { MOCK_PROJECTS } from '@ark/portfolio-share';

// Create typed object
const project: ProjectDto = {
    title: "My Project",
    status: ProjectStatus.IN_PROGRESS,
    technologies: [Technology.REACT, Technology.TYPESCRIPT],
    description: "A great project"
};
```

### Build

```bash
npm install
npm run build
# Output in /dist
```

---

## 📦 Package Exports

The `index.ts` barrel file exports:

```typescript
// Enums
export * from './enums/project-status.enum';
export * from './enums/technology.enum';
export * from './enums/skill-level.enum';
// ... 5 enum files

// DTOs
export * from './dtos/project.dto';
export * from './dtos/resume.dto';
export * from './dtos/auth.dto';
// ... 15 DTO files

// Constants
export * from './constants/terminology.constants';
export * from './constants/ui-layout.constants';

// Mocks
export * from './mocks/projects.mock';
export * from './mocks/cv.mock';
export * from './mocks/profile.mock';
```

---

## 🧪 Testing

Mock data is used by the test suite:

```typescript
import { MOCK_PROJECTS } from '@ark/portfolio-share';

describe('ProjectsPage', () => {
    it('renders projects from mock data', () => {
        // MOCK_PROJECTS contains 4 projects synced with backend seeds
        expect(MOCK_PROJECTS.length).toBe(4);
    });
});
```

---

## 📝 Adding New Types

### Adding a New DTO

1. Create `dtos/new-feature.dto.ts`:
   ```typescript
   export interface NewFeatureDto {
       id: string;
       name: string;
       // ...
   }
   ```

2. Export from `index.ts`:
   ```typescript
   export * from './dtos/new-feature.dto';
   ```

3. Rebuild:
   ```bash
   npm run build
   ```

### Adding a New Technology

Edit `enums/technology.enum.ts`:

```typescript
export enum Technology {
    // ... existing values
    
    /** New Technology */
    NEW_TECH = 'New Technology'
}
```

---

## 📏 Best Practices

### DTO Naming Conventions

| Type | Convention | Example |
|------|------------|--------|
| Public DTO | `[Entity]Dto` | `ProjectDto` |
| Admin DTO | `Admin[Entity]Dto` | `AdminProjectDto` |
| Create DTO | `Create[Entity]Dto` | `CreateProjectDto` |
| Response | `CrudResponseDto<T>` | `CrudResponseDto<ProjectDto>` |

### Enum Guidelines

- **Always use string values** for JSON serialization
- **Add JSDoc comments** for each value explaining usage
- **Group related values** with comment headers

```typescript
export enum ProjectStatus {
    /** Project is actively being developed */
    IN_PROGRESS = 'In Progress',
    /** Project development is finished */
    COMPLETED = 'Completed',
}
```

### Mock Data Sync

Mock data MUST remain synchronized with backend seed data:

| Mock File | Backend Seed |
|-----------|-------------|
| `projects.mock.ts` | `projects.json` |
| `profile.mock.ts` | `profile.json` |
| `cv.mock.ts` | `cv.json` |

> **Important**: When updating backend seeds, update corresponding mocks!

---

## 📚 Related Documentation

| Document | Location | Purpose |
|----------|----------|--------|
| Tests Layer | `../Ark.Portfolio.Tests/README.md` | Test patterns, mocks usage |
| UI Layer | `../Ark.Portfolio.UI/README.md` | Component consumption |
| Backend Layer | `../Ark.Portfolio.Backend/README.md` | DTO mapping, validation |

---

<div align="center">

**Ark.Portfolio.Share** — Part of the Ark Alliance Ecosystem

<sub>
Armand Richelet-Kleinberg © M2H.IO<br>
AI-assisted development with Anthropic Claude & Google Gemini
</sub>

</div>
