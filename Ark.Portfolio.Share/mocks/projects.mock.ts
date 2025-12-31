import { ProjectDto, ProjectFeatureDto, ProjectPageDto } from '../dtos/project.dto';
import { ProjectStatus } from '../enums/project-status.enum';
import { Technology } from '../enums/technology.enum';

export const MOCK_PROJECTS: ProjectDto[] = [
    {
        id: '1',
        title: 'Ark.Alliance Trading Ecosystem',
        description: 'A high-frequency crypto trading bot and ecosystem featuring a cyberpunk dashboard, real-time WebSocket streaming, and AI-driven trend detection. Built on a microservices architecture with a focus on resilience and speed.',
        status: ProjectStatus.IN_PROGRESS,
        technologies: [Technology.CSHARP, Technology.REACT, Technology.TYPESCRIPT, Technology.PYTHON, Technology.DOCKER, Technology.KUBERNETES, Technology.THREEJS],
        imageUrl: '/assets/Bot10.PNG',
        repoUrl: 'https://github.com/ark/alliance',
        demoUrl: 'https://ark-alliance.demo',
        startDate: new Date('2022-12-01'),
        features: [
            { id: 'f1', title: 'Strategy Command Center', description: "The central nerve center of the operation. Visualizes PnL in real-time with sub-millisecond updates via WebSockets. The 'Cyberpunk' aesthetic isn't just for show—it uses high-contrast neon elements to make critical alerts visible instantly.", icon: 'monitor', imageUrl: '/assets/Bot10.PNG' },
            { id: 'f2', title: '3D Market Topography', description: "Interactive Three.js visualization of the order book. Peaks and valleys represent buy/sell walls. This allows the trader to 'Surf the Wave' by visually identifying support and resistance zones in 3D space.", icon: 'box', imageUrl: '/assets/Bot6.PNG' },
            { id: 'f3', title: 'AI Logic Analysis', description: "Real-time introspection into the 'Gemini' AI Strategy. Shows the calculated 'Sigma' (volatility threshold) and 'Trend Confidence' score. This is where the 'Wait' vs 'Trade' decisions happen.", icon: 'cpu', imageUrl: '/assets/Bot2.PNG' },
            { id: 'f4', title: 'Logistics Matrix', description: "A grid view for managing hundreds of concurrent 'Worker' instances. Each cell represents a Docker container running a specific strategy on a specific pair. Green = Profit, Red = Inversion/Loss.", icon: 'grid', imageUrl: '/assets/Bot13.PNG' },
            { id: 'f5', title: 'Configuration Console', description: "Fine-grained control over the 'Click' parameters. Here you set the 'Take Profit Step' (e.g., 0.05%) and the 'Inversion Sigma'. Changes propagate to active instances immediately.", icon: 'sliders', imageUrl: '/assets/Bot5.PNG' },
            { id: 'f6', title: 'Execution Logs', description: "Live stream of order execution events. Tracks latency statistics (e.g., 'Order to Ack: 45ms') and API weight usage to prevent bans.", icon: 'activity', imageUrl: '/assets/Bot4.PNG' }
        ],
        pages: [
            {
                id: 'p1',
                type: 'OVERVIEW',
                title: 'Surfing on the Wave',
                content: "### Philosophy: Chaos as Potential\n\nThe **Ark.Alliance** strategy is built on a simple premise: *You cannot predict the ocean, but you can learn to surf.* \n\nInstead of trying to forecast price 10 minutes from now, the bot reacts to *micro-movements* in the present moment. We call this **'Click Strategy'**.\n\n#### The 'Click' Mechanism\n\n1.  **Entry (The Paddle)**: The bot enters a position based on **Gemini AI Analysis** of order book imbalance and volatility.\n2.  **Surfing (The Ride)**: As the price moves in our favor, the bot executes 'Clicks'—partial take-profits at fixed intervals (e.g., every +0.1% PnL).\n    *   **Ratchet Effect**: Each click raises the 'Inversion Threshold' (Stop Loss), locking in gains.\n3.  **Inversion (The Bail)**: If the wave breaks (price reverses), the bot hits the 'Inversion Threshold'.\n    *   It instantly closes the position and flips to the opposite side (2x quantity).\n    *   **Result**: The surfer catches the *new* wave immediately.\n\n```mermaid\nstateDiagram-v2\n    [*] --> Entry\n    Entry --> Surfing: Price Moves Up\n    Surfing --> Click: +0.1% Gain\n    Click --> Surfing: Raise Safety Net\n    Surfing --> Inversion: Hit Safety Net\n    Inversion --> [*]: Flip Position\n```"
            },
            {
                id: 'p2',
                type: 'TECHNICAL',
                title: 'Engineering Resilience',
                content: "### Speed vs. Reliability\n\nCrypto markets are 24/7 and unforgiving. The bot's architecture prioritizes **Resilience** over raw speed, though it achieves both.\n\n#### 1. Hybrid Push/Pull Architecture\n\nReliance on WebSockets alone is dangerous (silent disconnects). Reliability on Polling alone is too slow. We use **Both**.\n\n*   **Fast Path (Push)**: `BinanceUserDataStream` delivers order updates in ~50ms.\n*   **Safe Path (Pull)**: A `MonitoringLayout` polls the API every 200ms. If the WebSocket misses an event, the Poller catches it.\n\n#### 2. Fee Management & Pre-Computation\n\nTrading frequently ('Clicking') accumulates fees. Ignorance of fees leads to 'Death by a Thousand Cuts'.\n\n*   **Maker vs Taker**: The bot prefers `POST_ONLY` (Maker) orders to gain rebates.\n*   **Pre-Computation**: Before placing *any* trade, the `FuturesCost Service` calculates:\n    *   `OpenFee` + `CloseFee` + `FundingCost`\n    *   **Rule**: The first 'Click' target is moved *further out* to cover these costs. You are never 'Green' until the fees are paid.\n\n#### 3. Rate Limit Arbitrage\n\nBinance allows 1200 weight/minute. \n*   The **RateLimiter** service tracks usage in real-time.\n*   If usage > 80%, it switches non-critical polls to 'Lazy Mode', saving bandwidth for critical 'Inversion' orders.\n\n```mermaid\nsequenceDiagram\n    participant Bot\n    participant RateLimiter\n    participant Binance\n\n    Bot->>RateLimiter: Can I Order?\n    RateLimiter->>RateLimiter: Check Weight (1100/1200)\n    alt Critical (Inversion)\n        RateLimiter-->>Bot: YES (Emergency Override)\n    else Standard (Poll)\n        RateLimiter-->>Bot: PAUSE (Save for Trade)\n    end\n    Bot->>Binance: Execute Order\n```"
            },
            {
                id: 'p3',
                type: 'FUNCTIONAL',
                title: 'Functional Gallery',
                content: "Experience the interface designed for the high-stakes environment of algorithmic trading."
            }
        ]
    },
    {
        id: '2',
        title: 'Logistics Orchestration Platform',
        description: 'A comprehensive logistics supply chain platform for Ahold Delhaize, integrating TMS (Transport Management Systems), SAP, and real-time delivery tracking. Designed for high availability and scale.',
        status: ProjectStatus.COMPLETED,
        technologies: [Technology.CSHARP, Technology.BLAZOR, Technology.AZURE, Technology.SAP],
        imageUrl: '/assets/Bot13.PNG',
        startDate: new Date('2021-01-01'),
        endDate: new Date('2025-02-01'),
        features: [
            { id: 'f4', title: 'TMS Integration', description: 'Seamless connecting with Ortec & Axiodis TMS.', icon: 'truck' },
            { id: 'f5', title: 'Global Tracking', description: 'Real-time visibility into delivery status across Europe.', icon: 'map' }
        ],
        pages: [
            {
                id: 'p3',
                type: 'OVERVIEW',
                title: 'Strategic Impact',
                content: "This platform revitalized the logistics core of a major retailer. By moving from a monolithic legacy system to a **Domain-Driven Design (DDD)** microservices architecture, we achieved:\n\n*   30% reduction in operational costs.\n*   Real-time tracking for customers.\n*   Seamless integration with offshore development teams."
            }
        ]
    },
    {
        id: '3',
        title: 'Live Show Control System',
        description: 'A real-time audiovisual synchronization system for immersive live performances. Controls lighting, 3D stereoscopic visuals, and audio/MIDI in perfect sync.',
        status: ProjectStatus.COMPLETED,
        technologies: [Technology.CPP, Technology.PYTHON, Technology.UNITY, Technology.CSHARP],
        imageUrl: '/assets/Bot6.PNG',
        startDate: new Date('2005-01-01'),
        endDate: new Date('2015-11-01'),
        features: [
            { id: 'f6', title: 'AV Sync', description: 'Frame-perfect synchronization of Audio and Video.', icon: 'music' },
            { id: 'f7', title: '3D Visuals', description: 'Real-time generation of stereoscopic 3D content.', icon: 'box' }
        ],
        pages: []
    }
];
