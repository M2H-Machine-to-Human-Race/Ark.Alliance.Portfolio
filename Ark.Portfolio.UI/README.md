# Ark.Portfolio.UI

React/TypeScript frontend application for the Ark Portfolio. Features a modern, responsive design with a cyberpunk-inspired dark theme.

## Overview

Built with:
- **React 18** with TypeScript
- **Vite** for fast development and building
- **MVVM Architecture** for clean separation of concerns
- **TailwindCSS** for utility-first styling
- **Lucide React** for icons
- **React Router** for navigation
- **Chart.js** for data visualization
- **Mermaid** for architecture diagrams

## Architecture

### MVVM Pattern

```
┌─────────────────────────────────────────────────────────┐
│  View (React Component)                                  │
│  - JSX rendering                                         │
│  - Event handling                                        │
│  - useState for local state                              │
└─────────────────┬───────────────────────────────────────┘
                  │ binds to
                  ▼
┌─────────────────────────────────────────────────────────┐
│  ViewModel (extends BaseComponentModel)                  │
│  - Business logic                                        │
│  - Data transformation                                   │
│  - API orchestration                                     │
└─────────────────┬───────────────────────────────────────┘
                  │ uses
                  ▼
┌─────────────────────────────────────────────────────────┐
│  API Services                                            │
│  - HTTP communication                                    │
│  - Error handling                                        │
└─────────────────────────────────────────────────────────┘
```

## Project Structure

```
Ark.Portfolio.UI/
├── public/                  # Static assets
├── src/
│   ├── api/                 # API integration
│   │   ├── client.ts        # Base HTTP client
│   │   └── services/        # Domain-specific API services
│   ├── assets/              # Images, fonts, etc.
│   ├── components/
│   │   ├── base/            # Base classes (MVVM)
│   │   │   ├── BaseComponent.model.ts
│   │   │   └── BaseComponent.types.ts
│   │   ├── generic/         # Reusable UI components
│   │   │   ├── Button/
│   │   │   ├── Carousel/
│   │   │   ├── Panel/
│   │   │   ├── Icon/
│   │   │   └── ...
│   │   └── Layout/          # Page layout components
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Application pages
│   │   ├── Home/            # Home page with hero section
│   │   ├── Projects/        # Projects listing
│   │   ├── ProjectDetails/  # Single project view
│   │   ├── CV/              # Curriculum Vitae
│   │   └── Architecture/    # System architecture view
│   ├── services/            # Frontend services
│   ├── styles/              # Global CSS
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Generic Components

| Component | Description |
|-----------|-------------|
| `Button` | Styled button with variants (primary, outline, ghost) |
| `Carousel` | Auto-playing carousel with controls and indicators |
| `Panel` | Glass-morphism container panels |
| `Icon` | Lucide icon wrapper |
| `GlassCard` | Glassmorphism card component |
| `KpiCard` | Key Performance Indicator display card |
| `DataGrid` | Tabular data display |
| `Timeline` | Vertical timeline component |
| `MermaidDiagramReader` | Renders Mermaid diagrams |

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero section, featured projects carousel |
| Projects | `/projects` | Grid of all portfolio projects |
| Project Details | `/projects/:id` | Full project presentation |
| CV | `/cv` | Education, experience, skills |
| Architecture | `/architecture` | System architecture diagrams |

## Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8085/api
```

## Component Development

### Creating a New Component

Each component follows the MVVM structure:

```
ComponentName/
├── ComponentName.tsx        # View (React component)
├── ComponentName.model.ts   # ViewModel (business logic)
├── ComponentName.types.ts   # TypeScript interfaces
├── ComponentName.styles.css # Component styles
└── index.ts                 # Barrel export
```

### Using the ViewModel

```tsx
import { useMemo, useEffect, useState } from 'react';
import { MyViewModel } from './MyComponent.model';

export const MyComponent = () => {
    const vm = useMemo(() => new MyViewModel(), []);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        vm.onDataUpdate = () => setTick(t => t + 1);
        vm.onInit();
        return () => vm.onDestroy();
    }, [vm]);

    return <div>{vm.data}</div>;
};
```

---

**Author**: Armand Richelet-Kleinberg
