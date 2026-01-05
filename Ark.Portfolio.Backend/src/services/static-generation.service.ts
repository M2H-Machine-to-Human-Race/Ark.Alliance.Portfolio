/**
 * @fileoverview Static Generation Service
 * Orchestrates the generation of complete static React/TSX website packages.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { AppDataSource } from '../config/database';
import { Profile } from '../database/entities/profile.entity';
import { Project } from '../database/entities/project.entity';
import { Experience } from '../database/entities/experience.entity';
import { Education } from '../database/entities/education.entity';
import { Skill } from '../database/entities/skill.entity';
import { SkillCategory } from '../database/entities/skill-category.entity';
import { Language } from '../database/entities/language.entity';
import { Hobby } from '../database/entities/hobby.entity';
import { BusinessDomain } from '../database/entities/business-domain.entity';
import { CarouselItem } from '../database/entities/carousel-item.entity';
import { StyleConfig } from '../database/entities/style-config.entity';
import { PageDefinition } from '../database/entities/page-definition.entity';
import {
    StaticExportConfigDto,
    StaticExportPreviewDto,
    StaticExportResultDto,
    StaticExportStatus,
    StaticThemePreset,
    DEFAULT_STATIC_PAGES,
    DEFAULT_STATIC_EXPORT_CONFIG,
    STATIC_THEME_CSS_VARS,
    STATIC_VITE_DEPENDENCIES
} from '@ark/portfolio-share';
import archiver from 'archiver';
import { Response } from 'express';
import path from 'path';
import fs from 'fs';

/**
 * Portfolio data structure for static export.
 */
interface PortfolioData {
    profile: Profile | null;
    projects: Project[];
    experiences: Experience[];
    education: Education[];
    skills: Skill[];
    skillCategories: SkillCategory[];
    languages: Language[];
    hobbies: Hobby[];
    businessDomains: BusinessDomain[];
    carousel: CarouselItem[];
    generatedAt: string;
}

/**
 * Static Generation Service
 * Handles the complete static site generation workflow.
 */
export class StaticGenerationService {
    private profileRepo = AppDataSource.getRepository(Profile);
    private projectRepo = AppDataSource.getRepository(Project);
    private experienceRepo = AppDataSource.getRepository(Experience);
    private educationRepo = AppDataSource.getRepository(Education);
    private skillRepo = AppDataSource.getRepository(Skill);
    private skillCategoryRepo = AppDataSource.getRepository(SkillCategory);
    private languageRepo = AppDataSource.getRepository(Language);
    private hobbyRepo = AppDataSource.getRepository(Hobby);
    private domainRepo = AppDataSource.getRepository(BusinessDomain);
    private carouselRepo = AppDataSource.getRepository(CarouselItem);
    private styleRepo = AppDataSource.getRepository(StyleConfig);
    private pageDefRepo = AppDataSource.getRepository(PageDefinition);

    /**
     * Get preview data for export.
     */
    async getExportPreview(): Promise<StaticExportPreviewDto> {
        const [profile, projects, experiences, skills, languages, hobbies, domains, pageDefs] = await Promise.all([
            this.profileRepo.findOne({ where: {} }),
            this.projectRepo.find(),
            this.experienceRepo.find(),
            this.skillRepo.find(),
            this.languageRepo.find(),
            this.hobbyRepo.find(),
            this.domainRepo.find(),
            this.pageDefRepo.find({ where: { isEnabled: true }, order: { displayOrder: 'ASC' } })
        ]);

        const profileName = profile ? `${profile.firstName} ${profile.lastName}` : 'Portfolio';

        return {
            profileName,
            projectCount: projects.length,
            experienceCount: experiences.length,
            skillCount: skills.length,
            languageCount: languages.length,
            hobbyCount: hobbies.length,
            domainCount: domains.length,
            theme: StaticThemePreset.ARCHITECTURAL,
            estimatedSize: '~1-3MB',
            pages: pageDefs.length > 0 ? pageDefs.map(p => ({
                pageType: p.pageType,
                title: p.title,
                route: p.route,
                isEnabled: p.isEnabled,
                displayOrder: p.displayOrder,
            })) : DEFAULT_STATIC_PAGES
        };
    }

    /**
     * Fetch all portfolio data.
     */
    async getPortfolioData(): Promise<PortfolioData> {
        const [
            profile, projects, experiences, education,
            skills, skillCategories, languages, hobbies,
            businessDomains, carousel
        ] = await Promise.all([
            this.profileRepo.findOne({ where: {} }),
            this.projectRepo.find({ order: { startDate: 'DESC' } }),
            this.experienceRepo.find({ order: { startDate: 'DESC' } }),
            this.educationRepo.find({ order: { startDate: 'DESC' } }),
            this.skillRepo.find({ order: { displayOrder: 'ASC' } }),
            this.skillCategoryRepo.find({ order: { displayOrder: 'ASC' } }),
            this.languageRepo.find({ order: { displayOrder: 'ASC' } }),
            this.hobbyRepo.find({ order: { displayOrder: 'ASC' } }),
            this.domainRepo.find({ order: { displayOrder: 'ASC' } }),
            this.carouselRepo.find({ where: { isActive: true }, order: { order: 'ASC' } })
        ]);

        return {
            profile,
            projects,
            experiences,
            education,
            skills,
            skillCategories,
            languages,
            hobbies,
            businessDomains,
            carousel,
            generatedAt: new Date().toISOString()
        };
    }

    /**
     * Generate and stream static site as ZIP.
     */
    async generateStaticSite(res: Response, config?: Partial<StaticExportConfigDto>): Promise<void> {
        const data = await this.getPortfolioData();
        const profileName = data.profile
            ? `${data.profile.firstName} ${data.profile.lastName}`
            : 'Portfolio';

        const exportConfig: StaticExportConfigDto = {
            ...DEFAULT_STATIC_EXPORT_CONFIG,
            ...config,
            siteMetadata: {
                ...DEFAULT_STATIC_EXPORT_CONFIG.siteMetadata,
                title: `${profileName} - Portfolio`,
                description: data.profile?.overview || '',
                author: profileName,
                ...config?.siteMetadata
            }
        };

        console.log(`[StaticGen] Starting export for: ${profileName}`);
        console.log(`[StaticGen] Projects: ${data.projects.length}, Experiences: ${data.experiences.length}`);

        // Set response headers
        const safeFilename = profileName.replace(/[^a-zA-Z0-9]/g, '_');
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}_Portfolio_Static.zip"`);

        // Create archive
        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.on('error', (err) => { throw err; });
        archive.pipe(res);

        // Generate project structure
        this.addPackageJson(archive, profileName);
        this.addViteConfig(archive);
        this.addTsConfig(archive);
        this.addIndexHtml(archive, profileName, data);
        this.addMainTsx(archive);
        this.addAppTsx(archive, data);
        this.addPortfolioData(archive, data);
        this.addStyles(archive, exportConfig.theme);
        this.addComponents(archive);
        this.addPages(archive, data);
        this.addReadme(archive, profileName, data);
        await this.addAssets(archive);

        await archive.finalize();
        console.log(`[StaticGen] Export completed successfully`);
    }

    /**
     * Add package.json
     */
    private addPackageJson(archive: archiver.Archiver, profileName: string): void {
        const pkg = {
            name: profileName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-portfolio',
            version: '1.0.0',
            description: `${profileName}'s Portfolio - Static Website`,
            type: 'module',
            scripts: {
                dev: 'vite',
                build: 'tsc && vite build',
                preview: 'vite preview'
            },
            ...STATIC_VITE_DEPENDENCIES,
            author: profileName,
            license: 'MIT',
            keywords: ['portfolio', 'react', 'typescript', 'vite']
        };
        archive.append(JSON.stringify(pkg, null, 2), { name: 'package.json' });
    }

    /**
     * Add vite.config.ts
     */
    private addViteConfig(archive: archiver.Archiver): void {
        const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: './',
    build: {
        outDir: 'dist',
        sourcemap: false
    }
})
`;
        archive.append(viteConfig, { name: 'vite.config.ts' });
    }

    /**
     * Add tsconfig.json
     */
    private addTsConfig(archive: archiver.Archiver): void {
        const tsConfig = {
            compilerOptions: {
                target: 'ES2020',
                useDefineForClassFields: true,
                lib: ['ES2020', 'DOM', 'DOM.Iterable'],
                module: 'ESNext',
                skipLibCheck: true,
                moduleResolution: 'bundler',
                allowImportingTsExtensions: true,
                resolveJsonModule: true,
                isolatedModules: true,
                noEmit: true,
                jsx: 'react-jsx',
                strict: true,
                noUnusedLocals: true,
                noUnusedParameters: true,
                noFallthroughCasesInSwitch: true
            },
            include: ['src'],
            references: [{ path: './tsconfig.node.json' }]
        };
        archive.append(JSON.stringify(tsConfig, null, 2), { name: 'tsconfig.json' });

        const tsNodeConfig = {
            compilerOptions: {
                composite: true,
                skipLibCheck: true,
                module: 'ESNext',
                moduleResolution: 'bundler',
                allowSyntheticDefaultImports: true
            },
            include: ['vite.config.ts']
        };
        archive.append(JSON.stringify(tsNodeConfig, null, 2), { name: 'tsconfig.node.json' });
    }

    /**
     * Add index.html
     */
    private addIndexHtml(archive: archiver.Archiver, profileName: string, data: PortfolioData): void {
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${profileName} - Professional Portfolio. ${data.profile?.title || ''}">
    <meta name="author" content="${profileName}">
    <meta property="og:title" content="${profileName} - Portfolio">
    <meta property="og:description" content="${data.profile?.overview?.substring(0, 160) || ''}">
    <meta property="og:type" content="website">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
    <title>${profileName} - Portfolio</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
        archive.append(html, { name: 'index.html' });
    }

    /**
     * Add main.tsx
     */
    private addMainTsx(archive: archiver.Archiver): void {
        const mainTsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
)
`;
        archive.append(mainTsx, { name: 'src/main.tsx' });
    }

    /**
     * Add App.tsx with public routes only (NO admin routes)
     */
    private addAppTsx(archive: archiver.Archiver, data: PortfolioData): void {
        const appTsx = `import { Routes, Route, Navigate } from 'react-router-dom'
import { HomePage } from './pages/Home'
import { ResumePage } from './pages/Resume'
import { ProjectsPage } from './pages/Projects'
import { ProjectDetailPage } from './pages/ProjectDetail'
import portfolioData from './data/portfolio.json'

// Portfolio data is embedded at build time
export const usePortfolioData = () => portfolioData

function App() {
    return (
        <Routes>
            {/* Public Routes Only - No Admin */}
            <Route path="/" element={<HomePage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App
`;
        archive.append(appTsx, { name: 'src/App.tsx' });
    }

    /**
     * Add portfolio data as JSON
     */
    private addPortfolioData(archive: archiver.Archiver, data: PortfolioData): void {
        archive.append(JSON.stringify(data, null, 2), { name: 'src/data/portfolio.json' });
    }

    /**
     * Add CSS styles - Professional Theme
     */
    private addStyles(archive: archiver.Archiver, theme: StaticThemePreset): void {
        const themeVars = STATIC_THEME_CSS_VARS[theme] || STATIC_THEME_CSS_VARS[StaticThemePreset.ARCHITECTURAL];
        const cssVars = Object.entries(themeVars).map(([k, v]) => `    ${k}: ${v};`).join('\n');

        const indexCss = `/* Static Portfolio - Professional Theme Styles */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');

:root {
${cssVars}
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-display: 'Outfit', 'Inter', sans-serif;
    
    /* Professional Theme Colors */
    --bg-primary: #0A0E17;
    --bg-secondary: #0F172A;
    --bg-card: rgba(15, 23, 42, 0.85);
    --text-primary: #F1F5F9;
    --text-secondary: #94A3B8;
    --text-muted: #64748B;
    --accent: #00D4FF;
    --accent-muted: #06B6D4;
    --border-color: rgba(51, 65, 85, 0.6);
    
    /* Spacing */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.25rem;
    --space-6: 1.5rem;
    --space-8: 2rem;
    --space-10: 2.5rem;
    --space-12: 3rem;
    
    /* Radii */
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    --radius-2xl: 1.5rem;
    --radius-full: 9999px;
    
    /* Shadows */
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    
    --header-height: 72px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-sans);
    background: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.7;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
}

a {
    color: var(--accent);
    text-decoration: none;
    transition: color 0.2s ease;
}

a:hover {
    color: var(--text-primary);
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 var(--space-8);
}

/* Header */
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--header-height);
    background: rgba(10, 14, 23, 0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border-color);
    z-index: 100;
    display: flex;
    align-items: center;
    padding: 0 var(--space-8);
}

.header-logo {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
}

.header-nav {
    margin-left: auto;
    display: flex;
    gap: var(--space-8);
}

.header-nav a {
    color: var(--text-secondary);
    font-size: 0.9375rem;
    font-weight: 500;
    transition: color 0.2s;
}

.header-nav a:hover,
.header-nav a.active {
    color: var(--accent);
}

/* Page Layout */
.page {
    padding-top: var(--header-height);
    min-height: 100vh;
}

.page-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: var(--space-12) var(--space-8);
}

.page-title {
    font-family: var(--font-display);
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: var(--space-4);
    letter-spacing: -0.025em;
    text-align: center;
}

.page-title span {
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-muted) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.page-subtitle {
    color: var(--text-secondary);
    font-size: 1.125rem;
    margin-bottom: var(--space-10);
    text-align: center;
}

/* Hero Card */
.hero-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-2xl);
    padding: var(--space-10);
    max-width: 900px;
    margin: var(--space-8) auto;
    font-size: 1.0625rem;
    line-height: 1.75;
    color: var(--text-secondary);
    text-align: center;
    backdrop-filter: blur(12px);
}

/* Cards - Professional */
.card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xl);
    padding: var(--space-8);
    transition: all 0.3s ease;
}

.card:hover {
    border-color: var(--accent);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    transform: translateY(-4px);
}

/* Grid */
.grid {
    display: grid;
    gap: var(--space-6);
}

.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }

@media (max-width: 1024px) {
    .grid-3 { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .page-content { padding: var(--space-8) var(--space-4); }
}

/* Buttons */
.btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-4) var(--space-6);
    font-size: 0.9375rem;
    font-weight: 600;
    border-radius: var(--radius-full);
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-primary {
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-muted) 100%);
    color: #0A0E17;
    box-shadow: 0 2px 8px rgba(0, 212, 255, 0.3);
}

.btn-primary:hover {
    box-shadow: 0 4px 16px rgba(0, 212, 255, 0.4);
    transform: translateY(-2px);
}

/* Tab Navigation - Pills */
.tab-container {
    display: flex;
    justify-content: center;
    margin-bottom: var(--space-10);
}

.tab-pills {
    display: flex;
    gap: var(--space-2);
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    padding: 0.5rem;
    border-radius: var(--radius-full);
}

.tab-pill {
    padding: 0.875rem 1.5rem;
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--text-secondary);
    background: transparent;
    border: none;
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: all 0.2s ease;
}

.tab-pill:hover {
    background: rgba(0, 212, 255, 0.1);
    color: var(--text-primary);
}

.tab-pill.active {
    background: var(--accent);
    color: #0A0E17;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 212, 255, 0.3);
}

/* Timeline */
.timeline {
    position: relative;
    padding-left: var(--space-10);
}

.timeline::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--border-color);
}

.timeline-item {
    position: relative;
    padding-bottom: var(--space-10);
}

.timeline-item::before {
    content: '';
    position: absolute;
    left: calc(-1 * var(--space-10) - 5px);
    top: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--accent);
    border: 3px solid var(--bg-primary);
}

/* Professional Badge - Expert Level */
.badge-expert,
.domain-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.375rem 1rem;
    background: var(--accent);
    color: #0A0E17;
    border-radius: var(--radius-full);
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    box-shadow: 0 2px 8px rgba(0, 212, 255, 0.25);
}

/* Tech Chip */
.skill-badge,
.tech-chip {
    display: inline-flex;
    align-items: center;
    padding: 0.375rem 0.875rem;
    background: rgba(51, 65, 85, 0.5);
    color: var(--text-secondary);
    border: 1px solid rgba(51, 65, 85, 0.6);
    border-radius: var(--radius-md);
    font-size: 0.8125rem;
    font-weight: 500;
    transition: all 0.15s ease;
}

.skill-badge:hover,
.tech-chip:hover {
    background: rgba(0, 212, 255, 0.1);
    border-color: rgba(0, 212, 255, 0.3);
    color: var(--text-primary);
}

/* Hobby Icon */
.hobby-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: rgba(0, 212, 255, 0.1);
    color: var(--accent);
    border: 1px solid rgba(0, 212, 255, 0.2);
    border-radius: var(--radius-lg);
    font-size: 1.5rem;
    margin-bottom: var(--space-3);
}

/* Project Card */
.project-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xl);
    overflow: hidden;
    transition: all 0.3s ease;
}

.project-card:hover {
    border-color: var(--accent);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5), 0 0 1px rgba(0, 212, 255, 0.4);
    transform: translateY(-6px);
}

.project-card-image {
    width: 100%;
    height: 220px;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.project-card:hover .project-card-image {
    transform: scale(1.05);
}

.project-card-content {
    padding: var(--space-6);
}

.project-card-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--space-2);
}

.project-card-description {
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: var(--space-4);
}

/* Link Arrow Animation */
.link-arrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--accent);
    font-weight: 500;
    transition: all 0.2s ease;
}

.link-arrow:hover {
    gap: 0.75rem;
    color: var(--text-primary);
}

/* Featured Badge */
.badge-featured {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    background: var(--accent);
    color: #0A0E17;
    border-radius: var(--radius-full);
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* Star Rating */
.star-rating {
    display: flex;
    align-items: center;
    gap: 2px;
}

.star-filled {
    color: #f59e0b;
}

.star-empty {
    color: rgba(100, 116, 139, 0.3);
}

/* Carousel */
.carousel {
    position: relative;
    overflow: hidden;
    border-radius: var(--radius-xl);
    margin-bottom: var(--space-12);
}

.carousel-slide {
    position: relative;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background-position: center;
}

.carousel-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(10, 14, 23, 0.9) 0%, rgba(10, 14, 23, 0.5) 100%);
}

.carousel-content {
    position: relative;
    z-index: 1;
    padding: var(--space-12);
    max-width: 600px;
}

.carousel-title {
    font-family: var(--font-display);
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--space-4);
}

.carousel-subtitle {
    font-size: 1.125rem;
    color: var(--text-secondary);
    margin-bottom: var(--space-6);
    line-height: 1.7;
}

.carousel-dots {
    display: flex;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-4) 0;
}

.carousel-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--border-color);
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
}

.carousel-dot.active {
    background: var(--accent);
    box-shadow: 0 0 8px rgba(0, 212, 255, 0.4);
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(12px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-in {
    animation: fadeIn 0.4s ease-out forwards;
}

.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
`;
        archive.append(indexCss, { name: 'src/styles/index.css' });
    }

    /**
     * Add reusable components
     */
    private addComponents(archive: archiver.Archiver): void {
        // Header component
        const headerTsx = `import { NavLink } from 'react-router-dom'
import { usePortfolioData } from '../App'

export const Header = () => {
    const data = usePortfolioData()
    const profileName = data.profile 
        ? \`\${data.profile.firstName} \${data.profile.lastName}\`
        : 'Portfolio'
    
    return (
        <header className="header">
            <NavLink to="/" className="header-logo">{profileName}</NavLink>
            <nav className="header-nav">
                <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
                <NavLink to="/resume" className={({ isActive }) => isActive ? 'active' : ''}>Resume</NavLink>
                <NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''}>Projects</NavLink>
            </nav>
        </header>
    )
}
`;
        archive.append(headerTsx, { name: 'src/components/Header.tsx' });

        // Footer component
        const footerTsx = `import { usePortfolioData } from '../App'

export const Footer = () => {
    const data = usePortfolioData()
    const profileName = data.profile 
        ? \`\${data.profile.firstName} \${data.profile.lastName}\`
        : 'Portfolio'
    
    return (
        <footer style={{
            padding: '2rem',
            textAlign: 'center',
            borderTop: '1px solid var(--border-color)',
            marginTop: 'auto'
        }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                © {new Date().getFullYear()} {profileName}. Built with Ark.Alliance.Portfolio
            </p>
        </footer>
    )
}
`;
        archive.append(footerTsx, { name: 'src/components/Footer.tsx' });

        // Components index
        archive.append(`export * from './Header'\nexport * from './Footer'\n`, { name: 'src/components/index.ts' });
    }

    /**
     * Add page components
     */
    private addPages(archive: archiver.Archiver, data: PortfolioData): void {
        // Home page with carousel
        const homeTsx = `import { useState, useEffect } from 'react'
import { Header, Footer } from '../components'
import { usePortfolioData } from '../App'
import { Link } from 'react-router-dom'

export const HomePage = () => {
    const data = usePortfolioData()
    const profile = data.profile
    const carousel = data.carousel || []
    const [currentSlide, setCurrentSlide] = useState(0)
    
    // Auto-advance carousel
    useEffect(() => {
        if (carousel.length <= 1) return
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % carousel.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [carousel.length])
    
    return (
        <div className="page">
            <Header />
            <main className="page-content" style={{ paddingTop: '4rem' }}>
                {/* Carousel Section */}
                {carousel.length > 0 && (
                    <section className="carousel-section" style={{ marginBottom: '4rem' }}>
                        <div className="carousel-container" style={{
                            position: 'relative',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)'
                        }}>
                            {carousel.map((item, index) => (
                                <div 
                                    key={item.id} 
                                    className="carousel-slide"
                                    style={{
                                        display: index === currentSlide ? 'block' : 'none',
                                        padding: '3rem',
                                        textAlign: 'center',
                                        minHeight: '300px',
                                        backgroundImage: item.imageUrl ? \`url(\${item.imageUrl})\` : undefined,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{
                                        position: 'relative',
                                        zIndex: 1,
                                        background: 'rgba(0,0,0,0.6)',
                                        padding: '2rem',
                                        borderRadius: '8px',
                                        display: 'inline-block'
                                    }}>
                                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1rem' }}>
                                            {item.title}
                                        </h2>
                                        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
                                            {item.subtitle}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {carousel.length > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
                                    {carousel.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentSlide(index)}
                                            style={{
                                                width: '10px',
                                                height: '10px',
                                                borderRadius: '50%',
                                                border: 'none',
                                                background: index === currentSlide ? 'var(--color-primary-500)' : 'var(--border-color)',
                                                cursor: 'pointer'
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                )}
                
                {/* Hero Section - Professional */}
                <section className="animate-in" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <p style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', fontWeight: 500 }}>
                        {profile?.title || 'Welcome'}
                    </p>
                    <h1 className="page-title" style={{ marginBottom: '1.5rem' }}>
                        {profile ? \`\${profile.firstName} \` : 'Portfolio'}
                        <span>{profile?.lastName || ''}</span>
                    </h1>
                    {profile?.overview && (
                        <div className="hero-card" style={{ marginBottom: '2rem' }}>
                            {profile.overview}
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/projects" className="btn btn-primary">View Projects →</Link>
                        <Link to="/resume" className="btn" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                            View Resume
                        </Link>
                    </div>
                </section>
                
                {/* Recent Projects */}
                <section>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                        Recent Projects
                    </h2>
                    <div className="grid grid-3">
                        {data.projects.slice(0, 3).map(project => (
                            <Link key={project.id} to={\`/projects/\${project.id}\`} className="card" style={{ textDecoration: 'none' }}>
                                <h3 style={{ marginBottom: '0.5rem' }}>{project.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    {project.description?.substring(0, 100)}...
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
`;
        archive.append(homeTsx, { name: 'src/pages/Home.tsx' });

        // Resume page with tabs (matching Admin pattern)
        const resumeTsx = `import { useState } from 'react'
import { Header, Footer } from '../components'
import { usePortfolioData } from '../App'

// Tab definition
const RESUME_TABS = [
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'skills', label: 'Skills', icon: '💻' },
    { id: 'languages', label: 'Languages', icon: '🌐' },
    { id: 'domains', label: 'Domains', icon: '🏛️' },
    { id: 'hobbies', label: 'Hobbies', icon: '❤️' },
]

export const ResumePage = () => {
    const data = usePortfolioData()
    const [activeTab, setActiveTab] = useState('experience')
    
    // Helper to render star rating
    const renderStars = (value: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{ color: i < value ? '#f59e0b' : 'rgba(100, 116, 139, 0.3)' }}>★</span>
        ))
    }
    
    // Filter tabs based on available data
    const availableTabs = RESUME_TABS.filter(tab => {
        switch (tab.id) {
            case 'experience': return data.experiences?.length > 0
            case 'education': return data.education?.length > 0
            case 'skills': return data.skills?.length > 0
            case 'languages': return data.languages?.length > 0
            case 'domains': return data.businessDomains?.length > 0
            case 'hobbies': return data.hobbies?.length > 0
            default: return true
        }
    })
    
    return (
        <div className="page">
            <Header />
            <main className="page-content">
                <h1 className="page-title">Resume</h1>
                <p className="page-subtitle">Professional experience, education, and skills</p>
                
                {/* Tab Navigation - Pills Style */}
                <div className="tab-container">
                    <div className="tab-pills">
                        {availableTabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={\`tab-pill \${activeTab === tab.id ? 'active' : ''}\`}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Tab Content */}
                <div className="resume-tab-content">
                    {/* Experience Tab */}
                    {activeTab === 'experience' && (
                        <div className="timeline">
                            {data.experiences.map(exp => (
                                <div key={exp.id} className="timeline-item">
                                    <h3>{exp.position}</h3>
                                    <p style={{ color: 'var(--color-primary-500)' }}>{exp.company}</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        {exp.startDate} - {exp.endDate || 'Present'}
                                    </p>
                                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Education Tab */}
                    {activeTab === 'education' && (
                        <div className="timeline">
                            {data.education.map(edu => (
                                <div key={edu.id} className="timeline-item">
                                    <h3>{edu.degree}</h3>
                                    <p style={{ color: 'var(--color-primary-500)' }}>{edu.institution}</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        {edu.startDate} - {edu.endDate || 'Present'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Skills Tab */}
                    {activeTab === 'skills' && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {data.skills.map(skill => (
                                <span key={skill.id} className="skill-badge">{skill.name}</span>
                            ))}
                        </div>
                    )}
                    
                    {/* Languages Tab */}
                    {activeTab === 'languages' && data.languages && (
                        <div className="grid grid-3">
                            {data.languages.map(lang => (
                                <div key={lang.id} className="card">
                                    <h3 style={{ marginBottom: '1rem' }}>{lang.language}</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Speaking</span>
                                            <span>{renderStars(lang.speaking)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Writing</span>
                                            <span>{renderStars(lang.writing)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Presenting</span>
                                            <span>{renderStars(lang.presenting)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Domains Tab */}
                    {activeTab === 'domains' && data.businessDomains && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {data.businessDomains.map(domain => (
                                <div key={domain.id} className="card">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                        <h3 style={{ margin: 0 }}>{domain.domain}</h3>
                                        <span className="domain-badge">{domain.level}</span>
                                        {domain.yearsOfExperience && (
                                            <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                                                {domain.yearsOfExperience} years
                                            </span>
                                        )}
                                    </div>
                                    {domain.description && (
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                                            {domain.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Hobbies Tab */}
                    {activeTab === 'hobbies' && data.hobbies && (
                        <div className="grid grid-3">
                            {data.hobbies.map(hobby => (
                                <div key={hobby.id} className="card" style={{ textAlign: 'center' }}>
                                    {hobby.icon && (
                                        <div className="hobby-icon">{hobby.icon}</div>
                                    )}
                                    <h3 style={{ marginBottom: '0.5rem' }}>{hobby.name}</h3>
                                    {hobby.description && (
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                            {hobby.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
`;
        archive.append(resumeTsx, { name: 'src/pages/Resume.tsx' });

        // Projects page
        const projectsTsx = `import { Header, Footer } from '../components'
import { usePortfolioData } from '../App'
import { Link } from 'react-router-dom'

export const ProjectsPage = () => {
    const data = usePortfolioData()
    
    return (
        <div className="page">
            <Header />
            <main className="page-content">
                <h1 className="page-title">Projects</h1>
                <p className="page-subtitle">A showcase of my work and technical projects</p>
                
                <div className="grid grid-2">
                    {data.projects.map(project => (
                        <Link key={project.id} to={\`/projects/\${project.id}\`} className="card" style={{ textDecoration: 'none' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>{project.title}</h3>
                            <p style={{ color: 'var(--color-primary-500)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                                {project.status}
                            </p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                {project.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    )
}
`;
        archive.append(projectsTsx, { name: 'src/pages/Projects.tsx' });

        // Project detail page
        const projectDetailTsx = `import { useParams, Link } from 'react-router-dom'
import { Header, Footer } from '../components'
import { usePortfolioData } from '../App'

export const ProjectDetailPage = () => {
    const { id } = useParams()
    const data = usePortfolioData()
    const project = data.projects.find(p => String(p.id) === id)
    
    if (!project) {
        return (
            <div className="page">
                <Header />
                <main className="page-content" style={{ textAlign: 'center' }}>
                    <h1>Project Not Found</h1>
                    <Link to="/projects" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Back to Projects
                    </Link>
                </main>
                <Footer />
            </div>
        )
    }
    
    return (
        <div className="page">
            <Header />
            <main className="page-content">
                <Link to="/projects" style={{ color: 'var(--text-muted)', marginBottom: '1rem', display: 'block' }}>
                    ← Back to Projects
                </Link>
                <h1 className="page-title">{project.title}</h1>
                <p style={{ color: 'var(--color-primary-500)', marginBottom: '1rem' }}>{project.status}</p>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
                    {project.description}
                </p>
                
                {project.repositoryUrl && (
                    <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        View Repository
                    </a>
                )}
            </main>
            <Footer />
        </div>
    )
}
`;
        archive.append(projectDetailTsx, { name: 'src/pages/ProjectDetail.tsx' });

        // Pages index
        archive.append(`export * from './Home'
export * from './Resume'
export * from './Projects'
export * from './ProjectDetail'
`, { name: 'src/pages/index.ts' });
    }

    /**
     * Add README with deployment guide
     */
    private addReadme(archive: archiver.Archiver, profileName: string, data: PortfolioData): void {
        const readme = `# ${profileName} - Portfolio Website

> Generated by **Ark.Alliance.Portfolio – Static Website Generator**  
> Generated on: ${new Date().toLocaleString()}

## 📋 Contents

This static portfolio includes:
- **Profile**: ${profileName} - ${data.profile?.title || 'Professional'}
- **Projects**: ${data.projects.length} projects
- **Experience**: ${data.experiences.length} positions
- **Education**: ${data.education.length} entries
- **Skills**: ${data.skills.length} skills

## 🚀 Quick Start

### Install Dependencies

\`\`\`bash
npm install
\`\`\`

### Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open http://localhost:5173 in your browser.

### Build for Production

\`\`\`bash
npm run build
\`\`\`

The production bundle will be in the \`dist/\` folder.

### Preview Production Build

\`\`\`bash
npm run preview
\`\`\`

## 📦 Deployment

### Netlify (Drag & Drop)
1. Run \`npm run build\`
2. Go to [netlify.com/drop](https://app.netlify.com/drop)
3. Drag the \`dist\` folder
4. Done! Your site is live.

### Vercel
\`\`\`bash
npx vercel deploy --prod
\`\`\`

### GitHub Pages
1. Create a new GitHub repository
2. Install gh-pages: \`npm install -D gh-pages\`
3. Add to package.json scripts: \`"deploy": "gh-pages -d dist"\`
4. Run: \`npm run build && npm run deploy\`
5. Access at: \`https://username.github.io/repo-name\`

### Cloudflare Pages
1. Connect your GitHub repo
2. Build command: \`npm run build\`
3. Build output: \`dist\`
4. Deploy

### Docker
\`\`\`bash
# Build image
docker build -t portfolio .

# Run container
docker run -p 80:80 portfolio
\`\`\`

## 📁 Project Structure

\`\`\`
├── src/
│   ├── main.tsx           # React entry point
│   ├── App.tsx            # Routes (public only)
│   ├── data/
│   │   └── portfolio.json # Embedded portfolio data
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Resume.tsx
│   │   ├── Projects.tsx
│   │   └── ProjectDetail.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── styles/
│       └── index.css
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
\`\`\`

## 🎨 Features

- ✅ Responsive design
- ✅ Dark theme
- ✅ React 18 + TypeScript
- ✅ Vite build system
- ✅ Zero backend required
- ✅ SEO meta tags

## ⚠️ Note

This is a **static export** - to update content, edit your portfolio in the Ark.Alliance.Portfolio application and re-export.

---

*Generated with ❤️ by Ark.Alliance.Portfolio v1.0*
`;
        archive.append(readme, { name: 'README.md' });
    }

    /**
     * Add media assets
     */
    private async addAssets(archive: archiver.Archiver): Promise<void> {
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (fs.existsSync(uploadsDir)) {
            archive.directory(uploadsDir, 'public/uploads');
        }

        // Add assets directory if exists
        const assetsDir = path.join(process.cwd(), 'assets');
        if (fs.existsSync(assetsDir)) {
            archive.directory(assetsDir, 'public/assets');
        }
    }
}

// Export singleton instance
export const staticGenerationService = new StaticGenerationService();
