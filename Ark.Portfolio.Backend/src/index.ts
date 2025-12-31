import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import dotenv from 'dotenv';
import { initializeDatabase } from './database/context/db-context';
import routes from './routes';
import { killPort } from './utils/port-killer';
import { AppDataSource } from './config/database';
import { Project } from './database/entities/project.entity';
import { globalErrorHandler, notFoundHandler } from './middleware/error-handler.middleware';

dotenv.config();

const app = express();
// Default to 8085 as requested, or use ENV if provided
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5085;

app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API Routes
app.use('/api', routes);

// Swagger Documentation
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config';
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Ark Portfolio API is running');
});

// 404 handler for undefined routes (AFTER all valid routes)
app.use(notFoundHandler);

// Global error handler (MUST be last middleware)
app.use(globalErrorHandler);

/**
 * Delay helper for startup retry.
 */
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Starts the HTTP server with retry logic.
 * @param port - Port to listen on
 * @param maxRetries - Maximum retry attempts
 */
async function startHttpServer(port: number, maxRetries: number = 3): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await new Promise<void>((resolve, reject) => {
                const server = app.listen(port, () => {
                    console.log(`Server is running on port ${port}`);
                    resolve();
                });

                server.on('error', (err: NodeJS.ErrnoException) => {
                    if (err.code === 'EADDRINUSE') {
                        server.close();
                        reject(err);
                    } else {
                        reject(err);
                    }
                });
            });
            return; // Success
        } catch (err) {
            const error = err as NodeJS.ErrnoException;
            if (error.code === 'EADDRINUSE' && attempt < maxRetries) {
                console.warn(`Port ${port} still in use. Retrying in 1 second... (${attempt}/${maxRetries})`);
                await killPort(port);
                await delay(1000);
            } else {
                throw err;
            }
        }
    }
}

const startServer = async () => {
    // Ensure port is free before proceeding
    console.log(`Ensuring port ${PORT} is free...`);
    await killPort(PORT);

    // Initialize database
    await initializeDatabase();

    // Auto-Seed Check
    try {
        const projectRepo = AppDataSource.getRepository(Project);
        const count = await projectRepo.count();
        if (count === 0) {
            console.log('Database appears empty. Auto-seeding...');
            const { seedDatabase } = await import('./database/seeds/seed');
            await seedDatabase(AppDataSource);
            console.log('Auto-seeding complete.');
        } else {
            console.log(`Database already contains ${count} projects. Skipping auto-seed.`);
        }
    } catch (error) {
        console.error('Error during auto-seed check:', error);
    }

    // Seed Admin User
    try {
        const { default: seedAdmin } = await import('./seed-admin');
        await seedAdmin();
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }

    // Start HTTP server with retry
    try {
        await startHttpServer(PORT);
    } catch (error) {
        console.error(`Failed to start server on port ${PORT}:`, error);
        // Don't exit - process handlers will keep it alive
    }
};

// Process-level error handlers to prevent crashes
process.on('uncaughtException', (error: Error) => {
    console.error(`[${new Date().toISOString()}] UNCAUGHT EXCEPTION:`);
    console.error(`  Message: ${error.message}`);
    console.error(`  Stack: ${error.stack}`);
    // Don't exit - keep service running
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    console.error(`[${new Date().toISOString()}] UNHANDLED REJECTION:`);
    console.error(`  Reason:`, reason);
    // Don't exit - keep service running
});

startServer();



