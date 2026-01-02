# InitDbAsset - Database Initialization Assets

This folder contains all JSON seed data files for database initialization.

## Folder Structure

```
InitDbAsset/
├── README.md                  # This file
├── JsonDatas/                # Core entity seed data
│   ├── profile.json          # Portfolio owner profile
│   ├── experience.json       # Professional work history
│   ├── skills.json           # Technical skills by category
│   ├── carousel.json         # Homepage carousel items
│   └── technologies.json     # Master technology catalog
└── ProjectData/              # Project-specific seed data
    └── projects.json         # Full project hierarchy
```

## File Specifications

### JsonDatas/profile.json

**Entity**: `Profile`  
**Records**: 1

| Field | Type | Description |
|-------|------|-------------|
| firstName | string | First name |
| lastName | string | Last name |
| title | string | Professional title |
| overview | string | Professional summary |
| email | string | Contact email |
| githubUrl | string | GitHub profile URL |
| linkedinUrl | string | LinkedIn profile URL |
| avatarUrl | string | Path to avatar image |

---

### JsonDatas/experience.json

**Entity**: `Experience`  
**Records**: 8

| Field | Type | Description |
|-------|------|-------------|
| company | string | Company name with industry |
| project | string | Project name/description |
| period | string | Date range (display only) |
| role | string | Job title/position |
| tech | string | Technologies used (comma-separated) |
| desc | string | Role description |

---

### JsonDatas/skills.json

**Entity**: `Skill`  
**Records**: 40+ (across 5 categories)

```json
{
    "languages": ["C#", "Python", "Java", ...],
    "frameworks": [".NET", "React", ...],
    "databases": ["PostgreSQL", "MongoDB", ...],
    "tools": ["Docker", "Kubernetes", ...],
    "methodologies": ["DDD", "CQRS", ...]
}
```

---

### JsonDatas/carousel.json

**Entity**: `CarouselItem`  
**Records**: 4

| Field | Type | Description |
|-------|------|-------------|
| title | string | Project title |
| subtitle | string | Short tagline |
| description | string | Extended description |
| imageUrl | string | Path to hero image (in /Assets) |
| linkUrl | string | Navigation link |
| linkText | string | CTA button text |
| order | number | Display order |
| isActive | boolean | Visibility flag |

---

### JsonDatas/technologies.json

**Entity**: `Technology`  
**Records**: 90+ (across 15 categories)

Master catalog of technologies/frameworks with rich metadata for display.

| Field | Type | Description |
|-------|------|-------------|
| key | string | Unique identifier (kebab-case) |
| name | string | Display name |
| label | string | Extended label |
| category | string | Category ID (frontend, backend, etc.) |
| description | string | Brief description |
| icon | string | Font Awesome or Devicon class |
| color | string | Brand color (hex) |
| website | string | Official website URL |
| versions | string[] | Supported versions (optional) |

**Categories**:
- `frontend` - React, Angular, Vue, etc.
- `languages` - TypeScript, Python, C#, etc.
- `runtimes` - Node.js, .NET, Unity, etc.
- `backend` - Express, NestJS, FastAPI, etc.
- `databases` - PostgreSQL, MongoDB, Redis, etc.
- `cloud` - AWS, Azure, GCP, etc.
- `devops` - Docker, Kubernetes, Terraform, etc.
- `messaging` - RabbitMQ, Kafka, etc.
- `ai` - PyTorch, OpenAI, Anthropic, etc.
- `enterprise` - SAP, Salesforce, etc.
- `patterns` - Microservices, CQRS, DDD, etc.
- `apis` - Binance, Stripe, Twilio, etc.
- `testing` - Jest, Cypress, Playwright, etc.
- `mobile` - React Native, Flutter, Swift, etc.
- `styling` - TailwindCSS, Sass, Bootstrap, etc.

---

### ProjectData/projects.json

**Entities**: `Project`, `ProjectPage`, `ProjectFeature`, `ProjectTechnology`  
**Records**: 3 projects with nested data

```json
{
    "title": "Project Name",
    "description": "...",
    "status": "Featured",
    "imageUrl": "/Assets/Projects/...",
    "repoUrl": "https://github.com/...",
    "demoUrl": "",
    "technologies": ["React", "TypeScript", ...],
    "features": [
        {
            "title": "Feature Name",
            "description": "...",
            "icon": "font-awesome-icon-name"
        }
    ],
    "pages": [
        {
            "title": "Overview",
            "type": "OVERVIEW",
            "navOrder": 1,
            "content": "## Markdown content..."
        }
    ]
}
```

---

## Adding New Seed Data

1. Create JSON file in appropriate folder
2. Follow existing schema patterns
3. Create corresponding seeder in `../seeds/seeders/`
4. Update seeder barrel exports
5. Add to orchestrator in `../seeds/seed.ts`

## Asset References

Image URLs in seed data should reference files in:
- `/Assets/Projects/{ProjectName}/` - Project images
- `/Assets/Site/` - Site-wide assets (logo, favicon)

These are served statically by the backend at runtime.
