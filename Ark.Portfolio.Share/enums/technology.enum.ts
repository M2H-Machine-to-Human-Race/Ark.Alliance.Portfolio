/**
 * Technology/Framework enumeration.
 * Represents technologies and frameworks used in portfolio projects.
 * Used for tagging projects and skills.
 * 
 * @remarks
 * This enum should be kept in sync with backend seed data.
 * Add new technologies as needed for new projects.
 */
export enum Technology {
    // ────────────────────────────────────────────────────────────────
    // Frontend Frameworks & Libraries
    // ────────────────────────────────────────────────────────────────
    /** Angular frontend framework */
    ANGULAR = 'Angular',
    /** React frontend library */
    REACT = 'React',
    /** Vue.js frontend framework */
    VUE = 'Vue.js',
    /** Svelte frontend framework */
    SVELTE = 'Svelte',
    /** Next.js React framework */
    NEXTJS = 'Next.js',
    /** Blazor web framework */
    BLAZOR = 'Blazor',
    /** Three.js WebGL library */
    THREEJS = 'Three.js',
    /** TailwindCSS styling framework */
    TAILWIND = 'TailwindCSS',

    // ────────────────────────────────────────────────────────────────
    // Programming Languages
    // ────────────────────────────────────────────────────────────────
    /** TypeScript programming language */
    TYPESCRIPT = 'TypeScript',
    /** JavaScript programming language */
    JAVASCRIPT = 'JavaScript',
    /** Python programming language */
    PYTHON = 'Python',
    /** C# programming language */
    CSHARP = 'C#',
    /** C++ programming language */
    CPP = 'C++',
    /** Java programming language */
    JAVA = 'Java',
    /** Go programming language */
    GO = 'Go',
    /** Rust programming language */
    RUST = 'Rust',
    /** COBOL programming language */
    COBOL = 'Cobol',

    // ────────────────────────────────────────────────────────────────
    // Runtimes & Platforms
    // ────────────────────────────────────────────────────────────────
    /** Node.js runtime environment */
    NODEJS = 'Node.js',
    /** .NET framework/platform */
    DOTNET = '.NET',
    /** .NET 5 framework version */
    DOTNET5 = '.NET 5',
    /** .NET 6 framework version */
    DOTNET6 = '.NET 6',
    /** .NET 7 framework version */
    DOTNET7 = '.NET 7',
    /** .NET 8 framework version */
    DOTNET8 = '.NET 8',
    /** Unity game engine */
    UNITY = 'Unity',
    /** Unreal Engine */
    UNREAL = 'Unreal Engine',

    // ────────────────────────────────────────────────────────────────
    // Databases
    // ────────────────────────────────────────────────────────────────
    /** SQLite database */
    SQLITE = 'SQLite',
    /** PostgreSQL relational database */
    POSTGRESQL = 'PostgreSQL',
    /** MySQL database */
    MYSQL = 'MySQL',
    /** Microsoft SQL Server database */
    SQLSERVER = 'SQL Server',
    /** MongoDB NoSQL database */
    MONGODB = 'MongoDB',
    /** Redis in-memory data store */
    REDIS = 'Redis',
    /** Elasticsearch search engine */
    ELASTICSEARCH = 'Elasticsearch',

    // ────────────────────────────────────────────────────────────────
    // Cloud Platforms
    // ────────────────────────────────────────────────────────────────
    /** Amazon Web Services cloud platform */
    AWS = 'AWS',
    /** Microsoft Azure cloud platform */
    AZURE = 'Azure',
    /** Google Cloud Platform */
    GCP = 'Google Cloud',
    /** DigitalOcean cloud platform */
    DIGITALOCEAN = 'DigitalOcean',

    // ────────────────────────────────────────────────────────────────
    // DevOps & Infrastructure
    // ────────────────────────────────────────────────────────────────
    /** Docker containerization platform */
    DOCKER = 'Docker',
    /** Kubernetes container orchestration */
    KUBERNETES = 'Kubernetes',
    /** Terraform infrastructure as code */
    TERRAFORM = 'Terraform',
    /** GitHub Actions CI/CD */
    GITHUB_ACTIONS = 'GitHub Actions',
    /** Jenkins CI/CD */
    JENKINS = 'Jenkins',

    // ────────────────────────────────────────────────────────────────
    // Message Brokers & Queues
    // ────────────────────────────────────────────────────────────────
    /** RabbitMQ message broker */
    RABBITMQ = 'RabbitMQ',
    /** Apache Kafka event streaming */
    KAFKA = 'Kafka',
    /** IBM MQSeries */
    MQSERIES = 'MQSeries',

    // ────────────────────────────────────────────────────────────────
    // AI/ML & APIs
    // ────────────────────────────────────────────────────────────────
    /** PyTorch machine learning library */
    PYTORCH = 'PyTorch',
    /** TensorFlow machine learning framework */
    TENSORFLOW = 'TensorFlow',
    /** OpenAI API */
    OPENAI = 'OpenAI',
    /** Anthropic Claude API */
    ANTHROPIC = 'Anthropic',
    /** Google Gemini AI */
    GEMINI = 'Gemini',
    /** Hugging Face */
    HUGGINGFACE = 'Hugging Face',

    // ────────────────────────────────────────────────────────────────
    // Enterprise & ERP Systems
    // ────────────────────────────────────────────────────────────────
    /** SAP enterprise software */
    SAP = 'SAP',
    /** Salesforce CRM */
    SALESFORCE = 'Salesforce',

    // ────────────────────────────────────────────────────────────────
    // Architecture Patterns (for tagging purposes)
    // ────────────────────────────────────────────────────────────────
    /** Microservices architecture pattern */
    MICROSERVICES = 'Microservices',
    /** CQRS pattern */
    CQRS = 'CQRS',
    /** Event Sourcing pattern */
    EVENT_SOURCING = 'Event Sourcing',
    /** GraphQL API spec */
    GRAPHQL = 'GraphQL',
    /** REST API architecture */
    REST = 'REST',
    /** gRPC framework */
    GRPC = 'gRPC',

    // ────────────────────────────────────────────────────────────────
    // External APIs
    // ────────────────────────────────────────────────────────────────
    /** Binance cryptocurrency exchange API */
    BINANCE = 'Binance API',
    /** Stripe payment API */
    STRIPE = 'Stripe',
    /** Twilio communications API */
    TWILIO = 'Twilio'
}
