import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ark Portfolio API',
            version: '1.0.0',
            description: 'API documentation for Ark Portfolio Backend',
            contact: {
                name: 'Armand Richelet-Kleinberg',
                email: 'admin@ark-portfolio.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:5085/api',
                description: 'Local Development Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: [
        './src/routes/*.ts',
        './src/controllers/*.ts',
        './src/database/entities/*.ts',
        '../Ark.Portfolio.Share/dtos/*.ts' // Include DTOs from Share project
    ]
};

export const swaggerSpec = swaggerJsdoc(options);

