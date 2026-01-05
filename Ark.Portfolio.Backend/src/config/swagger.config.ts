import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ark Portfolio API',
            version: '1.0.0',
            description: `
## Ark.Portfolio Backend API

Complete REST API for the Ark.Portfolio application.

### API Groups:
- **Public**: Profile, Projects, Resume, Carousel, Technologies
- **Auth**: Login, Token Management
- **Admin**: Full CRUD for all entities (requires JWT)

### Authentication:
Admin endpoints require JWT Bearer token. Use \`/api/auth/login\` to obtain a token.
            `,
            contact: {
                name: 'Armand Richelet-Kleinberg',
                email: 'arkleinberg@gmail.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: '/api',
                description: 'Current Server (relative)'
            },
            {
                url: 'http://localhost:3085/api',
                description: 'Local Development (HTTP)'
            },
            {
                url: 'https://localhost:3085/api',
                description: 'Local Development (HTTPS)'
            }
        ],
        tags: [
            { name: 'Public - Profile', description: 'Portfolio owner profile information' },
            { name: 'Public - Projects', description: 'Portfolio projects and presentations' },
            { name: 'Public - Resume', description: 'CV/Resume data (experiences, skills, education)' },
            { name: 'Public - Carousel', description: 'Homepage carousel items' },
            { name: 'Public - Technologies', description: 'Technology catalog and metadata' },
            { name: 'Public - Dashboard', description: 'Dashboard and widget data' },
            { name: 'Auth', description: 'Authentication endpoints' },
            { name: 'Admin - Projects', description: 'Project management (CRUD)' },
            { name: 'Admin - Resume', description: 'Resume/CV management' },
            { name: 'Admin - Media', description: 'Media asset management' },
            { name: 'Admin - Carousel', description: 'Carousel item management' },
            { name: 'Admin - Widgets', description: 'Widget configuration' },
            { name: 'Admin - Menu', description: 'Navigation menu management' },
            { name: 'Admin - Styles', description: 'Theme and style configuration' },
            { name: 'Admin - AI', description: 'AI integration settings' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT token obtained from /api/auth/login'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        error: { type: 'string' }
                    }
                },
                Profile: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        title: { type: 'string' },
                        overview: { type: 'string' },
                        email: { type: 'string' },
                        githubUrl: { type: 'string' },
                        linkedinUrl: { type: 'string' },
                        avatarUrl: { type: 'string' }
                    }
                },
                Project: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        slug: { type: 'string' },
                        title: { type: 'string' },
                        subtitle: { type: 'string' },
                        description: { type: 'string' },
                        status: { type: 'string', enum: ['active', 'completed', 'archived'] },
                        isFeatured: { type: 'boolean' },
                        repositoryUrl: { type: 'string' },
                        demoUrl: { type: 'string' },
                        packageUrl: { type: 'string' }
                    }
                },
                CarouselItem: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        title: { type: 'string' },
                        subtitle: { type: 'string' },
                        imageUrl: { type: 'string' },
                        linkUrl: { type: 'string' },
                        order: { type: 'integer' }
                    }
                },
                Technology: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        key: { type: 'string' },
                        name: { type: 'string' },
                        label: { type: 'string' },
                        category: { type: 'string' },
                        description: { type: 'string' },
                        icon: { type: 'string' },
                        color: { type: 'string' },
                        website: { type: 'string' }
                    }
                },
                Experience: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        company: { type: 'string' },
                        position: { type: 'string' },
                        description: { type: 'string' },
                        startDate: { type: 'string', format: 'date' },
                        endDate: { type: 'string', format: 'date', nullable: true }
                    }
                },
                Skill: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        level: { type: 'string' },
                        categoryId: { type: 'integer' }
                    }
                },
                Education: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        institution: { type: 'string' },
                        degree: { type: 'string' },
                        fieldOfStudy: { type: 'string' },
                        startDate: { type: 'string', format: 'date' },
                        endDate: { type: 'string', format: 'date' }
                    }
                },
                LoginRequest: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: { type: 'string' },
                        password: { type: 'string' }
                    }
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        token: { type: 'string' },
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer' },
                                username: { type: 'string' }
                            }
                        }
                    }
                }
            }
        }
    },
    apis: [
        './src/routes/*.ts',
        './src/controllers/*.ts'
    ]
};

export const swaggerSpec = swaggerJsdoc(options);
