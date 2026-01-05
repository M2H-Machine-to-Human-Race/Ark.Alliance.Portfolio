/**
 * @fileoverview Centralized Seed Data
 * Single source of truth for mock/fallback data, matching backend JSON seed files.
 * 
 * This data mirrors:
 * - InitDbAsset/JsonDatas/profile.json
 * - InitDbAsset/JsonDatas/skills.json
 * - InitDbAsset/JsonDatas/technologies.json
 * - InitDbAsset/JsonDatas/experience.json
 * 
 * @author Armand Richelet-Kleinberg
 */

// =============================================================================
// PROFILE SEED DATA (from profile.json)
// =============================================================================

export const SEED_PROFILE = {
    firstName: "Armand",
    lastName: "Richelet-Kleinberg",
    title: "AI Principal Solutions Architect - Full Stack Dev - Business & Technical Analyst",
    overview: "Experienced AI Principal Architect with 20+ years in software development and system architecture, focused on the AI industry. Specialized in designing and delivering AI-driven solutions, MLOps pipelines, and cloud-native systems using C#, TypeScript (React), Js, Python. Proven ability to build scalable, event-driven architectures and integrate advanced AI frameworks. Expert in Agile/DevOps environments, translating complex AI business needs into robust, production-grade platforms.",
    email: "arkleinberg@gmail.com",
    githubUrl: "https://github.com/ArmandRicheletKleinberg",
    linkedinUrl: "https://do.linkedin.com/in/arkleinberg/es",
    avatarUrl: "/Assets/Site/Icon.png"
} as const;

// =============================================================================
// SKILLS SEED DATA (from skills.json)
// =============================================================================

export const SEED_SKILLS = {
    languages: [
        "C#",
        "Python",
        "Java",
        "TypeScript",
        "JavaScript",
        "C",
        "C++",
        "T-SQL",
        "PL-SQL"
    ],
    frameworks: [
        ".NET up to 10",
        "Entity Framework",
        "Python Ecosystem",
        "Unity",
        "Adobe Suite",
        "Cinema 4D"
    ],
    databases: [
        "SQL Server",
        "SQLite",
        "PostgreSQL",
        "MongoDB",
        "DB2",
        "Oracle 9i",
        "Sybase"
    ],
    tools: [
        "Docker",
        "Kubernetes",
        "Azure Services",
        "GitHub",
        "PyTorch",
        "RabbitMQ",
        "AWS Services",
        "Unreal/Three.js"
    ],
    methodologies: [
        "DDD",
        "CQRS",
        "Event-Driven Architecture",
        "Microservices",
        "MLOps",
        "Agile/Scrum",
        "DevOps"
    ]
} as const;

// =============================================================================
// EXPERIENCE SEED DATA (from experience.json)
// =============================================================================

export interface SeedExperience {
    company: string;
    project: string;
    period: string;
    role: string;
    tech: string;
    desc: string;
}

export const SEED_EXPERIENCES: SeedExperience[] = [
    {
        company: "M2H / AI and Technology",
        project: "Ark.Alliance Ecosystem; Mindful AI Initiatives",
        period: "Dec 2022 - Present",
        role: "AI Lead & Principal Solution Architect",
        tech: "C#, React, TypeScript, Python, Three.js, Docker, K8s, SLM, OpenAI, Anthropic, Mistral",
        desc: "Pioneered mindful AI solutions and the Ark.Alliance Ecosystem. Architected prompt libraries and guidelines for consistent AI experiences. Led full-stack teams (C#, React, Python) in startup environments, implementing resilient patterns (Circuit Breaker, Bulkhead) and robust incident response processes. Built scalable, cloud-native systems from scratch using Agile/DevOps."
    },
    {
        company: "Ahold Delhaize / Logistics Supply Chain",
        project: "New Logistics Systems Design & Optimization",
        period: "Jan 2021 - Feb 2025",
        role: "Solution & Software Architect",
        tech: "C#, .NET 8, Blazor, Microservices, Azure, SAP, CQRS, GitHub, OpenAI API",
        desc: "Architected and delivered critical logistics systems (TMS integration, delivery tracking). Led technical analysis and acceptance testing. Designed generic integration tools. Coached cross-functional and offshore teams to ensure high-quality delivery during cutover and HyperCare periods."
    },
    {
        company: "Candriam / Asset Management",
        project: "Asset Position Integration System",
        period: "Apr 2020 - Dec 2020",
        role: "Software Architect & Full Stack Dev",
        tech: "C#, .NET 5, Docker, MQSeries, DB2, Cobol, Microservices, SQL Server, CQRS",
        desc: "Reverse-engineered legacy Mainframe systems to modern .NET microservices. Designed and rewrote the asset position integration system (shares, funds) for financial account managers. Executed a seamless migration with zero downtime during cutover."
    },
    {
        company: "Liberty Steel / Steel Industry",
        project: "Web-Based Application Portfolio & SAP Integration",
        period: "May 2019 - Apr 2020",
        role: "Business Analyst & Full Stack Dev",
        tech: "C#, .NET Core, TypeScript, Python, Azure, SAP ERP, Clean Architecture, Blazor",
        desc: "Analyzed business flows and developed web-based microservices for steel production logistics. Migrated legacy services to WCF and rewrote production planning schedulers. Integrated deeply with SAP and Mainframe systems using Azure cloud services."
    },
    {
        company: "Delhaize Group / Retail Logistics",
        project: "Logistics Systems Design & Cloud Transformation",
        period: "Sep 2011 - Apr 2019",
        role: "Full Stack Developer & IT Owner",
        tech: "C#, .NET, Entity Framework, Azure, Java, SAP ERP, WMS, IoT, SQL Server/Oracle",
        desc: "Owned IT delivery for global logistics reporting and supplier management apps. Modernized legacy systems with SAP and WMS integrations (dock scheduling, EDIFACT). Provided L3 support and implemented ITIL processes for resilient 24/7 logistics operations."
    },
    {
        company: "Spectacles Charles Kleinberg",
        project: "Live Show Control Systems",
        period: "Jan 2005 - Nov 2015",
        role: "Solution Architect - Developer & Artist",
        tech: "C#, Python, C++, DirectX, Unity, Three.js, Max/Msp, Maya, Real-time Systems",
        desc: "Architected real-time show control systems synchronizing audio, MIDI, lighting, and 3D Stereoscopic visuals. Developed high-performance interactive solutions in Agile environments. Blended technical engineering with artistic direction for immersive live performances."
    },
    {
        company: "BNP Paribas Fortis / Banking",
        project: "Voice over IP Systems",
        period: "Nov 2010 - Feb 2011",
        role: "ICT Consultant",
        tech: ".NET (C#/VB), SQL Server, SOAP",
        desc: "Consulted on the architecture and full-stack development of robust Voice over IP systems for banking infrastructure."
    },
    {
        company: "Mastercard / Financial Services",
        project: "Credit Card Chip Validation",
        period: "Nov 2004 - Feb 2005",
        role: "Software Engineer",
        tech: "C#, C, SQL Server, Assembly",
        desc: "Developed critical testing and reporting systems for credit card chip compliance. Collaborated on feature launches to enhance global transaction security."
    }
];

// =============================================================================
// HOBBIES SEED DATA (from hobbies.json)
// =============================================================================

export interface SeedHobby {
    name: string;
    description: string;
    icon: string;
}

export const SEED_HOBBIES: SeedHobby[] = [
    {
        name: "Music Production",
        description: "Electronic music composition and production using DAWs, synthesizers, and audio engineering techniques.",
        icon: "Music"
    },
    {
        name: "3D Graphics & Animation",
        description: "Creating 3D models, animations, and visual effects using Cinema 4D, Maya, and Three.js.",
        icon: "Box"
    },
    {
        name: "Gaming",
        description: "Strategy games, simulation, and game development exploration.",
        icon: "Gamepad2"
    },
    {
        name: "Photography",
        description: "Digital photography with focus on architectural and landscape subjects.",
        icon: "Camera"
    },
    {
        name: "AI Research",
        description: "Exploring cutting-edge AI technologies, prompt engineering, and building AI-powered applications.",
        icon: "Brain"
    }
];

// =============================================================================
// LANGUAGES SEED DATA (from languages.json)
// =============================================================================

export interface SeedLanguage {
    language: string;
    speaking: number;
    writing: number;
    presenting: number;
}

export const SEED_LANGUAGES: SeedLanguage[] = [
    { language: "French", speaking: 5, writing: 5, presenting: 5 },
    { language: "English", speaking: 5, writing: 5, presenting: 5 },
    { language: "Spanish", speaking: 4, writing: 3, presenting: 3 },
    { language: "Dutch", speaking: 2, writing: 1, presenting: 1 }
];

// =============================================================================
// EDUCATION SEED DATA (from education.json)
// =============================================================================

export interface SeedEducation {
    degree: string;
    institution: string;
    fieldOfStudy: string;
    startYear: number;
    endYear: number;
    description: string;
}

export const SEED_EDUCATION: SeedEducation[] = [
    {
        degree: "Master in Computer Science",
        institution: "ULB (Université Libre de Bruxelles)",
        fieldOfStudy: "Computer Science - Algorithmic and Software Engineering",
        startYear: 1999,
        endYear: 2004,
        description: "Specialization in Algorithmic and Software Engineering. Comprehensive curriculum covering data structures, algorithms, software design patterns, database systems, and artificial intelligence fundamentals."
    }
];

// =============================================================================
// BUSINESS DOMAINS SEED DATA (from business-domains.json)
// =============================================================================

export interface SeedBusinessDomain {
    domain: string;
    level: string;
    yearsOfExperience: number;
    description: string;
    icon: string;
}

export const SEED_BUSINESS_DOMAINS: SeedBusinessDomain[] = [
    {
        domain: "Logistics",
        level: "Expert",
        yearsOfExperience: 12,
        description: "Supply chain management, warehouse systems, TMS integration, delivery tracking, and last-mile logistics optimization.",
        icon: "Truck"
    },
    {
        domain: "Finance",
        level: "Expert",
        yearsOfExperience: 8,
        description: "Asset management, portfolio systems, trading platforms, regulatory compliance, and financial data integration.",
        icon: "TrendingUp"
    },
    {
        domain: "Trading",
        level: "Expert",
        yearsOfExperience: 5,
        description: "Algorithmic trading systems, market data processing, order management, and cryptocurrency platforms.",
        icon: "LineChart"
    },
    {
        domain: "Banking",
        level: "Advanced",
        yearsOfExperience: 3,
        description: "Core banking systems, payment processing, VoIP infrastructure for banking operations.",
        icon: "Building"
    },
    {
        domain: "Asset Management",
        level: "Expert",
        yearsOfExperience: 4,
        description: "Investment portfolio systems, fund management, asset position tracking, and regulatory reporting.",
        icon: "Briefcase"
    },
    {
        domain: "Steel Manufacturing",
        level: "Advanced",
        yearsOfExperience: 2,
        description: "Production planning, SAP ERP integration, supply chain for steel industry, and manufacturing logistics.",
        icon: "Factory"
    },
    {
        domain: "Retail",
        level: "Expert",
        yearsOfExperience: 10,
        description: "E-commerce platforms, inventory management, supplier systems, and omnichannel retail solutions.",
        icon: "ShoppingCart"
    },
    {
        domain: "Entertainment",
        level: "Expert",
        yearsOfExperience: 10,
        description: "Live show control systems, real-time audio/visual synchronization, and interactive performance technology.",
        icon: "Clapperboard"
    },
    {
        domain: "Theatre",
        level: "Expert",
        yearsOfExperience: 10,
        description: "Stage automation, lighting control systems, MIDI integration, and 3D stereoscopic visual effects for live performances.",
        icon: "Drama"
    },
    {
        domain: "Music Composing",
        level: "Advanced",
        yearsOfExperience: 15,
        description: "Original music composition for performances, electronic music production, and sound design.",
        icon: "Music2"
    }
];

// =============================================================================
// TECHNOLOGY CATEGORIES SEED DATA (from technologies.json - categories only)
// =============================================================================

export interface SeedTechnologyCategory {
    id: string;
    name: string;
    description: string;
    order: number;
}

export const SEED_TECHNOLOGY_CATEGORIES: SeedTechnologyCategory[] = [
    { id: "frontend", name: "Frontend Frameworks & Libraries", description: "Client-side web development technologies", order: 1 },
    { id: "languages", name: "Programming Languages", description: "Core programming languages", order: 2 },
    { id: "runtimes", name: "Runtimes & Platforms", description: "Runtime environments and development platforms", order: 3 },
    { id: "backend", name: "Backend Frameworks", description: "Server-side frameworks and libraries", order: 4 },
    { id: "databases", name: "Databases", description: "Relational and NoSQL database systems", order: 5 },
    { id: "cloud", name: "Cloud Platforms", description: "Cloud computing providers and services", order: 6 },
    { id: "devops", name: "DevOps & Infrastructure", description: "CI/CD, containerization, and infrastructure tools", order: 7 },
    { id: "messaging", name: "Message Brokers & Queues", description: "Event streaming and message queue systems", order: 8 },
    { id: "ai", name: "AI/ML & Data Science", description: "Artificial intelligence and machine learning technologies", order: 9 },
    { id: "enterprise", name: "Enterprise Systems", description: "ERP, CRM, and enterprise software platforms", order: 10 },
    { id: "patterns", name: "Architecture Patterns", description: "Architectural patterns and API specifications", order: 11 },
    { id: "apis", name: "External APIs & Services", description: "Third-party APIs and integration services", order: 12 },
    { id: "testing", name: "Testing & Quality", description: "Testing frameworks and quality assurance tools", order: 13 },
    { id: "mobile", name: "Mobile Development", description: "Mobile app development frameworks", order: 14 },
    { id: "styling", name: "Styling & Design", description: "CSS frameworks and design tools", order: 15 }
];

// =============================================================================
// KEY TECHNOLOGIES SEED DATA (subset from technologies.json)
// Note: This is a representative subset. Full tech list is too large for mock data.
// =============================================================================

export interface SeedTechnology {
    key: string;
    name: string;
    label: string;
    category: string;
    description: string;
    icon: string;
    color: string;
    website?: string;
    versions?: string[];
}

export const SEED_TECHNOLOGIES: SeedTechnology[] = [
    { key: "react", name: "React", label: "React.js", category: "frontend", description: "A JavaScript library for building user interfaces with component-based architecture", icon: "fab fa-react", color: "#61DAFB", website: "https://react.dev", versions: ["16", "17", "18", "19"] },
    { key: "typescript", name: "TypeScript", label: "TypeScript", category: "languages", description: "A strongly typed programming language that builds on JavaScript", icon: "devicon-typescript-plain", color: "#3178C6", website: "https://www.typescriptlang.org" },
    { key: "csharp", name: "C#", label: "C#", category: "languages", description: "A modern, object-oriented programming language developed by Microsoft", icon: "devicon-csharp-plain", color: "#239120", website: "https://docs.microsoft.com/en-us/dotnet/csharp/" },
    { key: "python", name: "Python", label: "Python", category: "languages", description: "A versatile programming language known for its readability and extensive libraries", icon: "fab fa-python", color: "#3776AB", website: "https://www.python.org" },
    { key: "nodejs", name: "Node.js", label: "Node.js", category: "runtimes", description: "A JavaScript runtime built on Chrome's V8 engine for server-side development", icon: "fab fa-node-js", color: "#339933", website: "https://nodejs.org" },
    { key: "dotnet", name: ".NET", label: ".NET", category: "runtimes", description: "A free, cross-platform, open-source developer platform by Microsoft", icon: "devicon-dotnetcore-plain", color: "#512BD4", website: "https://dotnet.microsoft.com", versions: ["5", "6", "7", "8", "9", "10"] },
    { key: "docker", name: "Docker", label: "Docker", category: "devops", description: "A platform for developing, shipping, and running applications in containers", icon: "fab fa-docker", color: "#2496ED", website: "https://www.docker.com" },
    { key: "kubernetes", name: "Kubernetes", label: "Kubernetes (K8s)", category: "devops", description: "An open-source system for automating deployment and management of containerized applications", icon: "devicon-kubernetes-plain", color: "#326CE5", website: "https://kubernetes.io" },
    { key: "azure", name: "Azure", label: "Microsoft Azure", category: "cloud", description: "Microsoft's cloud computing platform for building, testing, and managing applications", icon: "devicon-azure-plain", color: "#0078D4", website: "https://azure.microsoft.com" },
    { key: "postgresql", name: "PostgreSQL", label: "PostgreSQL", category: "databases", description: "A powerful, open-source object-relational database system", icon: "devicon-postgresql-plain", color: "#4169E1", website: "https://www.postgresql.org" },
    { key: "mongodb", name: "MongoDB", label: "MongoDB", category: "databases", description: "A document-based NoSQL database for modern applications", icon: "devicon-mongodb-plain", color: "#47A248", website: "https://www.mongodb.com" },
    { key: "openai", name: "OpenAI", label: "OpenAI API", category: "ai", description: "AI models and APIs including GPT-4, DALL-E, and Whisper", icon: "fas fa-robot", color: "#412991", website: "https://openai.com" },
    { key: "pytorch", name: "PyTorch", label: "PyTorch", category: "ai", description: "An open-source machine learning framework based on the Torch library", icon: "devicon-pytorch-original", color: "#EE4C2C", website: "https://pytorch.org" }
];
