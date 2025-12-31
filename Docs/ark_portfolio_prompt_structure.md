# Ark Portfolio - Complete Project Structure Specification

## Project Overview

Create a comprehensive portfolio application for **Armand Richelet Kleinberg** with a three-tier architecture: Backend, Shared layer, and Frontend.

---

## Architecture Requirements

### 1. **Ark.Portfolio.Backend** (TypeScript)

Backend structure with the following organized folder hierarchy:

```
Ark.Portfolio.Backend/
├── src/
│   ├── controllers/        # API endpoint controllers (one class per file)
│   ├── services/           # Business logic services (one class per file)
│   ├── helpers/            # Utility functions and helpers
│   ├── database/
│   │   ├── entities/       # Database entities (one entity per file)
│   │   ├── repositories/   # Data access layer (one repository per file)
│   │   ├── context/        # Database context/connection management
│   │   └── schemas/        # Database initialization scripts & migrations
│   ├── models/             # Domain models (one model per file)
│   ├── config/             # Configuration files
│   └── index.ts            # Application entry point
├── README.md
└── package.json
```

**Key Backend Requirements:**
- One class per file, one model per file, one entity per file
- No excessively long files - maintain modularity
- Use Enums for all multi-value properties (stored in `Ark.Portfolio.Share`)
- Complete database schema initialization in `/schemas` directory
- Seed database with comprehensive portfolio data on first run

---

### 2. **Ark.Portfolio.Share**

Shared layer for cross-cutting concerns between frontend and backend:

```
Ark.Portfolio.Share/
├── dtos/                   # Data Transfer Objects for API communication
│   ├── project.dto.ts
│   ├── cv.dto.ts
│   ├── profile.dto.ts
│   └── ...
├── enums/                  # Shared enumerations
│   ├── project-status.enum.ts
│   ├── skill-level.enum.ts
│   ├── technology.enum.ts
│   └── ...
├── interfaces/             # Shared TypeScript interfaces
└── README.md
```

**Key Share Requirements:**
- All DTOs for frontend-backend data exchange
- All common Enums used across the application
- Maintain consistency and type safety

---

### 3. **Ark.Portfolio.UI** (Frontend)

Frontend structure with component-based architecture:

```
Ark.Portfolio.UI/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Carousel/
│   │   ├── ProjectCard/
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── ...
│   ├── pages/             # Application pages
│   │   ├── Home/
│   │   ├── Projects/
│   │   ├── ProjectDetail/
│   │   ├── CV/
│   │   └── About/
│   ├── api/               # API service layer
│   ├── hooks/             # Custom React hooks
│   ├── styles/            # Global styles & theme
│   ├── assets/            # Images, fonts, icons
│   ├── utils/             # Utility functions
│   └── App.tsx
├── README.md
└── package.json
```

---

## Feature Requirements

### Homepage
- **Professional presentation** of Armand Richelet Kleinberg
- **Carousel/slider** showcasing featured projects
- **Project grid/list** with navigation
- **CV section** with download capability
- **About section** with professional biography

### Project Detail Pages
Each project must include:
- **Screenshots** of the application
- **Architecture diagrams** and technical documentation
- **Functional documentation** (requirements, features, user flows)
- **Technology stack** used
- **Code repository links** (if applicable)
- **Live demo links** (if available)
- **Project timeline** and key achievements

### Inspiration Source
Reference the existing sub-project in `AppPresentation` for:
- UI/UX patterns
- Documentation structure
- Component organization
- Best practices

---

## Design System

### Visual Identity
- **Source**: `C:\Repos\Ark`
- **Apply**: 
  - Color palette and graphical charter from Ark
  - Typography and font families from Ark
  - Logo and branding elements
  - Maintain consistency across all UI components

---

## Database Requirements

### Initial Seed Data
Populate the database with:
- **Personal profile information** (bio, contact, social links)
- **Complete CV data** (education, experience, skills, certifications)
- **Project portfolio** (descriptions, screenshots, documentation, tech stack)
- **Skills and technologies** (proficiency levels, categories)
- **Achievements and highlights**

### Schema Management
- Database initialization scripts in `/schemas` directory
- Migration support for future updates
- Data validation and integrity constraints

---

## Code Quality Standards

### Best Practices
- ✅ **One class per file**
- ✅ **One model per file**
- ✅ **One entity per file**
- ✅ **Enums for all multi-value properties** (no hardcoded strings)
- ✅ **No files with excessively long code** (refactor into smaller modules)
- ✅ **Consistent naming conventions** (PascalCase for classes, camelCase for methods)
- ✅ **Comprehensive error handling**
- ✅ **TypeScript strict mode enabled**

### Documentation
- **Perfect and complete README files** for each project layer
- **In-line code documentation** for complex logic
- **API documentation** (OpenAPI/Swagger for backend)
- **Component documentation** (Storybook or similar for frontend)
- **Written in perfect English** - no hallucinations or inaccuracies

---

## Deliverables

### Phase 1: Architecture & Structure
1. Complete folder structure for all three projects
2. README files for each layer with setup instructions
3. Database schema design and initialization scripts
4. Shared DTOs and Enums definition

### Phase 2: Backend Implementation
1. Entity models and repositories
2. Service layer with business logic
3. Controllers with API endpoints
4. Database seeding with portfolio data

### Phase 3: Frontend Implementation
1. Component library with reusable UI elements
2. Page implementations (Home, Projects, CV, etc.)
3. API integration layer
4. Responsive design implementation

### Phase 4: Integration & Polish
1. End-to-end testing
2. Performance optimization
3. Visual identity application (colors, fonts, branding)
4. Final documentation review

---

## Technical Stack Recommendations

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js or NestJS
- **ORM**: TypeORM or Prisma
- **Database**: PostgreSQL or MongoDB
- **Validation**: class-validator

### Frontend
- **Framework**: React with TypeScript
- **State Management**: React Context or Redux Toolkit
- **Styling**: Tailwind CSS or styled-components
- **Routing**: React Router
- **API Client**: Axios

### Shared
- **Build Tool**: TypeScript compiler
- **Package Manager**: npm or yarn

---

## Success Criteria

✅ Clean, maintainable architecture following industry best practices  
✅ Complete separation of concerns (Backend/Share/Frontend)  
✅ Comprehensive documentation in perfect English  
✅ Fully functional portfolio showcasing Armand Richelet Kleinberg's work  
✅ Responsive design working across all devices  
✅ Database properly seeded with rich content  
✅ Consistent visual identity matching Ark's design system  
✅ Production-ready code quality  

---

## Next Steps

1. **Research & Analysis**: Study the `AppPresentation` reference project thoroughly
2. **Architecture Design**: Create detailed technical architecture document
3. **Implementation Plan**: Break down into manageable sprints/milestones
4. **Development**: Execute implementation following this specification
5. **Testing & Review**: Comprehensive testing and code review
6. **Deployment**: Deploy to production environment

---

**Note**: This specification emphasizes quality over speed. Take time to create a perfect, well-structured portfolio that truly showcases professional excellence.