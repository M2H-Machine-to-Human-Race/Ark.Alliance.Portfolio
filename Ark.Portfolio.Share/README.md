# Ark.Portfolio.Share

Shared TypeScript library for cross-cutting concerns between the frontend (UI) and backend layers. Provides type safety and consistency across the full stack.

## Overview

This package contains:
- **DTOs (Data Transfer Objects)**: Type-safe contracts for API communication
- **Enums**: Shared enumerations for consistent value sets
- **Mocks**: Development/testing data for offline development

## Structure

```
Ark.Portfolio.Share/
├── dtos/                    # Data Transfer Objects
│   ├── project.dto.ts       # Project, Feature, Page DTOs
│   ├── profile.dto.ts       # Profile/contact information DTO
│   ├── cv.dto.ts            # Education, Experience, Skills DTOs
│   └── dashboard.dto.ts     # Dashboard statistics DTOs
├── enums/                   # Shared enumerations
│   ├── project-status.enum.ts  # Project lifecycle states
│   ├── skill-level.enum.ts     # Skill proficiency levels
│   └── technology.enum.ts      # Technology/framework tags
├── mocks/                   # Mock data for development
│   ├── projects.mock.ts     # Sample project data
│   ├── cv.mock.ts           # Sample CV data
│   └── profile.mock.ts      # Sample profile data
├── assets/                  # Shared static assets
├── index.ts                 # Barrel export
└── package.json
```

## Installation

This package is designed for use within the Ark.Portfolio monorepo:

```bash
# From UI or Backend directory
npm install ../Ark.Portfolio.Share
```

## Usage

### Importing DTOs

```typescript
import { ProjectDto, ProfileDto, CvDto } from 'ark-portfolio-share';

// Use in API responses
const project: ProjectDto = await fetchProject(id);
```

### Using Enums

```typescript
import { ProjectStatus, Technology, SkillLevel } from 'ark-portfolio-share';

// Type-safe enum usage
if (project.status === ProjectStatus.IN_PROGRESS) {
    // Handle active project
}
```

### Mock Data for Development

```typescript
import { MOCK_PROJECTS, MOCK_CV, MOCK_PROFILE } from 'ark-portfolio-share';

// Use mocks when API is unavailable
const projects = useMockData ? MOCK_PROJECTS : await api.getProjects();
```

## DTOs Reference

| DTO | Description |
|-----|-------------|
| `ProjectDto` | Complete project with features and pages |
| `ProjectFeatureDto` | Individual project feature |
| `ProjectPageDto` | Project documentation page |
| `ProfileDto` | Profile owner information |
| `CvDto` | Complete CV data |
| `EducationDto` | Education entry |
| `ExperienceDto` | Work experience entry |
| `SkillDto` | Professional skill |
| `DashboardDataDto` | Dashboard statistics and graphs |

## Enums Reference

| Enum | Values |
|------|--------|
| `ProjectStatus` | IN_PROGRESS, COMPLETED, MAINTENANCE, ARCHIVED |
| `SkillLevel` | BEGINNER, INTERMEDIATE, ADVANCED, EXPERT |
| `Technology` | ANGULAR, REACT, PYTHON, TYPESCRIPT, NODEJS, etc. |

## Build

```bash
npm run build
```

Outputs compiled JavaScript and type declarations to `/dist`.

---

**Author**: Armand Richelet-Kleinberg
