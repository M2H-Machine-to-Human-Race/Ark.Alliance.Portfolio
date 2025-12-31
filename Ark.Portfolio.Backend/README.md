# Ark.Portfolio.Backend

Express.js/TypeScript REST API backend for the Ark Portfolio application. Provides data access to portfolio content including projects, CV, and profile information.

## Overview

A layered architecture API server featuring:
- **Express.js** with TypeScript for type-safe development
- **TypeORM** for database abstraction
- **SQLite** for persistence (easily swappable)
- **CORS** and **Helmet** for security

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  HTTP Requests                                           │
└─────────────────┬───────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────┐
│  Routes (/routes/index.ts)                              │
│  - Endpoint definitions and middleware                   │
└─────────────────┬───────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────┐
│  Controllers (BaseController)                            │
│  - Request/Response handling                             │
│  - HTTP status code management                           │
└─────────────────┬───────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────┐
│  Services                                                │
│  - Business logic                                        │
│  - Data aggregation                                      │
└─────────────────┬───────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────┐
│  Mappers                                                 │
│  - Entity → DTO transformation                           │
│  - Eliminates code duplication                           │
└─────────────────┬───────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────┐
│  Repositories (GenericRepository<T>)                     │
│  - Database access abstraction                           │
└─────────────────┬───────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────┐
│  Entities (TypeORM)                                      │
│  - Database table mappings                               │
└─────────────────┬───────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────┐
│  SQLite Database                                         │
└─────────────────────────────────────────────────────────┘
```

## Project Structure

```
Ark.Portfolio.Backend/
├── src/
│   ├── config/              # Configuration files
│   │   └── database.ts      # TypeORM DataSource config
│   ├── controllers/         # HTTP endpoint handlers
│   │   ├── base.controller.ts       # Base class with response helpers
│   │   ├── project.controller.ts    # Project endpoints
│   │   ├── cv.controller.ts         # CV endpoints
│   │   ├── profile.controller.ts    # Profile endpoints
│   │   ├── dashboard.controller.ts  # Dashboard statistics
│   │   └── widget.controller.ts     # Widget endpoints
│   ├── database/
│   │   ├── context/         # Database initialization
│   │   ├── entities/        # TypeORM entity definitions
│   │   ├── repositories/    # Data access layer
│   │   ├── schemas/         # Database schemas
│   │   └── seeds/           # Initial data seeding
│   ├── mappers/             # Entity-to-DTO mappers
│   │   ├── project.mapper.ts        # Project mapping functions
│   │   └── index.ts                 # Barrel export
│   ├── services/            # Business logic layer
│   │   ├── project.service.ts       # Project operations
│   │   ├── cv.service.ts            # CV operations
│   │   ├── profile.service.ts       # Profile operations
│   │   ├── dashboard.service.ts     # Dashboard aggregation
│   │   └── widget.service.ts        # Widget operations
│   ├── routes/              # API route definitions
│   │   └── index.ts         # Route configuration
│   ├── utils/               # Utility functions
│   └── index.ts             # Application entry point
├── data/                    # Database storage
├── .env                     # Environment variables
├── package.json
└── tsconfig.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get portfolio owner profile |
| GET | `/api/projects` | List all projects |
| GET | `/api/projects/featured` | Get featured projects |
| GET | `/api/projects/:id/presentation` | Get project with full presentation |
| GET | `/api/cv` | Get complete CV data |
| GET | `/api/dashboard` | Get dashboard statistics |
| GET | `/api/widgets/home` | Get home page widgets |
| GET | `/api/widgets/project/:projectId` | Get project widgets |

## Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 8085 |
| `DATABASE_PATH` | SQLite file path | ./ark_portfolio.sqlite |

### Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Auto-Seeding

On first startup, if the database is empty, the server automatically seeds initial data including:
- Sample projects with features and pages
- Profile information
- Education and experience entries
- Skills

## Docker Deployment

```bash
# Build image
docker build -t ark-portfolio-backend .

# Run container
docker run -p 8085:8085 ark-portfolio-backend
```

Or using docker-compose:

```bash
docker-compose up -d
```

---

**Author**: Armand Richelet-Kleinberg
