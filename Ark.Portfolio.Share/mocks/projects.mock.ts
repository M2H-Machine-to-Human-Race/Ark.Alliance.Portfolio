/**
 * @fileoverview Project Mock Data
 * Uses the actual seed data from projects.json as the single source of truth.
 * This ensures tests are always aligned with the actual database seed data.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { ProjectDto, ProjectFeatureDto } from '../dtos/project.dto';
import { ProjectStatus } from '../enums/project-status.enum';

/**
 * Raw project data from the backend seed file.
 * This structure matches the JSON format used in projects.json.
 */
interface RawProjectData {
    title: string;
    description: string;
    status: string;
    imageUrl?: string;
    repoUrl?: string;
    demoUrl?: string;
    packageUrl?: string;
    technologies: string[];
    features?: Array<{
        title: string;
        description: string;
        icon?: string;
    }>;
    pages?: Array<{
        title: string;
        type: string;
        content: string;
    }>;
}

/**
 * Seed data matching projects.json in the Backend.
 * When projects.json is updated, this should be updated to match.
 */
const SEED_PROJECTS: RawProjectData[] = [
    {
        title: "Ark.Portfolio - AI-Powered Portfolio CMS",
        description: "Enterprise-grade, AI-powered portfolio platform combining comprehensive content management with multi-provider AI integration (OpenAI, Anthropic, Google Gemini), static site export capabilities, and end-to-end type safety. Features 20 TypeORM entities, 235+ passing tests, MVVM architecture in React frontend, and RESTful API backend with JWT authentication.",
        status: "Featured",
        imageUrl: "/Assets/Projects/Ark.Portfolio/portfolio-hero.png",
        repoUrl: "https://github.com/M2H-Machine-to-Human-Race/Ark.Alliance.Portfolio",
        demoUrl: "",
        packageUrl: "",
        technologies: ["react", "typescript", "nodejs", "express", "sqlite", "rest", "openai", "anthropic", "gemini"],
        features: [
            { title: "Multi-Provider AI Integration", description: "Seamlessly integrated with OpenAI GPT-4, Anthropic Claude 3, and Google Gemini for intelligent content generation, summarization, and enhancement with AES-256 encrypted API key storage", icon: "brain" },
            { title: "Comprehensive CMS", description: "Full-featured content management system with 20 TypeORM entities covering profile, projects, experiences, education, skills, media assets, carousel items, and dynamic widgets", icon: "database" },
            { title: "Static Site Export", description: "One-click generation of deployable static websites from CMS content, ready for GitHub Pages, Netlify, or Vercel with preserved styling and interactivity", icon: "download" },
            { title: "Enterprise Architecture", description: "Clean three-tier architecture (UI, Backend, Shared) with MVVM pattern, Repository pattern, type-safe DTOs, and comprehensive error handling", icon: "sitemap" },
            { title: "Production-Grade Security", description: "JWT authentication, bcrypt password hashing (12 rounds), Helmet security headers, CORS protection, and AES-256 encryption for sensitive API keys", icon: "shield-alt" },
            { title: "Dynamic Theming", description: "Runtime theme switching between Architectural and Aloe Vera themes with no page reload, CSS variable injection, and JSON-based configuration", icon: "palette" }
        ]
    },
    {
        title: "Ark.Alliance.React.Component.UI",
        description: "Enterprise-grade React component library with MVVM architecture spanning 40 component categories across Finance/Trading, Healthcare, Logistics, E-Commerce, AI/ML, and more. Built with React 19, TypeScript 5.9, Zod validation, and Tailwind CSS 4. Features 258 passing tests (100% coverage), premium neon aesthetics, and complete type safety.",
        status: "In Progress",
        imageUrl: "/Assets/Projects/Ark.Alliance.React.Component/components-hero.png",
        repoUrl: "https://github.com/ArmandRicheletKleinberg/Ark.Alliance.React.Component.UI",
        demoUrl: "",
        packageUrl: "https://www.npmjs.com/package/@ark-alliance/react-ui",
        technologies: ["react", "typescript", "tailwind", "threejs", "docker"],
        features: [
            { title: "MVVM Architecture Pattern", description: "Strict Model-View-ViewModel separation with Zod schema-based models, custom React Hook ViewModels, and pure presentation Views. Ensures testable, maintainable, and scalable component design.", icon: "layer-group" },
            { title: "40 Component Categories", description: "Comprehensive component suite spanning Buttons, Cards, Gauges (5 types), Input (6 variants), Chart3D (Three.js), Charts, Grids, Modal, TimeLines, Documents (Markdown), and 28 more categories.", icon: "th" },
            { title: "Multi-Domain Support", description: "Components designed for Finance/Trading, Healthcare, Logistics, E-Commerce, AI/ML, Music/Audio, Video/Streaming, Social/Communication, Payments, and Data Visualization industries.", icon: "industry" },
            { title: "Runtime Zod Validation", description: "All models use Zod 4 schemas for runtime type checking, schema-based validation with clear error messages, and TypeScript type inference from schemas for compile-time safety.", icon: "check-circle" },
            { title: "Premium Visual Modes", description: "Four distinct visual modes: Normal, Neon (glowing for trading), Minimal (reduced weight), and Glass (glassmorphism with backdrop blur). Mode switching without code changes.", icon: "palette" },
            { title: "100% Test Coverage", description: "258 tests passing with Vitest and React Testing Library. 35 BaseInput tests, 28 ProgressBar tests, 25 GenericPanel tests, 24 Tooltip tests, comprehensive scenario-based testing.", icon: "vial" }
        ]
    },
    {
        title: "Ark.Alliance.Trading.Providers.Lib",
        description: "Production-ready TypeScript SDK unifying cryptocurrency trading across multiple exchanges (Binance Futures, Deribit) with a single, elegant API. Features Result pattern for type-safe error handling, event-driven async architecture, WebSocket streams for low-latency market data, HMAC-SHA256 and Ed25519 authentication, 70+ test scenarios with 100% pass rate. Published on NPM.",
        status: "In Progress",
        imageUrl: "/Assets/Projects/Ark.Alliance.Trading.Providers.Lib/trading-hero.png",
        repoUrl: "https://github.com/ArmandRicheletKleinberg/Ark.Alliance.Trading.Providers.Lib",
        demoUrl: "",
        packageUrl: "https://www.npmjs.com/package/ark-alliance-trading-providers-lib",
        technologies: ["typescript", "nodejs", "docker", "binance", "rest"],
        features: [
            { title: "Multi-Provider Abstraction", description: "Unified interface for Binance Futures and Deribit exchanges with IProviderClient pattern. Write once, trade on any supported exchange without code changes. Extensible architecture for adding new providers.", icon: "plug" },
            { title: "Result Pattern Error Handling", description: "Type-safe Result<T> pattern for functional error handling. No exceptions in normal flow, explicit success/failure states, chainable operations (map, flatMap), comprehensive error details with ResultStatus enum.", icon: "check-circle" },
            { title: "Real-Time WebSocket Streams", description: "Low-latency market data via WebSocket connections. Subscribe to klines, book ticker, user data streams, order events. Event-driven architecture with typed event emitters for order fills and position updates.", icon: "wifi" },
            { title: "Secure Authentication", description: "HMAC-SHA256 signature generation for Binance, Ed25519 signature generation for Deribit, automatic token refresh mechanisms, secure credential storage with IAuthStrategy interface.", icon: "lock" },
            { title: "Comprehensive Testing", description: "70+ test scenarios with ReflectionTestEngine, scenario-driven JSON test definitions, dynamic parameter resolution ($DYNAMIC_LIMIT_BUY), tested against live testnets, 100% pass rate across all categories.", icon: "vial" },
            { title: "Clean Architecture", description: "Domain-driven design with clear layer separation: Domain (entities, interfaces), Application (use cases, mappers), Infrastructure (clients, auth). TypeScript-first with full IntelliSense support.", icon: "sitemap" }
        ]
    }
];

/**
 * Maps status string from seed data to ProjectStatus enum.
 */
function mapStatus(status: string): ProjectStatus {
    switch (status.toLowerCase()) {
        case 'featured': return ProjectStatus.IN_PROGRESS; // Featured projects are typically in progress
        case 'in progress': return ProjectStatus.IN_PROGRESS;
        case 'completed': return ProjectStatus.COMPLETED;
        case 'maintenance': return ProjectStatus.MAINTENANCE;
        case 'archived': return ProjectStatus.ARCHIVED;
        default: return ProjectStatus.IN_PROGRESS;
    }
}

/**
 * Converts raw seed data to ProjectDto format.
 */
function toProjectDto(raw: RawProjectData, index: number): ProjectDto {
    return {
        id: String(index + 1),
        title: raw.title,
        description: raw.description,
        status: mapStatus(raw.status),
        imageUrl: raw.imageUrl,
        repoUrl: raw.repoUrl,
        demoUrl: raw.demoUrl,
        packageUrl: raw.packageUrl,
        technologies: raw.technologies,
        features: raw.features?.map((f, i) => ({
            id: `f${index + 1}-${i + 1}`,
            title: f.title,
            description: f.description,
            icon: f.icon
        } as ProjectFeatureDto))
    };
}

/**
 * Mock projects data derived from the backend seed file (projects.json).
 * This is the SINGLE SOURCE OF TRUTH for test data.
 * 
 * @remarks
 * When projects.json is updated, this file should be updated to match.
 * This ensures tests always validate against the actual seed data structure.
 */
export const MOCK_PROJECTS: ProjectDto[] = SEED_PROJECTS.map(toProjectDto);
