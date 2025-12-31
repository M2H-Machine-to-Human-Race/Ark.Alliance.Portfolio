import { AdminCvDto, AdminExperienceDto, AdminSkillDto, AdminEducationDto, CvDto } from '../dtos/cv.dto';
import { SkillLevel } from '../enums/skill-level.enum';

export const CV_MOCK: CvDto = {
    profile: {
        firstName: 'Armand',
        lastName: 'Richelet-Kleinberg',
        title: 'AI Lead & Principal Solution Architect',
        overview: 'Pioneered mindful AI solutions and the Ark.Alliance Ecosystem.',
        email: 'contact@example.com',
        linkedinUrl: 'https://linkedin.com/in/armand-rk',
        githubUrl: 'https://github.com/armand-rk'
    },
    experiences: [
        {
            company: "M2H / AI and Technology",
            position: "AI Lead & Principal Solution Architect",
            startDate: "2022-12-01",
            description: "Pioneered mindful AI solutions and the Ark.Alliance Ecosystem. Architected prompt libraries and guidelines for consistent AI experiences. Led full-stack teams (C#, React, Python) in startup environments, implementing resilient patterns (Circuit Breaker, Bulkhead) and robust incident response processes. Built scalable, cloud-native systems from scratch using Agile/DevOps.",
            technologies: []
        },
        {
            company: "Ahold Delhaize / Logistics Supply Chain",
            position: "Solution & Software Architect",
            startDate: "2021-01-01",
            endDate: "2025-02-01",
            description: "Architected and delivered critical logistics systems (TMS integration, delivery tracking). Led technical analysis and acceptance testing. Designed generic integration tools. Coached cross-functional and offshore teams to ensure high-quality delivery during cutover and HyperCare periods.",
            technologies: []
        },
        {
            company: "Candriam / Asset Management",
            position: "Software Architect & Full Stack Dev",
            startDate: "2020-04-01",
            endDate: "2020-12-01",
            description: "Reverse-engineered legacy Mainframe systems to modern .NET microservices. Designed and rewrote the asset position integration system (shares, funds) for financial account managers. Executed a seamless migration with zero downtime during cutover.",
            technologies: []
        },
        {
            company: "Liberty Steel / Steel Industry",
            position: "Business Analyst & Full Stack Dev",
            startDate: "2019-05-01",
            endDate: "2020-04-01",
            description: "Analyzed business flows and developed web-based microservices for steel production logistics. Migrated legacy services to WCF and rewrote production planning schedulers. Integrated deeply with SAP and Mainframe systems using Azure cloud services.",
            technologies: []
        },
        {
            company: "Delhaize Group / Retail Logistics",
            position: "Full Stack Developer & IT Owner",
            startDate: "2011-09-01",
            endDate: "2019-04-01",
            description: "Owned IT delivery for global logistics reporting and supplier management apps. Modernized legacy systems with SAP and WMS integrations (dock scheduling, EDIFACT). Provided L3 support and implemented ITIL processes for resilient 24/7 logistics operations.",
            technologies: []
        },
        {
            company: "Spectacles Charles Kleinberg",
            position: "Solution Architect - Developer & Artist",
            startDate: "2005-01-01",
            endDate: "2015-11-01",
            description: "Architected real-time show control systems synchronizing audio, MIDI, lighting, and 3D Stereoscopic visuals. Developed high-performance interactive solutions in Agile environments. Blended technical engineering with artistic direction for immersive live performances.",
            technologies: []
        },
        {
            company: "BNP Paribas Fortis / Banking",
            position: "ICT Consultant",
            startDate: "2010-11-01",
            endDate: "2011-02-01",
            description: "Consulted on the architecture and full-stack development of robust Voice over IP systems for banking infrastructure.",
            technologies: []
        },
        {
            company: "Mastercard / Financial Services",
            position: "Software Engineer",
            startDate: "2004-11-01",
            endDate: "2005-02-01",
            description: "Developed critical testing and reporting systems for credit card chip compliance. Collaborated on feature launches to enhance global transaction security.",
            technologies: []
        }
    ],
    skills: [
        { name: "C#", category: "Backend", level: SkillLevel.EXPERT },
        { name: "Python", category: "Backend", level: SkillLevel.EXPERT },
        { name: ".NET up to 9", category: "Backend", level: SkillLevel.EXPERT },
        { name: "Microservices", category: "Backend", level: SkillLevel.EXPERT },
        { name: "DDD", category: "Backend", level: SkillLevel.EXPERT },
        { name: "CQRS", category: "Backend", level: SkillLevel.EXPERT },
        { name: "TypeScript", category: "Frontend", level: SkillLevel.EXPERT },
        { name: "React", category: "Frontend", level: SkillLevel.EXPERT },
        { name: "Adobe Suite", category: "Specialized", level: SkillLevel.EXPERT },
        { name: "Unity", category: "Specialized", level: SkillLevel.EXPERT },
        { name: "Three.js", category: "Frontend", level: SkillLevel.EXPERT },
        { name: "Docker", category: "Backend", level: SkillLevel.EXPERT },
        { name: "Kubernetes", category: "Backend", level: SkillLevel.EXPERT },
        { name: "Azure Services", category: "Backend", level: SkillLevel.EXPERT },
        { name: "Event-Driven Architecture", category: "Backend", level: SkillLevel.EXPERT }
    ],
    education: [
        {
            degree: "Master in Computer Science",
            institution: "ULB (Université Libre de Bruxelles)",
            startDate: "1999-09-01",
            endDate: "2004-06-30",
            fieldOfStudy: "Computer Science",
            description: "Specialization in Algorithmic and Software Engineering."
        }
    ]
};
