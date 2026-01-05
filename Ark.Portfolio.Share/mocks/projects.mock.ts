/**
 * @fileoverview Project Mock Data
 * Uses the actual seed data from projects.json as the single source of truth.
 * This ensures tests and fallback data are always aligned with the actual database seed data.
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
    isFeatured?: boolean;
    imageUrl?: string;
    repoUrl?: string;
    demoUrl?: string;
    packageUrl?: string;
    technologies: string[];
    features?: Array<{
        title: string;
        description: string;
        icon?: string;
        imageUrl?: string;
    }>;
    pages?: Array<{
        title: string;
        type: string;
        content: string;
    }>;
}

/**
 * Seed data matching projects.json in the Backend.
 * Updated to match the latest backend seed data.
 */
const SEED_PROJECTS: RawProjectData[] = [
    {
        title: "Ark.Alliance Trading Ecosystem",
        description: "A high-frequency crypto trading bot and ecosystem featuring a cyberpunk dashboard, real-time WebSocket streaming, and AI-driven trend detection. Built on a microservices architecture with a focus on resilience and speed.",
        status: "In Progress",
        isFeatured: true,
        imageUrl: "/assets/Bot10.PNG",
        repoUrl: "https://github.com/ark/alliance",
        demoUrl: "https://ark-alliance.demo",
        technologies: ["C#", "React", "TypeScript", "Python", "Docker", "Kubernetes", "Three.js", "OpenAI"],
        features: [
            { title: "Strategy Command Center", description: "The central nerve center of the operation. Visualizes PnL in real-time with sub-millisecond updates via WebSockets.", icon: "monitor", imageUrl: "/assets/Bot10.PNG" },
            { title: "3D Market Topography", description: "Interactive Three.js visualization of the order book. Peaks and valleys represent buy/sell walls.", icon: "box", imageUrl: "/assets/Bot6.PNG" },
            { title: "AI Logic Analysis", description: "Real-time introspection into the 'Gemini' AI Strategy. Shows the calculated volatility threshold and trend confidence.", icon: "cpu", imageUrl: "/assets/Bot2.PNG" },
            { title: "Logistics Matrix", description: "A grid view for managing hundreds of concurrent 'Worker' instances. Each cell represents a Docker container.", icon: "grid", imageUrl: "/assets/Bot13.PNG" },
            { title: "Configuration Console", description: "Fine-grained control over trading parameters. Changes propagate to active instances immediately.", icon: "sliders", imageUrl: "/assets/Bot5.PNG" },
            { title: "Execution Logs", description: "Live stream of order execution events. Tracks latency statistics and API weight usage.", icon: "activity", imageUrl: "/assets/Bot4.PNG" }
        ]
    },
    {
        title: "Logistics Orchestration Platform",
        description: "A comprehensive logistics supply chain platform for Ahold Delhaize, integrating TMS (Transport Management Systems), SAP, and real-time delivery tracking.",
        status: "Completed",
        isFeatured: true,
        imageUrl: "/assets/Bot13.PNG",
        technologies: ["C#", ".NET 8", "Blazor", "Azure", "SAP", "Microservices", "CQRS"],
        features: [
            { title: "TMS Integration", description: "Seamless connecting with Ortec & Axiodis TMS.", icon: "truck" },
            { title: "Global Tracking", description: "Real-time visibility into delivery status across Europe.", icon: "map" }
        ]
    },
    {
        title: "Live Show Control System",
        description: "Real-time audiovisual synchronization system for immersive live performances.",
        status: "Completed",
        imageUrl: "/assets/Bot6.PNG",
        technologies: ["C++", "Python", "Unity", "C#"],
        features: [
            { title: "AV Sync", description: "Frame-perfect synchronization.", icon: "music" },
            { title: "3D Visuals", description: "Real-time stereoscopic 3D content.", icon: "box" }
        ]
    },
    {
        title: "Asset Position Integration",
        description: "Financial system integration bridging legacy Mainframe data with modern web interfaces.",
        status: "Completed",
        imageUrl: "/assets/Bot12.PNG",
        technologies: ["C#", ".NET 5", "Docker", "MQSeries", "Cobol"],
        features: [
            { title: "Legacy Bridge", description: "Secure communication with Mainframe.", icon: "server" }
        ]
    },
    // Additional portfolio projects for comprehensive mock data
    {
        title: "Ark.Portfolio - AI-Powered Portfolio CMS",
        description: "Enterprise-grade, AI-powered portfolio platform combining comprehensive content management with multi-provider AI integration (OpenAI, Anthropic, Google Gemini), static site export capabilities, and end-to-end type safety.",
        status: "Featured",
        isFeatured: true,
        imageUrl: "/Assets/Projects/Ark.Portfolio/portfolio-hero.png",
        repoUrl: "https://github.com/M2H-Machine-to-Human-Race/Ark.Alliance.Portfolio",
        technologies: ["react", "typescript", "nodejs", "express", "sqlite", "rest", "openai", "anthropic", "gemini"],
        features: [
            { title: "Multi-Provider AI Integration", description: "Seamlessly integrated with OpenAI GPT-4, Anthropic Claude 3, and Google Gemini", icon: "brain" },
            { title: "Comprehensive CMS", description: "Full-featured content management system with 20 TypeORM entities", icon: "database" },
            { title: "Static Site Export", description: "One-click generation of deployable static websites from CMS content", icon: "download" },
            { title: "Enterprise Architecture", description: "Clean three-tier architecture with MVVM pattern", icon: "sitemap" },
            { title: "Production-Grade Security", description: "JWT authentication, bcrypt password hashing, Helmet security headers", icon: "shield-alt" },
            { title: "Dynamic Theming", description: "Runtime theme switching with CSS variable injection", icon: "palette" }
        ]
    },
    {
        title: "Ark.Alliance.React.Component.UI",
        description: "Enterprise-grade React component library with MVVM architecture spanning 40 component categories across Finance/Trading, Healthcare, Logistics, E-Commerce, AI/ML, and more.",
        status: "In Progress",
        imageUrl: "/Assets/Projects/Ark.Alliance.React.Component/components-hero.png",
        repoUrl: "https://github.com/ArmandRicheletKleinberg/Ark.Alliance.React.Component.UI",
        packageUrl: "https://www.npmjs.com/package/@ark-alliance/react-ui",
        technologies: ["react", "typescript", "tailwind", "threejs", "docker"],
        features: [
            { title: "MVVM Architecture Pattern", description: "Strict Model-View-ViewModel separation with Zod schema-based models", icon: "layer-group" },
            { title: "40 Component Categories", description: "Comprehensive component suite spanning Buttons, Cards, Gauges, Input variants", icon: "th" },
            { title: "Multi-Domain Support", description: "Components designed for Finance/Trading, Healthcare, Logistics, and more", icon: "industry" },
            { title: "Runtime Zod Validation", description: "All models use Zod 4 schemas for runtime type checking", icon: "check-circle" },
            { title: "Premium Visual Modes", description: "Four distinct visual modes: Normal, Neon, Minimal, and Glass", icon: "palette" },
            { title: "100% Test Coverage", description: "258 tests passing with Vitest and React Testing Library", icon: "vial" }
        ]
    },
    {
        title: "Ark.Alliance.Trading.Providers.Lib",
        description: "Production-ready TypeScript SDK unifying cryptocurrency trading across multiple exchanges (Binance Futures, Deribit) with a single, elegant API.",
        status: "In Progress",
        imageUrl: "/Assets/Projects/Ark.Alliance.Trading.Providers.Lib/trading-hero.png",
        repoUrl: "https://github.com/ArmandRicheletKleinberg/Ark.Alliance.Trading.Providers.Lib",
        packageUrl: "https://www.npmjs.com/package/ark-alliance-trading-providers-lib",
        technologies: ["typescript", "nodejs", "docker", "binance", "rest"],
        features: [
            { title: "Multi-Provider Abstraction", description: "Unified interface for Binance Futures and Deribit exchanges", icon: "plug" },
            { title: "Result Pattern Error Handling", description: "Type-safe Result<T> pattern for functional error handling", icon: "check-circle" },
            { title: "Real-Time WebSocket Streams", description: "Low-latency market data via WebSocket connections", icon: "wifi" },
            { title: "Secure Authentication", description: "HMAC-SHA256 and Ed25519 signature generation", icon: "lock" },
            { title: "Comprehensive Testing", description: "70+ test scenarios with ReflectionTestEngine", icon: "vial" },
            { title: "Clean Architecture", description: "Domain-driven design with clear layer separation", icon: "sitemap" }
        ]
    }
];

/**
 * Maps status string from seed data to ProjectStatus enum.
 */
function mapStatus(status: string): ProjectStatus {
    switch (status.toLowerCase()) {
        case 'featured': return ProjectStatus.IN_PROGRESS;
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
        isFeatured: raw.isFeatured,
        imageUrl: raw.imageUrl,
        repoUrl: raw.repoUrl,
        demoUrl: raw.demoUrl,
        packageUrl: raw.packageUrl,
        technologies: raw.technologies,
        features: raw.features?.map((f, i) => ({
            id: `f${index + 1}-${i + 1}`,
            title: f.title,
            description: f.description,
            icon: f.icon,
            imageUrl: f.imageUrl
        } as ProjectFeatureDto))
    };
}

/**
 * Mock projects data derived from the backend seed file (projects.json).
 * This is the SINGLE SOURCE OF TRUTH for test data and fallback.
 * 
 * Includes both the original backend seed projects and portfolio showcase projects.
 */
export const MOCK_PROJECTS: ProjectDto[] = SEED_PROJECTS.map(toProjectDto);

/**
 * Get featured projects only.
 */
export const MOCK_FEATURED_PROJECTS: ProjectDto[] = MOCK_PROJECTS.filter(p => p.isFeatured);
