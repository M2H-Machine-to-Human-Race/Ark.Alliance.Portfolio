import { ProjectDto } from '../dtos/project.dto';
import { ProjectStatus } from '../enums/project-status.enum';
import { Technology } from '../enums/technology.enum';
import { ProjectSection } from '../enums/project-section.enum';

export const MOCK_PROJECTS: ProjectDto[] = [
    {
        id: '1',
        title: 'Ark.Portfolio - AI-Powered Portfolio CMS',
        description: 'Enterprise-grade, AI-powered portfolio platform combining comprehensive content management with multi-provider AI integration (OpenAI, Anthropic, Google Gemini), static site export capabilities, and end-to-end type safety. Features 20 TypeORM entities, 235+ passing tests, MVVM architecture in React frontend, and RESTful API backend with JWT authentication.',
        status: ProjectStatus.IN_PROGRESS,
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=600',
        repoUrl: 'https://github.com/YourUsername/Ark.Portfolio',
        demoUrl: '',
        technologies: [
            Technology.REACT,
            Technology.TYPESCRIPT,
            Technology.NODEJS,
            Technology.SQLITE,
            Technology.REST,
            Technology.OPENAI,
            Technology.ANTHROPIC,
            Technology.GEMINI
        ],
        startDate: new Date('2024-01-01'),
        features: [
            {
                id: 'f1-1',
                title: 'Multi-Provider AI Integration',
                description: 'Seamlessly integrated with OpenAI GPT-4, Anthropic Claude 3, and Google Gemini for intelligent content generation, summarization, and enhancement with AES-256 encrypted API key storage',
                icon: 'brain',
                imageUrl: ''
            },
            {
                id: 'f1-2',
                title: 'Comprehensive CMS',
                description: 'Full-featured content management system with 20 TypeORM entities covering profile, projects, experiences, education, skills, media assets, carousel items, and dynamic widgets',
                icon: 'database',
                imageUrl: ''
            },
            {
                id: 'f1-3',
                title: 'Static Site Export',
                description: 'One-click generation of deployable static websites from CMS content, ready for GitHub Pages, Netlify, or Vercel with preserved styling and interactivity',
                icon: 'download',
                imageUrl: ''
            },
            {
                id: 'f1-4',
                title: 'Enterprise Architecture',
                description: 'Clean three-tier architecture (UI, Backend, Shared) with MVVM pattern, Repository pattern, type-safe DTOs, and comprehensive error handling',
                icon: 'sitemap',
                imageUrl: ''
            },
            {
                id: 'f1-5',
                title: 'Production-Grade Security',
                description: 'JWT authentication, bcrypt password hashing (12 rounds), Helmet security headers, CORS protection, and AES-256 encryption for sensitive API keys',
                icon: 'shield-alt',
                imageUrl: ''
            },
            {
                id: 'f1-6',
                title: 'Dynamic Theming',
                description: 'Runtime theme switching between Architectural and Aloe Vera themes with no page reload, CSS variable injection, and JSON-based configuration',
                icon: 'palette',
                imageUrl: ''
            }
        ],
        pages: [
            {
                id: 'p1-1',
                title: 'Overview',
                type: ProjectSection.OVERVIEW,
                order: 1,
                content: '## Project Overview\n\n**Ark.Portfolio** is a production-ready, enterprise-grade portfolio platform that transcends traditional portfolio websites. It combines modern web development practices with AI-powered content generation, comprehensive CMS capabilities, and static site export functionality.\n\n### Core Capabilities\n\n1. **Content Management System (CMS)** - Full CRUD operations for all 20 entities\n2. **AI-Powered Features** - Multi-provider AI integration with encrypted API key storage\n3. **Static Site Export** - Generate deployable static websites from CMS content\n4. **Enterprise Architecture** - Clean three-tier structure with type-safe contracts\n\n### Key Statistics\n\n- 20 TypeORM Entities\n- 3-Layer Architecture\n- 16 Backend Services\n- 235+ Test Cases'
            },
            {
                id: 'p1-2',
                title: 'Architecture & Data Model',
                type: ProjectSection.ARCHITECTURE,
                order: 2,
                content: '## System Architecture\n\nThree-tier structure: Presentation (React 18), Shared (DTOs), Application (Express + TypeORM)\n\n### 20 Data Model Entities\n\n**Core**: Profile, User\n**Professional**: Experience, Education, Skill, SkillCategory\n**Projects**: Project, ProjectPage, ProjectFeature, ProjectTechnology, ProjectController, ProjectEndpoint\n**Content**: Media, CarouselItem, MenuItem, Widget, StyleConfig\n**Advanced**: AiSettings, TeamMember, Outbox'
            },
            {
                id: 'p1-3',
                title: 'Features & Use Cases',
                type: ProjectSection.TECHNICAL,
                order: 3,
                content: '## Use Cases\n\n1. **Portfolio Management** - Centralized content with version control\n2. **AI Content Generation** - OpenAI/Anthropic/Gemini integration\n3. **Static Deployment** - Export to GitHub Pages/Netlify/Vercel\n4. **Dynamic Theming** - Instant theme changes without reload\n5. **Multi-Page Documentation** - Comprehensive project docs with Mermaid diagrams'
            },
            {
                id: 'p1-4',
                title: 'Deployment & Integration',
                type: ProjectSection.TECHNICAL,
                order: 4,
                content: '## Deployment Options\n\n- **Full Stack**: Node.js + PostgreSQL/SQLite\n- **Static Export**: One-click ZIP download\n- **Docker**: docker-compose with backend, frontend, DB\n\n## Security\n\n- JWT auth, bcrypt hashing\n- Helmet headers, CORS\n- AES-256 encryption for API keys'
            }
        ]
    },
    {
        id: '2',
        title: 'Ark.Alliance.React.Component.UI',
        description: 'Enterprise-grade React component library with MVVM architecture spanning 40 component categories across Finance/Trading, Healthcare, Logistics, E-Commerce, AI/ML, and more. Built with React 19, TypeScript 5.9, Zod validation, and Tailwind CSS 4. Features 258 passing tests (100% coverage), premium neon aesthetics, and complete type safety.',
        status: ProjectStatus.IN_PROGRESS,
        imageUrl: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=1200&h=600',
        repoUrl: 'https://github.com/YourUsername/Ark.Alliance.React.Component.UI',
        demoUrl: '',
        technologies: [
            Technology.REACT,
            Technology.TYPESCRIPT,
            Technology.TAILWIND,
            Technology.THREEJS,
            Technology.DOCKER
        ],
        startDate: new Date('2024-01-01'),
        features: [
            {
                id: 'f2-1',
                title: 'MVVM Architecture Pattern',
                description: 'Strict Model-View-ViewModel separation with Zod schema-based models, custom React Hook ViewModels, and pure presentation Views. Ensures testable, maintainable, and scalable component design.',
                icon: 'layer-group',
                imageUrl: ''
            },
            {
                id: 'f2-2',
                title: '40 Component Categories',
                description: 'Comprehensive component suite spanning Buttons, Cards, Gauges (5 types), Input (6 variants), Chart3D (Three.js), Charts, Grids, Modal, TimeLines, Documents (Markdown), and 28 more categories.',
                icon: 'th',
                imageUrl: ''
            },
            {
                id: 'f2-3',
                title: 'Multi-Domain Support',
                description: 'Components designed for Finance/Trading, Healthcare, Logistics, E-Commerce, AI/ML, Music/Audio, Video/Streaming, Social/Communication, Payments, and Data Visualization industries.',
                icon: 'industry',
                imageUrl: ''
            },
            {
                id: 'f2-4',
                title: 'Runtime Zod Validation',
                description: 'All models use Zod 4 schemas for runtime type checking, schema-based validation with clear error messages, and TypeScript type inference from schemas for compile-time safety.',
                icon: 'check-circle',
                imageUrl: ''
            },
            {
                id: 'f2-5',
                title: 'Premium Visual Modes',
                description: 'Four distinct visual modes: Normal, Neon (glowing for trading), Minimal (reduced weight), and Glass (glassmorphism with backdrop blur). Mode switching without code changes.',
                icon: 'palette',
                imageUrl: ''
            },
            {
                id: 'f2-6',
                title: '100% Test Coverage',
                description: '258 tests passing with Vitest and React Testing Library. 35 BaseInput tests, 28 ProgressBar tests, 25 GenericPanel tests, 24 Tooltip tests, comprehensive scenario-based testing.',
                icon: 'vial',
                imageUrl: ''
            }
        ],
        pages: [
            {
                id: 'p2-1',
                title: 'Overview',
                type: ProjectSection.OVERVIEW,
                order: 1,
                content: '## Ark.Alliance.React.Component.UI\n\nEnterprise-Grade React Component Library with MVVM Architecture for multi-domain applications.\n\n### Key Features\n\n- 40 Component Categories\n- MVVM Architecture with Zod Validation\n- Premium neon, minimal, glass visual modes\n- 258 tests (100% pass rate)\n- TypeScript 5.9 strict mode\n- Interactive Showcase at localhost:5090\n\n### Business Domains\n\nFinance/Trading, Healthcare, Logistics, E-Commerce, AI/ML, Music/Audio, Video, Social, Payments, Data Visualization'
            },
            {
                id: 'p2-2',
                title: 'MVVM Architecture',
                type: ProjectSection.ARCHITECTURE,
                order: 2,
                content: '## Model-View-ViewModel Pattern\n\n**Model (*.model.ts)**: Zod Schema + TypeScript types\n**ViewModel (*.viewmodel.ts)**: Custom React Hook with state management\n**View (*.tsx)**: Pure presentation component with forwardRef/memo\n\n### Core Infrastructure\n\n- BaseComponentModel\n- BaseViewModel\n- FormInputModel\n- useFormInputRestrictions'
            },
            {
                id: 'p2-3',
                title: 'Component Catalog',
                type: ProjectSection.TECHNICAL,
                order: 3,
                content: '## Implemented Components\n\n**Primitives**: NeonButton, NeonToggle, GlowCard, TradingGridCard\n**Input**: Input, Select, TextArea, Slider, NumericInput, FileUpload\n**Gauges**: CircularGauge, SpeedometerGauge, DigitalGauge, BatteryGauge, SignalBarsGauge\n**Advanced**: Chart3D (Three.js), DataGrid, Modal, Timeline, MarkdownRenderer\n**Layout**: Header, Footer, SideBarMenu, Panel, GenericPanel\n\n### Visual Modes\n\nnormal, neon, minimal, glass'
            },
            {
                id: 'p2-4',
                title: 'Testing & Quality',
                type: ProjectSection.TECHNICAL,
                order: 4,
                content: '## Test Suite\n\n**Total**: 258 tests ✅ 100% pass\n**Framework**: Vitest 2.1.8\n**Library**: @testing-library/react 16.1.0\n\n### Test Breakdown\n\n- BaseInput: 35 tests\n- ProgressBar: 28 tests\n- GenericPanel: 25 tests\n- Tooltip: 24 tests\n- TradingGridCard: 23 tests\n\n### ComponentTestEngine\n\nScenario-driven testing utility for consistent patterns'
            }
        ]
    },
    {
        id: '3',
        title: 'Ark.Alliance.Trading.Providers.Lib',
        description: 'Production-ready TypeScript SDK unifying cryptocurrency trading across multiple exchanges (Binance Futures, Deribit) with a single, elegant API. Features Result pattern for type-safe error handling, event-driven async architecture, WebSocket streams for low-latency market data, HMAC-SHA256 and Ed25519 authentication, 70+ test scenarios with 100% pass rate. Published on NPM.',
        status: ProjectStatus.IN_PROGRESS,
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200&h=600',
        repoUrl: 'https://github.com/YourUsername/Ark.Alliance.Trading.Providers.Lib',
        demoUrl: '',
        technologies: [
            Technology.TYPESCRIPT,
            Technology.NODEJS,
            Technology.DOCKER,
            Technology.BINANCE,
            Technology.REST
        ],
        startDate: new Date('2024-01-01'),
        features: [
            {
                id: 'f3-1',
                title: 'Multi-Provider Abstraction',
                description: 'Unified interface for Binance Futures and Deribit exchanges with IProviderClient pattern. Write once, trade on any supported exchange without code changes. Extensible architecture for adding new providers.',
                icon: 'plug',
                imageUrl: ''
            },
            {
                id: 'f3-2',
                title: 'Result Pattern Error Handling',
                description: 'Type-safe Result<T> pattern for functional error handling. No exceptions in normal flow, explicit success/failure states, chainable operations (map, flatMap), comprehensive error details with ResultStatus enum.',
                icon: 'check-circle',
                imageUrl: ''
            },
            {
                id: 'f3-3',
                title: 'Real-Time WebSocket Streams',
                description: 'Low-latency market data via WebSocket connections. Subscribe to klines, book ticker, user data streams, order events. Event-driven architecture with typed event emitters for order fills and position updates.',
                icon: 'wifi',
                imageUrl: ''
            },
            {
                id: 'f3-4',
                title: 'Secure Authentication',
                description: 'HMAC-SHA256 signature generation for Binance, Ed25519 signature generation for Deribit, automatic token refresh mechanisms, secure credential storage with IAuthStrategy interface.',
                icon: 'lock',
                imageUrl: ''
            },
            {
                id: 'f3-5',
                title: 'Comprehensive Testing',
                description: '70+ test scenarios with ReflectionTestEngine, scenario-driven JSON test definitions, dynamic parameter resolution ($DYNAMIC_LIMIT_BUY), tested against live testnets, 100% pass rate across all categories.',
                icon: 'vial',
                imageUrl: ''
            },
            {
                id: 'f3-6',
                title: 'Clean Architecture',
                description: 'Domain-driven design with clear layer separation: Domain (entities, interfaces), Application (use cases, mappers), Infrastructure (clients, auth). TypeScript-first with full IntelliSense support.',
                icon: 'sitemap',
                imageUrl: ''
            }
        ],
        pages: [
            {
                id: 'p3-1',
                title: 'Overview',
                type: ProjectSection.OVERVIEW,
                order: 1,
                content: '## Ark Alliance Trading Providers Library\n\nProduction-Ready Multi-Provider Cryptocurrency Trading SDK\n\n### Perfect For\n\n- Algorithmic trading bots\n- Market data aggregators\n- Portfolio management systems\n- Trading analytics platforms\n\n### Key Features\n\n- Multi-Provider (Binance, Deribit)\n- Order Management (place, modify, cancel, track)\n- Position Tracking with P&L\n- WebSocket Streams (low-latency)\n- Result Pattern (type-safe errors)\n- 70+ test scenarios (100% pass)\n- Published on NPM'
            },
            {
                id: 'p3-2',
                title: 'Architecture',
                type: ProjectSection.ARCHITECTURE,
                order: 2,
                content: '## Clean Architecture\n\n### Layers\n\n**Domain**: Entities (Order, Position, Account), Interfaces (IProviderClient, IAuthStrategy)\n**Application**: Use Cases, Data Mappers\n**Infrastructure**: API Clients (REST, WebSocket), Authentication (HMAC, Ed25519)\n\n### Provider Abstraction\n\nIProviderClient interface implemented by Binance and Deribit providers\n\n### Result Pattern\n\nResult<T> with success/failure states, chainable operations (map, flatMap), ResultStatus enum'
            },
            {
                id: 'p3-3',
                title: 'Use Cases & Examples',
                type: ProjectSection.TECHNICAL,
                order: 3,
                content: '## Functional Use Cases\n\n### 1. Algorithmic Trading Bot\n\nSubscribe to market data, analyze signals, place orders, monitor fills\n\n### 2. Portfolio Management\n\nAggregate positions across exchanges, rebalance, unified interface\n\n### 3. Market Data Aggregation\n\nCollect prices from multiple sources, identify arbitrage opportunities\n\n### 4. Risk Management\n\nMonitor exposure, enforce limits, automated stop-loss orders'
            },
            {
                id: 'p3-4',
                title: 'Testing & Quality',
                type: ProjectSection.TECHNICAL,
                order: 4,
                content: '## Test Suite\n\n**Total**: 70+ scenarios\n**Pass Rate**: 100%\n**Framework**: ReflectionTestEngine\n\n### Coverage\n\n- Account (8 scenarios)\n- Market Data (8)\n- Orders (12)\n- Positions (14)\n- GTX Orders (13)\n- Market Orders (8)\n- Algo Orders (10)\n- Mixed Workflows (10)\n\n### Dynamic Parameters\n\n$DYNAMIC_LIMIT_BUY → bidPrice * 0.95\n$DYNAMIC_LIMIT_SELL → askPrice * 1.05'
            }
        ]
    }
];
