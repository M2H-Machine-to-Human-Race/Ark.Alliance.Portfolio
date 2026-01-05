/**
 * @fileoverview Technology Mock Data
 * Mock data for technologies and categories matching backend seed data.
 * Used as fallback when backend/database is unavailable.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { TechnologyDto } from '../dtos/technology.dto';

// =============================================================================
// TECHNOLOGY CATEGORY MOCK (simplified without nested technologies)
// =============================================================================

/**
 * Simple category info for UI display (without nested technologies array).
 */
export interface MockTechnologyCategory {
    id: string;
    name: string;
    description: string;
    order: number;
}

export const MOCK_TECHNOLOGY_CATEGORIES: MockTechnologyCategory[] = [
    { id: 'frontend', name: 'Frontend Frameworks & Libraries', description: 'Client-side web development technologies', order: 1 },
    { id: 'languages', name: 'Programming Languages', description: 'Core programming languages', order: 2 },
    { id: 'runtimes', name: 'Runtimes & Platforms', description: 'Runtime environments and development platforms', order: 3 },
    { id: 'backend', name: 'Backend Frameworks', description: 'Server-side frameworks and libraries', order: 4 },
    { id: 'databases', name: 'Databases', description: 'Relational and NoSQL database systems', order: 5 },
    { id: 'cloud', name: 'Cloud Platforms', description: 'Cloud computing providers and services', order: 6 },
    { id: 'devops', name: 'DevOps & Infrastructure', description: 'CI/CD, containerization, and infrastructure tools', order: 7 },
    { id: 'messaging', name: 'Message Brokers & Queues', description: 'Event streaming and message queue systems', order: 8 },
    { id: 'ai', name: 'AI/ML & Data Science', description: 'Artificial intelligence and machine learning technologies', order: 9 },
    { id: 'enterprise', name: 'Enterprise Systems', description: 'ERP, CRM, and enterprise software platforms', order: 10 },
    { id: 'patterns', name: 'Architecture Patterns', description: 'Architectural patterns and API specifications', order: 11 },
    { id: 'apis', name: 'External APIs & Services', description: 'Third-party APIs and integration services', order: 12 },
    { id: 'testing', name: 'Testing & Quality', description: 'Testing frameworks and quality assurance tools', order: 13 },
    { id: 'mobile', name: 'Mobile Development', description: 'Mobile app development frameworks', order: 14 },
    { id: 'styling', name: 'Styling & Design', description: 'CSS frameworks and design tools', order: 15 }
];

// =============================================================================
// CORE TECHNOLOGIES (subset for fallback - matching projects)
// =============================================================================

export const MOCK_TECHNOLOGIES: TechnologyDto[] = [
    // Frontend
    { key: 'react', name: 'React', label: 'React.js', category: 'frontend', description: 'A JavaScript library for building user interfaces with component-based architecture', icon: 'fab fa-react', color: '#61DAFB', website: 'https://react.dev', versions: ['16', '17', '18', '19'] },
    { key: 'angular', name: 'Angular', label: 'Angular', category: 'frontend', description: 'A TypeScript-based web application framework led by Google', icon: 'fab fa-angular', color: '#DD0031', website: 'https://angular.io' },
    { key: 'vue', name: 'Vue.js', label: 'Vue.js', category: 'frontend', description: 'A progressive JavaScript framework for building user interfaces', icon: 'fab fa-vuejs', color: '#4FC08D', website: 'https://vuejs.org' },
    { key: 'threejs', name: 'Three.js', label: 'Three.js', category: 'frontend', description: 'A cross-browser JavaScript library for creating 3D graphics in web browsers', icon: 'devicon-threejs-original', color: '#000000', website: 'https://threejs.org' },
    { key: 'blazor', name: 'Blazor', label: 'Blazor', category: 'frontend', description: 'A framework for building interactive web UIs using C# instead of JavaScript', icon: 'devicon-dotnetcore-plain', color: '#512BD4', website: 'https://dotnet.microsoft.com/apps/aspnet/web-apps/blazor' },

    // Languages
    { key: 'typescript', name: 'TypeScript', label: 'TypeScript', category: 'languages', description: 'A strongly typed programming language that builds on JavaScript', icon: 'devicon-typescript-plain', color: '#3178C6', website: 'https://www.typescriptlang.org' },
    { key: 'javascript', name: 'JavaScript', label: 'JavaScript', category: 'languages', description: 'A dynamic programming language that powers the web', icon: 'fab fa-js-square', color: '#F7DF1E', website: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
    { key: 'python', name: 'Python', label: 'Python', category: 'languages', description: 'A versatile programming language known for its readability and extensive libraries', icon: 'fab fa-python', color: '#3776AB', website: 'https://www.python.org' },
    { key: 'csharp', name: 'C#', label: 'C#', category: 'languages', description: 'A modern, object-oriented programming language developed by Microsoft', icon: 'devicon-csharp-plain', color: '#239120', website: 'https://docs.microsoft.com/en-us/dotnet/csharp/' },
    { key: 'cpp', name: 'C++', label: 'C++', category: 'languages', description: 'A high-performance programming language for systems and applications', icon: 'devicon-cplusplus-plain', color: '#00599C', website: 'https://isocpp.org' },
    { key: 'java', name: 'Java', label: 'Java', category: 'languages', description: 'A class-based, object-oriented programming language for enterprise applications', icon: 'fab fa-java', color: '#007396', website: 'https://www.java.com' },
    { key: 'cobol', name: 'COBOL', label: 'COBOL', category: 'languages', description: 'A business-oriented programming language used in mainframe systems', icon: 'fas fa-code', color: '#005CA5', website: 'https://www.ibm.com/products/cobol-compiler-zos' },

    // Runtimes
    { key: 'nodejs', name: 'Node.js', label: 'Node.js', category: 'runtimes', description: 'A JavaScript runtime built on Chrome\'s V8 engine for server-side development', icon: 'fab fa-node-js', color: '#339933', website: 'https://nodejs.org' },
    { key: 'dotnet', name: '.NET', label: '.NET', category: 'runtimes', description: 'A free, cross-platform, open-source developer platform by Microsoft', icon: 'devicon-dotnetcore-plain', color: '#512BD4', website: 'https://dotnet.microsoft.com', versions: ['5', '6', '7', '8', '9', '10'] },
    { key: 'unity', name: 'Unity', label: 'Unity Engine', category: 'runtimes', description: 'A cross-platform game engine for 2D/3D games and interactive experiences', icon: 'devicon-unity-original', color: '#000000', website: 'https://unity.com' },

    // Backend
    { key: 'express', name: 'Express.js', label: 'Express.js', category: 'backend', description: 'A fast, unopinionated, minimalist web framework for Node.js', icon: 'devicon-express-original', color: '#000000', website: 'https://expressjs.com' },
    { key: 'nestjs', name: 'NestJS', label: 'NestJS', category: 'backend', description: 'A progressive Node.js framework for building efficient server-side applications', icon: 'devicon-nestjs-plain', color: '#E0234E', website: 'https://nestjs.com' },
    { key: 'fastapi', name: 'FastAPI', label: 'FastAPI', category: 'backend', description: 'A modern, fast Python web framework for building APIs with automatic OpenAPI docs', icon: 'devicon-fastapi-plain', color: '#009688', website: 'https://fastapi.tiangolo.com' },
    { key: 'aspnetcore', name: 'ASP.NET Core', label: 'ASP.NET Core', category: 'backend', description: 'A cross-platform, high-performance framework for building modern web apps', icon: 'devicon-dotnetcore-plain', color: '#512BD4', website: 'https://docs.microsoft.com/en-us/aspnet/core' },

    // Databases
    { key: 'sqlite', name: 'SQLite', label: 'SQLite', category: 'databases', description: 'A lightweight, serverless, self-contained SQL database engine', icon: 'devicon-sqlite-plain', color: '#003B57', website: 'https://www.sqlite.org' },
    { key: 'postgresql', name: 'PostgreSQL', label: 'PostgreSQL', category: 'databases', description: 'A powerful, open-source object-relational database system', icon: 'devicon-postgresql-plain', color: '#4169E1', website: 'https://www.postgresql.org' },
    { key: 'mongodb', name: 'MongoDB', label: 'MongoDB', category: 'databases', description: 'A document-based NoSQL database for modern applications', icon: 'devicon-mongodb-plain', color: '#47A248', website: 'https://www.mongodb.com' },
    { key: 'redis', name: 'Redis', label: 'Redis', category: 'databases', description: 'An in-memory data structure store used as database, cache, and message broker', icon: 'devicon-redis-plain', color: '#DC382D', website: 'https://redis.io' },
    { key: 'sqlserver', name: 'SQL Server', label: 'SQL Server', category: 'databases', description: 'Microsoft\'s enterprise-grade relational database management system', icon: 'devicon-microsoftsqlserver-plain', color: '#CC2927', website: 'https://www.microsoft.com/sql-server' },

    // Cloud
    { key: 'aws', name: 'AWS', label: 'Amazon Web Services', category: 'cloud', description: 'The world\'s leading cloud computing platform by Amazon', icon: 'fab fa-aws', color: '#FF9900', website: 'https://aws.amazon.com' },
    { key: 'azure', name: 'Azure', label: 'Microsoft Azure', category: 'cloud', description: 'Microsoft\'s cloud computing platform for building, testing, and managing applications', icon: 'devicon-azure-plain', color: '#0078D4', website: 'https://azure.microsoft.com' },
    { key: 'gcp', name: 'Google Cloud', label: 'Google Cloud Platform', category: 'cloud', description: 'Google\'s suite of cloud computing services', icon: 'devicon-googlecloud-plain', color: '#4285F4', website: 'https://cloud.google.com' },

    // DevOps
    { key: 'docker', name: 'Docker', label: 'Docker', category: 'devops', description: 'A platform for developing, shipping, and running applications in containers', icon: 'fab fa-docker', color: '#2496ED', website: 'https://www.docker.com' },
    { key: 'kubernetes', name: 'Kubernetes', label: 'Kubernetes (K8s)', category: 'devops', description: 'An open-source system for automating deployment and management of containerized applications', icon: 'devicon-kubernetes-plain', color: '#326CE5', website: 'https://kubernetes.io' },
    { key: 'github-actions', name: 'GitHub Actions', label: 'GitHub Actions', category: 'devops', description: 'CI/CD platform integrated with GitHub for automating workflows', icon: 'fab fa-github', color: '#2088FF', website: 'https://github.com/features/actions' },

    // Messaging
    { key: 'rabbitmq', name: 'RabbitMQ', label: 'RabbitMQ', category: 'messaging', description: 'An open-source message broker implementing AMQP protocol', icon: 'devicon-rabbitmq-original', color: '#FF6600', website: 'https://www.rabbitmq.com' },
    { key: 'kafka', name: 'Kafka', label: 'Apache Kafka', category: 'messaging', description: 'A distributed event streaming platform for high-throughput data pipelines', icon: 'devicon-apachekafka-original', color: '#231F20', website: 'https://kafka.apache.org' },
    { key: 'mqseries', name: 'MQSeries', label: 'IBM MQ', category: 'messaging', description: 'IBM\'s enterprise message-oriented middleware for reliable messaging', icon: 'fas fa-exchange-alt', color: '#052FAD', website: 'https://www.ibm.com/products/mq' },

    // AI
    { key: 'openai', name: 'OpenAI', label: 'OpenAI API', category: 'ai', description: 'AI models and APIs including GPT-4, DALL-E, and Whisper', icon: 'fas fa-robot', color: '#412991', website: 'https://openai.com' },
    { key: 'anthropic', name: 'Anthropic', label: 'Claude API', category: 'ai', description: 'Anthropic\'s Claude AI assistant and API for safe, helpful AI', icon: 'fas fa-brain', color: '#CC9B7A', website: 'https://www.anthropic.com' },
    { key: 'gemini', name: 'Gemini', label: 'Google Gemini', category: 'ai', description: 'Google\'s multimodal AI model for text, images, and code', icon: 'fas fa-gem', color: '#4285F4', website: 'https://deepmind.google/technologies/gemini' },
    { key: 'pytorch', name: 'PyTorch', label: 'PyTorch', category: 'ai', description: 'An open-source machine learning framework based on the Torch library', icon: 'devicon-pytorch-original', color: '#EE4C2C', website: 'https://pytorch.org' },

    // Enterprise
    { key: 'sap', name: 'SAP', label: 'SAP ERP', category: 'enterprise', description: 'Enterprise resource planning software for business operations', icon: 'fas fa-building', color: '#0FAAFF', website: 'https://www.sap.com' },
    { key: 'salesforce', name: 'Salesforce', label: 'Salesforce', category: 'enterprise', description: 'The world\'s leading customer relationship management (CRM) platform', icon: 'devicon-salesforce-plain', color: '#00A1E0', website: 'https://www.salesforce.com' },

    // Patterns
    { key: 'rest', name: 'REST', label: 'RESTful API', category: 'patterns', description: 'Representational State Transfer - an architectural style for distributed systems', icon: 'fas fa-exchange-alt', color: '#4CAF50' },
    { key: 'graphql', name: 'GraphQL', label: 'GraphQL', category: 'patterns', description: 'A query language for APIs and a runtime for fulfilling those queries', icon: 'devicon-graphql-plain', color: '#E10098', website: 'https://graphql.org' },
    { key: 'microservices', name: 'Microservices', label: 'Microservices Architecture', category: 'patterns', description: 'An architectural style that structures an application as loosely coupled services', icon: 'fas fa-cubes', color: '#6C5CE7' },
    { key: 'cqrs', name: 'CQRS', label: 'CQRS', category: 'patterns', description: 'Command Query Responsibility Segregation - separating read and write operations', icon: 'fas fa-exchange-alt', color: '#00B894' },

    // APIs
    { key: 'binance', name: 'Binance', label: 'Binance API', category: 'apis', description: 'APIs for the world\'s largest cryptocurrency exchange', icon: 'fas fa-coins', color: '#F0B90B', website: 'https://www.binance.com' },

    // Styling
    { key: 'tailwind', name: 'Tailwind CSS', label: 'Tailwind CSS', category: 'styling', description: 'A utility-first CSS framework for rapid UI development', icon: 'devicon-tailwindcss-plain', color: '#06B6D4', website: 'https://tailwindcss.com' }
];

/**
 * Get technology by key.
 * Used to lookup technology details for TechBadge and detail modals.
 */
export function getTechnologyByKey(key: string): TechnologyDto | undefined {
    return MOCK_TECHNOLOGIES.find(t => t.key.toLowerCase() === key.toLowerCase());
}

/**
 * Get technologies by category.
 */
export function getTechnologiesByCategory(category: string): TechnologyDto[] {
    return MOCK_TECHNOLOGIES.filter(t => t.category === category);
}

/**
 * Get all technologies grouped by category.
 */
export function getMockTechnologiesGroupedByCategory(): Record<string, TechnologyDto[]> {
    const grouped: Record<string, TechnologyDto[]> = {};
    for (const tech of MOCK_TECHNOLOGIES) {
        if (!grouped[tech.category]) {
            grouped[tech.category] = [];
        }
        grouped[tech.category].push(tech);
    }
    return grouped;
}
