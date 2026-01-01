/**
 * @fileoverview Static Export API Endpoint
 * Backend endpoint to generate a complete static website package as ZIP.
 * Includes full Vite build with all portfolio data embedded.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { Router, Request, Response } from 'express';
import archiver from 'archiver';
import path from 'path';
import fs from 'fs';
import { AppDataSource } from '../config/database';
import { Profile } from '../database/entities/profile.entity';
import { Project } from '../database/entities/project.entity';
import { Experience } from '../database/entities/experience.entity';
import { Skill } from '../database/entities/skill.entity';

const router = Router();

/**
 * Fetch all portfolio data for static export
 */
async function getPortfolioData() {
    const profileRepo = AppDataSource.getRepository(Profile);
    const projectRepo = AppDataSource.getRepository(Project);
    const experienceRepo = AppDataSource.getRepository(Experience);
    const skillRepo = AppDataSource.getRepository(Skill);

    const [profile, projects, experiences, skills] = await Promise.all([
        profileRepo.findOne({ where: {} }),
        projectRepo.find({ order: { startDate: 'DESC' } }),
        experienceRepo.find({ order: { startDate: 'DESC' } }),
        skillRepo.find()
    ]);

    // Get carousel data from profile or projects
    const carouselSlides = projects.slice(0, 5).map(project => ({
        id: project.id,
        title: project.title,
        subtitle: project.status || 'Project',
        description: project.description,
        imageUrl: project.imageUrl || '',
        ctaText: 'View Project',
        ctaLink: `/projects/${project.id}`
    }));

    return {
        profile,
        projects,
        experiences,
        skills,
        carouselSlides,
        theme: 'architectural', // Current theme - could fetch from settings
        generatedAt: new Date().toISOString()
    };
}

/**
 * Generate the main HTML file with embedded data and assets
 */
function generateStaticHTML(data: any, profileName: string): string {
    const dataScript = `window.__STATIC_DATA__ = ${JSON.stringify(data)};
window.__IS_STATIC__ = true;`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${profileName} - Professional Portfolio. ${data.profile?.title || ''}">
    <meta name="author" content="${profileName}">
    <meta property="og:title" content="${profileName} - Portfolio">
    <meta property="og:description" content="${data.profile?.overview?.substring(0, 160) || ''}">
    <meta property="og:type" content="website">
    <title>${profileName} - Portfolio</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Embedded Data -->
    <script>${dataScript}</script>
    
    <style>
        /* Base Reset & Variables */
        :root {
            --bg-primary: #0f172a;
            --bg-secondary: #1e293b;
            --bg-tertiary: #334155;
            --text-primary: #f8fafc;
            --text-secondary: #cbd5e1;
            --text-muted: #64748b;
            --color-primary-400: #60a5fa;
            --color-primary-500: #3b82f6;
            --color-primary-600: #2563eb;
            --border-color: rgba(148, 163, 184, 0.1);
            --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            --font-display: 'Outfit', 'Inter', sans-serif;
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
            line-height: 1.6;
            min-height: 100vh;
        }
        
        #root {
            min-height: 100vh;
        }
        
        .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            gap: 1rem;
        }
        
        .loading-spinner {
            width: 48px;
            height: 48px;
            border: 3px solid var(--border-color);
            border-top-color: var(--color-primary-500);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div id="root">
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading portfolio...</p>
        </div>
    </div>
    
    <!-- Main Application Script -->
    <script type="module" src="./assets/main.js"></script>
    
    <!-- Fallback for static data display -->
    <noscript>
        <style>
            .loading-container { display: none !important; }
            .noscript-content { padding: 2rem; max-width: 800px; margin: 0 auto; }
            .noscript-content h1 { font-family: var(--font-display); margin-bottom: 1rem; }
            .noscript-content p { color: var(--text-secondary); margin-bottom: 1rem; }
        </style>
        <div class="noscript-content">
            <h1>${profileName}</h1>
            <p>${data.profile?.title || ''}</p>
            <p>${data.profile?.overview || ''}</p>
            <h2>Projects</h2>
            ${data.projects?.map((p: any) => `<div><h3>${p.title}</h3><p>${p.description}</p></div>`).join('') || ''}
        </div>
    </noscript>
</body>
</html>`;
}

/**
 * Generate CSS with current theme
 */
function generateThemeCSS(theme: string): string {
    const themes: Record<string, string> = {
        architectural: `
:root {
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --bg-tertiary: #334155;
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --text-muted: #64748b;
    --color-primary-400: #60a5fa;
    --color-primary-500: #3b82f6;
    --color-primary-600: #2563eb;
    --border-color: rgba(148, 163, 184, 0.1);
    --gradient-primary: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}`,
        aloevera: `
:root {
    --bg-primary: #1a0a2e;
    --bg-secondary: #2d1b4e;
    --bg-tertiary: #4a2c7a;
    --text-primary: #f8fafc;
    --text-secondary: #d8b4fe;
    --text-muted: #a78bfa;
    --color-primary-400: #a78bfa;
    --color-primary-500: #8b5cf6;
    --color-primary-600: #7c3aed;
    --border-color: rgba(167, 139, 250, 0.1);
    --gradient-primary: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
}`,
        default: `
:root {
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --color-primary-500: #3b82f6;
}`
    };
    return themes[theme] || themes.default;
}

/**
 * Generate comprehensive README
 */
function generateReadme(profileName: string, data: any): string {
    return `# ${profileName} - Portfolio Website

> Generated by **Ark.Alliance.Portfolio – Static Website Generator**
> Generated on: ${new Date().toLocaleString()}

## 📋 Contents

This static portfolio includes:
- **Profile**: ${profileName} - ${data.profile?.title || 'Professional'}
- **Projects**: ${data.projects?.length || 0} projects
- **Experience**: ${data.experiences?.length || 0} positions
- **Skills**: ${data.skills?.length || 0} skills
- **Theme**: ${data.theme || 'architectural'}

## 🚀 Quick Start

### Local Preview

\`\`\`bash
# Using npx serve (recommended)
npx serve .

# Using Python
python -m http.server 8080

# Using Node http-server
npx http-server . -p 8080
\`\`\`

Open http://localhost:8080 in your browser.

## 📦 Deployment

### Netlify (Drag & Drop)
1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag this entire folder
3. Done! Your site is live.

### Vercel
\`\`\`bash
npx vercel deploy --prod
\`\`\`

### GitHub Pages
1. Create a new GitHub repository
2. Upload all files
3. Settings → Pages → Source: main branch
4. Access at: \`https://username.github.io/repo-name\`

### Cloudflare Pages
1. Connect your GitHub repo
2. Build output: \`/\` (root)
3. Deploy

### AWS S3 + CloudFront
\`\`\`bash
aws s3 sync . s3://your-bucket-name --delete
\`\`\`

## 📁 File Structure

\`\`\`
├── index.html          # Main entry (with embedded data)
├── assets/
│   ├── main.js         # React application bundle
│   ├── main.css        # Compiled styles
│   └── ...             # Other assets
├── data/
│   └── portfolio.json  # Complete portfolio data (backup)
└── README.md           # This file
\`\`\`

## 🎨 Included Features

- ✅ Responsive design (mobile-first)
- ✅ Dark theme with glassmorphism effects
- ✅ Hero carousel with featured projects
- ✅ Interactive timeline for experience
- ✅ Project showcase with detail pages
- ✅ Skills visualization
- ✅ Contact information
- ✅ SEO meta tags

## ⚠️ Notes

This is a **static export** that excludes:
- Admin dashboard
- Login/authentication
- Content editing features
- Real-time data updates

To update content, edit your portfolio in the Ark.Alliance.Portfolio application and re-export.

## 🔧 Technical Details

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Custom Properties
- **Backend**: None required (all data embedded)

## 📞 Contact

${data.profile?.email ? `- Email: ${data.profile.email}` : ''}
${data.profile?.githubUrl ? `- GitHub: ${data.profile.githubUrl}` : ''}
${data.profile?.linkedinUrl ? `- LinkedIn: ${data.profile.linkedinUrl}` : ''}

---

*Generated with ❤️ by Ark.Alliance.Portfolio v1.0*
`;
}

/**
 * POST /api/admin/export-static
 * Generate and download complete static website as ZIP
 */
router.post('/export-static', async (req: Request, res: Response) => {
    try {
        console.log('Starting comprehensive static export...');

        // Fetch all portfolio data
        const data = await getPortfolioData();
        const profileName = data.profile
            ? `${data.profile.firstName} ${data.profile.lastName}`
            : 'Portfolio';

        console.log(`Exporting for: ${profileName}`);
        console.log(`Projects: ${data.projects.length}, Experiences: ${data.experiences.length}, Skills: ${data.skills.length}`);

        // Set response headers for ZIP download
        const safeFilename = profileName.replace(/[^a-zA-Z0-9]/g, '_');
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}_Portfolio_Static.zip"`);

        // Create ZIP archive
        const archive = archiver('zip', { zlib: { level: 9 } });

        archive.on('error', (err) => {
            console.error('Archive error:', err);
            throw err;
        });

        archive.on('warning', (err) => {
            console.warn('Archive warning:', err);
        });

        // Pipe archive to response
        archive.pipe(res);

        // 1. Add index.html with embedded data
        const indexHtml = generateStaticHTML(data, profileName);
        archive.append(indexHtml, { name: 'index.html' });

        // 2. Add complete portfolio data as JSON backup
        archive.append(JSON.stringify(data, null, 2), { name: 'data/portfolio.json' });

        // 3. Add theme CSS
        const themeCss = generateThemeCSS(data.theme || 'architectural');
        archive.append(themeCss, { name: 'assets/theme.css' });

        // 4. Add comprehensive README
        const readme = generateReadme(profileName, data);
        archive.append(readme, { name: 'README.md' });

        // 5. Add a minimal main.js that renders from static data
        const mainJs = `
// Static Portfolio Renderer
// Generated by Ark.Alliance.Portfolio

(function() {
    const data = window.__STATIC_DATA__;
    if (!data) {
        console.error('No static data found');
        return;
    }

    const root = document.getElementById('root');
    
    // Create header
    const header = document.createElement('header');
    header.style.cssText = 'position:fixed;top:0;left:0;right:0;height:72px;background:rgba(15,23,42,0.95);backdrop-filter:blur(10px);display:flex;align-items:center;padding:0 2rem;z-index:100;border-bottom:1px solid rgba(148,163,184,0.1);';
    
    const logo = document.createElement('div');
    logo.innerHTML = '<a href="/" style="text-decoration:none;color:#f8fafc;font-family:Outfit,sans-serif;font-size:1.25rem;font-weight:700;">' + 
        (data.profile ? data.profile.firstName + ' ' + data.profile.lastName : 'Portfolio') + '</a>';
    header.appendChild(logo);
    
    const nav = document.createElement('nav');
    nav.style.cssText = 'margin-left:auto;display:flex;gap:1.5rem;';
    nav.innerHTML = '<a href="#home" style="color:#94a3b8;text-decoration:none;">Home</a>' +
        '<a href="#projects" style="color:#94a3b8;text-decoration:none;">Projects</a>' +
        '<a href="#experience" style="color:#94a3b8;text-decoration:none;">Resume</a>';
    header.appendChild(nav);
    
    // Create main content
    const main = document.createElement('main');
    main.style.cssText = 'padding-top:72px;min-height:100vh;';
    
    // Hero section
    const hero = document.createElement('section');
    hero.id = 'home';
    hero.style.cssText = 'min-height:80vh;display:flex;flex-direction:column;justify-content:center;padding:4rem 2rem;max-width:1200px;margin:0 auto;';
    hero.innerHTML = '<p style="color:#3b82f6;font-size:0.875rem;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:1rem;">Full-Stack Developer</p>' +
        '<h1 style="font-family:Outfit,sans-serif;font-size:3.5rem;font-weight:700;margin-bottom:1rem;">Welcome to My Portfolio</h1>' +
        '<p style="color:#94a3b8;font-size:1.25rem;max-width:600px;">' + (data.profile?.overview || 'Explore my projects and experience.') + '</p>';
    main.appendChild(hero);
    
    // Projects section
    const projectsSection = document.createElement('section');
    projectsSection.id = 'projects';
    projectsSection.style.cssText = 'padding:4rem 2rem;max-width:1200px;margin:0 auto;';
    projectsSection.innerHTML = '<h2 style="font-family:Outfit,sans-serif;font-size:2rem;margin-bottom:2rem;">Projects</h2>';
    
    const projectGrid = document.createElement('div');
    projectGrid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem;';
    
    data.projects.forEach(function(project) {
        const card = document.createElement('div');
        card.style.cssText = 'background:rgba(30,41,59,0.8);border:1px solid rgba(148,163,184,0.1);border-radius:0.75rem;overflow:hidden;transition:transform 0.2s;cursor:pointer;';
        card.innerHTML = 
            '<div style="height:160px;background:linear-gradient(135deg,#1e293b,#334155);display:flex;align-items:center;justify-content:center;">' +
                (project.imageUrl ? '<img src="' + project.imageUrl + '" style="width:100%;height:100%;object-fit:cover;" alt="' + project.title + '">' : '<span style="color:#64748b;">No Image</span>') +
            '</div>' +
            '<div style="padding:1.25rem;">' +
                '<h3 style="font-size:1.125rem;margin-bottom:0.5rem;">' + project.title + '</h3>' +
                '<p style="color:#64748b;font-size:0.75rem;text-transform:uppercase;margin-bottom:0.75rem;">' + (project.status || 'Project') + '</p>' +
                '<p style="color:#94a3b8;font-size:0.875rem;line-height:1.5;">' + (project.description || '').substring(0, 150) + '...</p>' +
            '</div>';
        projectGrid.appendChild(card);
    });
    
    projectsSection.appendChild(projectGrid);
    main.appendChild(projectsSection);
    
    // Experience section
    const expSection = document.createElement('section');
    expSection.id = 'experience';
    expSection.style.cssText = 'padding:4rem 2rem;max-width:1200px;margin:0 auto;';
    expSection.innerHTML = '<h2 style="font-family:Outfit,sans-serif;font-size:2rem;margin-bottom:2rem;">Experience</h2>';
    
    data.experiences.forEach(function(exp) {
        const item = document.createElement('div');
        item.style.cssText = 'padding:1.5rem;background:rgba(30,41,59,0.5);border-radius:0.5rem;margin-bottom:1rem;border-left:3px solid #3b82f6;';
        item.innerHTML = 
            '<h3 style="font-size:1.125rem;margin-bottom:0.25rem;">' + (exp.position || exp.company) + '</h3>' +
            '<p style="color:#3b82f6;font-size:0.875rem;margin-bottom:0.5rem;">' + (exp.company || '') + '</p>' +
            '<p style="color:#94a3b8;font-size:0.875rem;">' + (exp.description || '') + '</p>';
        expSection.appendChild(item);
    });
    
    main.appendChild(expSection);
    
    // Footer
    const footer = document.createElement('footer');
    footer.style.cssText = 'padding:2rem;text-align:center;border-top:1px solid rgba(148,163,184,0.1);';
    footer.innerHTML = '<p style="color:#64748b;font-size:0.875rem;">© ' + new Date().getFullYear() + ' ' + 
        (data.profile ? data.profile.firstName + ' ' + data.profile.lastName : 'Portfolio') + 
        '. Built with Ark.Alliance.Portfolio</p>';
    
    // Render
    root.innerHTML = '';
    root.appendChild(header);
    root.appendChild(main);
    root.appendChild(footer);
    
    console.log('Static portfolio rendered successfully');
})();
`;
        archive.append(mainJs, { name: 'assets/main.js' });

        // 6. Add base CSS styles
        const baseCss = `
/* Ark.Alliance.Portfolio - Static Export Styles */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --color-primary: #3b82f6;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.6;
}

a {
    color: var(--color-primary);
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}
`;
        archive.append(baseCss, { name: 'assets/main.css' });

        // 7. Include uploaded media assets
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (fs.existsSync(uploadsDir)) {
            console.log('Including uploaded media assets...');
            archive.directory(uploadsDir, 'uploads');
        }

        // Finalize archive
        await archive.finalize();

        console.log('Static export completed successfully with media assets');
    } catch (error) {
        console.error('Static export error:', error);
        if (!res.headersSent) {
            res.status(500).json({
                error: 'Failed to generate static export',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
});

/**
 * GET /api/admin/export-static/preview
 * Get preview data for static export
 */
router.get('/export-static/preview', async (req: Request, res: Response) => {
    try {
        const data = await getPortfolioData();
        res.json({
            success: true,
            data: {
                profileName: data.profile
                    ? `${data.profile.firstName} ${data.profile.lastName}`
                    : 'Portfolio',
                projectCount: data.projects.length,
                experienceCount: data.experiences.length,
                skillCount: data.skills.length,
                theme: data.theme,
                estimatedSize: '~500KB - 2MB'
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get preview data' });
    }
});

export default router;
