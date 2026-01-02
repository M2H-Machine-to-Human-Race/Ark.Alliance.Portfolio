import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import http from 'http';
import https from 'https';
import dotenv from 'dotenv';
import readline from 'readline';
import { initializeDatabase } from './database/context/db-context';
import routes from './routes';
import { killPort } from './utils/port-killer';
import { AppDataSource } from './config/database';
import { Project } from './database/entities/project.entity';
import { globalErrorHandler, notFoundHandler } from './middleware/error-handler.middleware';

dotenv.config();

const app = express();
// Default to 3085 as requested, or use ENV if provided
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3085;

// Protocol settings - HTTP by default, HTTPS optional
const USE_HTTPS = process.env.USE_HTTPS === 'true';

app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Serve project assets (carousel images, etc.)
app.use('/Assets', express.static(path.join(__dirname, 'Assets')));

// API Routes
app.use('/api', routes);

// Swagger Documentation
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config';
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint for frontend connection status
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        protocol: req.secure ? 'https' : 'http',
        uptime: process.uptime(),
    });
});

// Health check endpoint (root)
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
 * Certificate configuration
 */
const CERT_CONFIG = {
    folder: 'Certificate',
    keyFile: 'server.key',
    certFile: 'server.crt',
    validityDays: 365,
    renewBeforeDays: 30 // Renew if less than 30 days remaining
};

/**
 * Check if certificate is expired or about to expire
 */
function isCertificateExpired(certPath: string): boolean {
    try {
        const certContent = fs.readFileSync(certPath, 'utf8');
        const crypto = require('crypto');
        const x509 = new crypto.X509Certificate(certContent);

        const notAfter = new Date(x509.validTo);
        const now = new Date();
        const daysRemaining = Math.floor((notAfter.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        console.log(`Certificate expires: ${notAfter.toISOString()}`);
        console.log(`Days remaining: ${daysRemaining}`);

        if (daysRemaining <= 0) {
            console.log('Certificate has expired!');
            return true;
        }

        if (daysRemaining <= CERT_CONFIG.renewBeforeDays) {
            console.log(`Certificate expires in ${daysRemaining} days - renewal recommended`);
            return true;
        }

        return false;
    } catch (error) {
        console.warn('Could not check certificate expiration:', error);
        return true; // Assume expired if we can't check
    }
}

/**
 * Get or generate self-signed certificate for HTTPS
 * Uses Certificate folder and checks for expiration
 */
function getOrCreateCertificate(): { key: string | Buffer; cert: string | Buffer } {
    const certDir = path.join(process.cwd(), CERT_CONFIG.folder);
    const keyPath = path.join(certDir, CERT_CONFIG.keyFile);
    const certPath = path.join(certDir, CERT_CONFIG.certFile);

    // Create Certificate directory if it doesn't exist
    if (!fs.existsSync(certDir)) {
        fs.mkdirSync(certDir, { recursive: true });
        console.log(`Created Certificate folder: ${certDir}`);
    }

    // Check if certs already exist and are valid
    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
        if (!isCertificateExpired(certPath)) {
            console.log('Using existing valid certificate from Certificate folder');
            return {
                key: fs.readFileSync(keyPath),
                cert: fs.readFileSync(certPath)
            };
        }
        console.log('Certificate expired or about to expire - generating new certificate');
    }

    // Generate new certificate using node-forge (synchronous)
    console.log('Generating new self-signed certificate using node-forge...');
    const forge = require('node-forge');
    const pki = forge.pki;

    // Generate RSA key pair
    console.log('Generating RSA 2048-bit key pair...');
    const keys = pki.rsa.generateKeyPair(2048);

    // Create certificate
    const cert = pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setDate(cert.validity.notAfter.getDate() + CERT_CONFIG.validityDays);

    const attrs = [
        { name: 'commonName', value: 'localhost' },
        { name: 'organizationName', value: 'Ark.Portfolio Development' },
        { name: 'countryName', value: 'CA' }
    ];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);

    // Add extensions
    cert.setExtensions([
        { name: 'basicConstraints', cA: false },
        { name: 'keyUsage', digitalSignature: true, keyEncipherment: true },
        { name: 'extKeyUsage', serverAuth: true },
        {
            name: 'subjectAltName',
            altNames: [
                { type: 2, value: 'localhost' },
                { type: 7, ip: '127.0.0.1' }
            ]
        }
    ]);

    // Self-sign the certificate
    cert.sign(keys.privateKey, forge.md.sha256.create());

    // Convert to PEM format
    const privateKeyPem = pki.privateKeyToPem(keys.privateKey);
    const certPem = pki.certificateToPem(cert);

    // Save certificates
    fs.writeFileSync(keyPath, privateKeyPem);
    fs.writeFileSync(certPath, certPem);

    console.log(`Certificate generated and saved to ${CERT_CONFIG.folder}/`);
    console.log(`Valid until: ${cert.validity.notAfter.toISOString()}`);

    return {
        key: privateKeyPem,
        cert: certPem
    };
}

/**
 * Prompt user for protocol selection in interactive dev mode
 */
async function promptProtocolSelection(): Promise<boolean> {
    // Skip prompt if not interactive terminal or CI environment
    if (!process.stdin.isTTY || process.env.CI === 'true') {
        return USE_HTTPS;
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║           Ark.Portfolio Backend - Dev Server               ║');
        console.log('╠════════════════════════════════════════════════════════════╣');
        console.log('║  Select protocol:                                          ║');
        console.log('║    [1] HTTP  (default, simpler for development)            ║');
        console.log('║    [2] HTTPS (auto-signed certificate)                     ║');
        console.log('╚════════════════════════════════════════════════════════════╝');

        rl.question('\nEnter choice [1/2] (default: 1): ', (answer) => {
            rl.close();
            const useHttps = answer.trim() === '2';
            console.log(`\n→ Selected: ${useHttps ? 'HTTPS' : 'HTTP'}\n`);
            resolve(useHttps);
        });

        // Auto-select HTTP after 5 seconds if no input
        setTimeout(() => {
            console.log('\n→ No input received, defaulting to HTTP\n');
            rl.close();
            resolve(false);
        }, 5000);
    });
}

/**
 * Starts the HTTP server with retry logic.
 */
async function startHttpServer(port: number, maxRetries: number = 3): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await new Promise<void>((resolve, reject) => {
                const server = http.createServer(app).listen(port, () => {
                    console.log('════════════════════════════════════════════════════════════');
                    console.log(`  🚀 HTTP Server running on port ${port}`);
                    console.log(`  📍 Access at: http://localhost:${port}`);
                    console.log(`  📚 API Docs:  http://localhost:${port}/api-docs`);
                    console.log('════════════════════════════════════════════════════════════');
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

/**
 * Starts the HTTPS server with retry logic.
 */
async function startHttpsServer(port: number, maxRetries: number = 3): Promise<void> {
    const sslOptions = getOrCreateCertificate();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await new Promise<void>((resolve, reject) => {
                const server = https.createServer(sslOptions, app).listen(port, () => {
                    console.log('════════════════════════════════════════════════════════════');
                    console.log(`  🔒 HTTPS Server running on port ${port}`);
                    console.log(`  📍 Access at: https://localhost:${port}`);
                    console.log(`  📚 API Docs:  https://localhost:${port}/api-docs`);
                    console.log('════════════════════════════════════════════════════════════');
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
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║              Ark.Alliance.Portfolio Backend                 ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Interactive protocol selection for dev mode
    const useHttps = process.env.NODE_ENV === 'production'
        ? USE_HTTPS  // Use env var in production
        : await promptProtocolSelection();  // Interactive in dev

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

    // Start server based on protocol selection
    try {
        if (useHttps) {
            await startHttpsServer(PORT);
        } else {
            await startHttpServer(PORT);
        }
    } catch (error) {
        console.error(`Failed to start server on port ${PORT}:`, error);
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
