# Database Seed Data

This folder contains all database initialization and seeding functionality for Ark.Portfolio.

## Structure

```
seeds/
├── seed.ts                 # Main orchestrator - imports and runs all seeders
├── seeders/               # Domain-specific seeders
│   ├── index.ts           # Barrel exports
│   ├── profile.seeder.ts  # Profile/identity seeder
│   ├── experience.seeder.ts # Work history seeder
│   ├── skills.seeder.ts   # Technical skills seeder
│   ├── carousel.seeder.ts # Homepage carousel seeder
│   ├── media.seeder.ts    # Media assets seeder
│   └── projects.seeder.ts # Portfolio projects seeder
└── README.md              # This file
```

## Seed Data Sources

### JSON Data Files (`../InitDbAsset/`)

| File | Seeder | Description |
|------|--------|-------------|
| `JsonDatas/profile.json` | `profile.seeder.ts` | Portfolio owner's personal info |
| `JsonDatas/experience.json` | `experience.seeder.ts` | Professional work history (8 records) |
| `JsonDatas/skills.json` | `skills.seeder.ts` | Technical skills by category |
| `JsonDatas/carousel.json` | `carousel.seeder.ts` | Homepage slider items (4 items) |
| `ProjectData/projects.json` | `projects.seeder.ts` | Full project data with pages/features |

### Shared Layer Constants

| Source | Seeder | Description |
|--------|--------|-------------|
| `@ark/portfolio-share` → `DEFAULT_MEDIA_SEED` | `media.seeder.ts` | Media asset references (5 items) |

## Usage

### CLI Execution (Full Reset + Reseed)

```bash
npx ts-node src/database/seeds/seed.ts
```

### Programmatic Usage

```typescript
import { seedDatabase, runSeed, clearDatabase } from './database/seeds/seed';

// With existing DataSource (incremental)
await seedDatabase(dataSource);

// Full reset and reseed
await runSeed();

// Clear only
await clearDatabase(dataSource);
```

### Individual Seeders

```typescript
import { seedProfile, seedProjects } from './database/seeds/seeders';

// Seed specific domain
await seedProfile(dataSource);
await seedProjects(dataSource);
```

## Seeding Order

Seeders run in dependency order:

1. **Profile** - Standalone, no dependencies
2. **Experience** - Standalone, no dependencies
3. **Skills** - Standalone, no dependencies
4. **Carousel** - References project images in `/Assets`
5. **Media** - References asset files in `/Assets`
6. **Projects** - Full project hierarchy (pages, features, technologies)

## Data Summary

| Entity | Records | Source |
|--------|---------|--------|
| Profile | 1 | profile.json |
| Experience | 8 | experience.json |
| Skill | 40+ | skills.json (5 categories) |
| CarouselItem | 4 | carousel.json |
| Media | 5 | DEFAULT_MEDIA_SEED |
| Project | 3 | projects.json |
| ProjectPage | 12 | projects.json (4 per project) |
| ProjectFeature | 18 | projects.json (6 per project) |
| ProjectTechnology | 30+ | projects.json |

## Adding New Seed Data

### To add a new seeder:

1. Create `seeders/newdomain.seeder.ts`
2. Export `seedNewDomain()` and `clearNewDomain()` functions
3. Add exports to `seeders/index.ts`
4. Import and call in `seed.ts` orchestrator
5. Add JSON data file to `../InitDbAsset/JsonDatas/` if needed

### Template for new seeder:

```typescript
import { DataSource } from 'typeorm';
import { MyEntity } from '../../entities/my-entity.entity';
import * as fs from 'fs';
import * as path from 'path';

const DATA_PATH = path.join(__dirname, '../../InitDbAsset/JsonDatas/mydata.json');

export async function seedMyEntity(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(MyEntity);
    
    if (await repo.count() === 0) {
        const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
        // ... seeding logic
        console.log('✓ MyEntity seeded');
    }
}

export async function clearMyEntity(dataSource: DataSource): Promise<void> {
    await dataSource.createQueryBuilder().delete().from(MyEntity).execute();
}
```
